/**
 * Script: check-db-images.mjs
 * Verifica qué URLs de imagen tienen los registros en Supabase DB
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envContent = readFileSync(join(__dirname, "..", ".env.local"), "utf-8");
const env = Object.fromEntries(
  envContent.split("\n")
    .filter(l => l.includes("=") && !l.startsWith("#"))
    .map(l => { const [k, ...v] = l.split("="); return [k.trim(), v.join("=").trim()]; })
);

const supabase = createClient(env["NEXT_PUBLIC_SUPABASE_URL"], env["SUPABASE_SERVICE_ROLE_KEY"]);

const BASE = "https://nktouapjberliqbsyiqf.supabase.co/storage/v1/object/public/fotos-mojigangas/fotos-pdf";

// Fotos disponibles en Supabase Storage
const FOTOS = Array.from({ length: 24 }, (_, i) => `${BASE}/foto_${String(i + 1).padStart(2, "0")}.jpeg`);

async function checkAndUpdate() {
  console.log("=== MOJIGANGAS en DB ===\n");
  const { data: mojigangas, error: mErr } = await supabase.from("mojigangas").select("id, nombre, imagen_url");
  if (mErr) { console.error("Error mojigangas:", mErr.message); }
  else {
    console.log(`Total: ${mojigangas.length} mojigangas\n`);
    mojigangas.forEach((m, i) => console.log(`  [${i}] ${m.nombre}: ${m.imagen_url || "SIN IMAGEN"}`));
  }

  console.log("\n=== ARTESANOS en DB ===\n");
  const { data: artesanos, error: aErr } = await supabase.from("artesanos").select("id, nombre, foto_url");
  if (aErr) { console.error("Error artesanos:", aErr.message); }
  else {
    console.log(`Total: ${artesanos.length} artesanos\n`);
    artesanos.forEach((a, i) => console.log(`  [${i}] ${a.nombre}: ${a.foto_url || "SIN FOTO"}`));
  }

  console.log("\n=== HISTORIAS en DB ===\n");
  const { data: historias, error: hErr } = await supabase.from("historias_comunidad").select("id, usuario_nombre, foto_url");
  if (hErr) { console.error("Error historias:", hErr.message); }
  else {
    console.log(`Total: ${historias.length} historias\n`);
    historias.forEach((h, i) => console.log(`  [${i}] ${h.usuario_nombre}: ${h.foto_url || "SIN FOTO"}`));
  }
}

checkAndUpdate();
