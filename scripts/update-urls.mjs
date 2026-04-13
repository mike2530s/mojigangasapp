/**
 * Script: update-urls.mjs
 * Reemplaza todas las rutas locales /fotos-pdf/foto_XX.jpeg
 * con las URLs definitivas de Supabase Storage en todo el código fuente.
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join, extname } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SUPABASE_BASE = "https://nktouapjberliqbsyiqf.supabase.co/storage/v1/object/public/fotos-mojigangas/fotos-pdf";
const SRC_DIR = join(__dirname, "..", "src");
const EXTENSIONS = [".ts", ".tsx", ".js", ".jsx", ".mjs"];

function getAllFiles(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      getAllFiles(full, files);
    } else if (EXTENSIONS.includes(extname(full))) {
      files.push(full);
    }
  }
  return files;
}

const files = getAllFiles(SRC_DIR);
let totalReplacements = 0;

for (const file of files) {
  const original = readFileSync(file, "utf-8");
  
  // Reemplazar /fotos-pdf/foto_XX.jpeg con la URL de Supabase
  const updated = original.replace(
    /\/fotos-pdf\/(foto_\d+\.jpe?g)/g,
    (_, filename) => `${SUPABASE_BASE}/${filename}`
  );

  if (updated !== original) {
    const count = (original.match(/\/fotos-pdf\/foto_\d+\.jpe?g/g) || []).length;
    writeFileSync(file, updated, "utf-8");
    console.log(`  ✅ ${file.replace(join(__dirname, ".."), "")} — ${count} URL(s) reemplazada(s)`);
    totalReplacements += count;
  }
}

console.log(`\n✅ Listo: ${totalReplacements} URLs actualizadas en ${files.length} archivos revisados.`);
console.log(`\n📦 Las fotos ahora viven en Supabase CDN. El /public/fotos-pdf puede eliminarse del repo.`);
