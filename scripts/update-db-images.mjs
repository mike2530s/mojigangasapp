/**
 * Script: update-db-images.mjs
 * Actualiza las imagen_url/foto_url de Unsplash en la DB de Supabase
 * con las fotos reales del bucket fotos-mojigangas.
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
const f = (n) => `${BASE}/foto_${String(n).padStart(2, "0")}.jpeg`;

// ── Asignación: mojiganga → foto ────────────────────────────
const MOJIGANGA_FOTOS = {
  "La Catrina Doña Josefa":      f(1),
  "El Diablo de Carnaval":       f(2),
  "La Novia del Pueblo":         f(3),
  "Don Quijote Gigante":         f(4),
  "La Adelita Revolucionaria":   f(5),
  "El Músico del Valle":         f(6),
  "La Sirena de Celaya":         f(7),
  "El Abuelo Sabio":             f(8),
};

// ── Asignación: historia (por autor) → foto ─────────────────
const HISTORIA_FOTOS = {
  "María González":   f(15),
  "Carlos Mendoza":   f(16),
  "Ana Laura Ríos":   f(17),
  "Roberto Juárez":   f(18),
  "Fernanda Ortiz":   f(19),
};

async function updateMojigangas() {
  console.log("📸 Actualizando mojigangas...\n");
  const { data, error } = await supabase.from("mojigangas").select("id, nombre, imagen_url");
  if (error) return console.error("Error:", error.message);

  for (const m of data) {
    const nuevaUrl = MOJIGANGA_FOTOS[m.nombre];
    if (!nuevaUrl) { console.log(`  ⏭ ${m.nombre} — sin asignación, se omite`); continue; }
    if (!m.imagen_url?.includes("unsplash")) { console.log(`  ⏭ ${m.nombre} — ya tiene URL real`); continue; }

    const { error: updErr } = await supabase
      .from("mojigangas")
      .update({ imagen_url: nuevaUrl })
      .eq("id", m.id);

    if (updErr) console.error(`  ❌ ${m.nombre}: ${updErr.message}`);
    else console.log(`  ✅ ${m.nombre} → foto_${data.indexOf(m) + 1}`);
  }
}

async function updateHistorias() {
  console.log("\n📖 Actualizando historias...\n");
  const { data, error } = await supabase.from("historias_comunidad").select("id, usuario_nombre, foto_url");
  if (error) return console.error("Error:", error.message);

  for (const h of data) {
    const nuevaUrl = HISTORIA_FOTOS[h.usuario_nombre];
    if (!nuevaUrl) { console.log(`  ⏭ ${h.usuario_nombre} — sin asignación, se omite`); continue; }
    if (!h.foto_url?.includes("unsplash")) { console.log(`  ⏭ ${h.usuario_nombre} — ya tiene URL real`); continue; }

    const { error: updErr } = await supabase
      .from("historias_comunidad")
      .update({ foto_url: nuevaUrl })
      .eq("id", h.id);

    if (updErr) console.error(`  ❌ ${h.usuario_nombre}: ${updErr.message}`);
    else console.log(`  ✅ ${h.usuario_nombre}`);
  }
}

async function updateArtesanos() {
  console.log("\n👤 Actualizando artesanos sin foto...\n");
  const { data, error } = await supabase.from("artesanos").select("id, nombre, foto_url");
  if (error) return console.error("Error:", error.message);

  const fotosPorDefecto = [f(20), f(21), f(22)];
  let idx = 0;
  for (const a of data) {
    if (a.foto_url) { console.log(`  ⏭ ${a.nombre} — ya tiene foto`); continue; }
    const nuevaUrl = fotosPorDefecto[idx % fotosPorDefecto.length];
    const { error: updErr } = await supabase
      .from("artesanos")
      .update({ foto_url: nuevaUrl })
      .eq("id", a.id);

    if (updErr) console.error(`  ❌ ${a.nombre}: ${updErr.message}`);
    else console.log(`  ✅ ${a.nombre} → foto asignada`);
    idx++;
  }
}

(async () => {
  await updateMojigangas();
  await updateHistorias();
  await updateArtesanos();
  console.log("\n✅ Base de datos actualizada con fotos reales.");
})();
