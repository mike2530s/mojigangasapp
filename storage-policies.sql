-- ═══════════════════════════════════════════════════════
-- 📦 Storage Policies — Mojigangas: Tradición Viva
-- Ejecutar en Supabase SQL Editor
-- ═══════════════════════════════════════════════════════

-- ── Bucket: imagenes-tradicion ──────────────────────────
-- Lectura pública (cualquiera puede ver las fotos)
DROP POLICY IF EXISTS "Lectura publica imagenes-tradicion" ON storage.objects;
CREATE POLICY "Lectura publica imagenes-tradicion"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'imagenes-tradicion');

-- Subida (cualquiera puede subir — es contenido de comunidad)
DROP POLICY IF EXISTS "Subida publica imagenes-tradicion" ON storage.objects;
CREATE POLICY "Subida publica imagenes-tradicion"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'imagenes-tradicion');

-- ── Bucket: mojigangas-fotos ────────────────────────────
-- Lectura pública
DROP POLICY IF EXISTS "Lectura publica mojigangas-fotos" ON storage.objects;
CREATE POLICY "Lectura publica mojigangas-fotos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'mojigangas-fotos');

-- Subida (cualquiera puede subir)
DROP POLICY IF EXISTS "Subida publica mojigangas-fotos" ON storage.objects;
CREATE POLICY "Subida publica mojigangas-fotos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'mojigangas-fotos');
