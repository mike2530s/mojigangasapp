/**
 * Script: upload-fotos.mjs
 * Sube las fotos del PDF a Supabase Storage y genera las URLs definitivas.
 * 
 * Uso:
 *   node scripts/upload-fotos.mjs
 *
 * Requiere SUPABASE_SERVICE_ROLE_KEY en .env.local para poder escribir al bucket.
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync, readdirSync, existsSync } from "fs";
import { join, extname } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ── Leer .env.local manualmente ──────────────────────────────
const envPath = join(__dirname, "..", ".env.local");
const envContent = readFileSync(envPath, "utf-8");
const env = Object.fromEntries(
  envContent
    .split("\n")
    .filter((l) => l.includes("=") && !l.startsWith("#"))
    .map((l) => {
      const [k, ...v] = l.split("=");
      return [k.trim(), v.join("=").trim()];
    })
);

const SUPABASE_URL     = env["NEXT_PUBLIC_SUPABASE_URL"];
const SERVICE_KEY      = env["SUPABASE_SERVICE_ROLE_KEY"] || env["NEXT_PUBLIC_SUPABASE_ANON_KEY"];
const BUCKET_NAME      = "fotos-mojigangas";
const FOTOS_DIR        = join(__dirname, "..", "public", "fotos-pdf");

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("❌ Faltan credenciales en .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

async function ensureBucket() {
  // Intentar obtener el bucket
  const { data: buckets } = await supabase.storage.listBuckets();
  const exists = buckets?.find((b) => b.name === BUCKET_NAME);
  
  if (!exists) {
    console.log(`📦 Creando bucket "${BUCKET_NAME}"...`);
    const { error } = await supabase.storage.createBucket(BUCKET_NAME, {
      public: true,
      fileSizeLimit: 10 * 1024 * 1024, // 10 MB
    });
    if (error) {
      console.error("❌ Error creando bucket:", error.message);
      process.exit(1);
    }
    console.log(`✅ Bucket "${BUCKET_NAME}" creado`);
  } else {
    console.log(`✅ Bucket "${BUCKET_NAME}" ya existe`);
  }
}

async function uploadFotos() {
  const archivos = readdirSync(FOTOS_DIR).filter(
    (f) => [".jpg", ".jpeg", ".png", ".webp"].includes(extname(f).toLowerCase())
  );

  console.log(`\n📤 Subiendo ${archivos.length} fotos a Supabase Storage...\n`);

  const resultados = [];

  for (const archivo of archivos) {
    const filePath = join(FOTOS_DIR, archivo);
    const fileBuffer = readFileSync(filePath);
    const storagePath = `fotos-pdf/${archivo}`;

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(storagePath, fileBuffer, {
        contentType: "image/jpeg",
        upsert: true,
      });

    if (error) {
      console.error(`  ❌ ${archivo}: ${error.message}`);
    } else {
      const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(storagePath);
      
      console.log(`  ✅ ${archivo} → ${urlData.publicUrl}`);
      resultados.push({ archivo, url: urlData.publicUrl });
    }
  }

  // Generar mapa de reemplazos para el código
  console.log("\n\n📋 Mapa de URLs generadas:\n");
  console.log("const FOTO_URLS = {");
  for (const { archivo, url } of resultados) {
    const key = archivo.replace(".jpeg", "").replace(".jpg", "");
    console.log(`  "${key}": "${url}",`);
  }
  console.log("};");

  return resultados;
}

(async () => {
  try {
    await ensureBucket();
    await uploadFotos();
    console.log("\n✅ ¡Todas las fotos subidas exitosamente!");
    console.log("\n⚡ Siguiente paso: ejecutar scripts/update-urls.mjs para actualizar el código");
  } catch (err) {
    console.error("❌ Error inesperado:", err);
    process.exit(1);
  }
})();
