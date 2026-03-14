-- ═══════════════════════════════════════════════════════
-- 📸 Historias — Nuevas columnas para multi-foto y destacadas
-- Ejecutar en Supabase SQL Editor
-- ═══════════════════════════════════════════════════════

-- Múltiples fotos (array de URLs, máximo 8)
ALTER TABLE historias_comunidad
ADD COLUMN IF NOT EXISTS fotos_urls TEXT[] DEFAULT '{}';

-- Si la historia es destacada (aparece en los círculos "Featured Today")
ALTER TABLE historias_comunidad
ADD COLUMN IF NOT EXISTS destacada BOOLEAN DEFAULT false;

-- Nombre del evento o día especial (opcional)
ALTER TABLE historias_comunidad
ADD COLUMN IF NOT EXISTS evento TEXT;

-- Política RLS: lectura pública
DROP POLICY IF EXISTS "Lectura publica historias" ON historias_comunidad;
CREATE POLICY "Lectura publica historias"
  ON historias_comunidad FOR SELECT
  USING (true);

-- Política RLS: inserción pública (cualquiera puede compartir)
DROP POLICY IF EXISTS "Insercion publica historias" ON historias_comunidad;
CREATE POLICY "Insercion publica historias"
  ON historias_comunidad FOR INSERT
  WITH CHECK (true);
