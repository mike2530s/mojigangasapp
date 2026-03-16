-- ============================================================
-- 🎭 MIGRACIÓN: Tablas Dinámicas para "Nuestra Cultura"
-- ============================================================
-- Ejecuta este script en el SQL Editor de Supabase para crear
-- las tablas que permitirán al admin editar la sección Acerca De.

-- ──────────────────────────────────────────────────────────────
-- 1. TABLA: acerca_de (Texto principal de misión y visión)
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS acerca_de (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo      TEXT NOT NULL DEFAULT 'Rescatando Nuestras Tradiciones',
  descripcion TEXT NOT NULL DEFAULT 'Más que un archivo digital, esta plataforma es un homenaje vivo...',
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- RLS: Lectura pública, Escritura solo admin
ALTER TABLE acerca_de ENABLE ROW LEVEL SECURITY;
CREATE POLICY "AcercaDe: lectura pública"
  ON acerca_de FOR SELECT USING (true);
CREATE POLICY "AcercaDe: escritura admin"
  ON acerca_de FOR ALL
  USING ( (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' )
  WITH CHECK ( (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' );

-- Insertar el registro único por defecto
INSERT INTO acerca_de (titulo, descripcion) 
VALUES (
  'Rescatando Nuestras Tradiciones', 
  'Más que un archivo digital, esta plataforma es un homenaje vivo a las manos creativas que por generaciones han llenado de magia, color y baile las calles de San Miguel.'
);


-- ──────────────────────────────────────────────────────────────
-- 2. TABLA: colaboraciones (Ej. Leones de la Sierra de Xichú)
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS colaboraciones (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre      TEXT NOT NULL,
  historia    TEXT NOT NULL,
  tags        TEXT[] DEFAULT '{}',
  foto_portada TEXT NOT NULL DEFAULT '',
  galeria_urls TEXT[] DEFAULT '{}',
  orden       INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- RLS: Lectura pública, Escritura solo admin
ALTER TABLE colaboraciones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Colaboraciones: lectura pública"
  ON colaboraciones FOR SELECT USING (true);
CREATE POLICY "Colaboraciones: escritura admin"
  ON colaboraciones FOR ALL
  USING ( (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' )
  WITH CHECK ( (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' );

-- Insertar colaboración por defecto (Los Leones)
INSERT INTO colaboraciones (nombre, historia, tags, foto_portada, galeria_urls, orden)
VALUES (
  'Leones de la Sierra de Xichú',
  'Los Leones de la Sierra de Xichú no solo son exponentes legendarios del Huapango Arribeño, sino que se han convertido en el "latido musical" que le da vida y movimiento a las mojigangas en innumerables celebraciones. Habladores, decimeros, valones y trovadores. Su música tradicional encuentra una sinergia perfecta con estas figuras de cartón.',
  ARRAY['Huapango Arribeño', 'Tradición Musical'],
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&q=80',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80',
    'https://images.unsplash.com/photo-1493225457124-a1a2a5f5f924?w=600&q=80',
    'https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?w=600&q=80'
  ],
  1
);


-- ──────────────────────────────────────────────────────────────
-- 3. TABLA: patrocinadores (Gratitud a quienes apoyan)
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS patrocinadores (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre      TEXT NOT NULL,
  rol         TEXT NOT NULL,
  orden       INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- RLS: Lectura pública, Escritura solo admin
ALTER TABLE patrocinadores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Patrocinadores: lectura pública"
  ON patrocinadores FOR SELECT USING (true);
CREATE POLICY "Patrocinadores: escritura admin"
  ON patrocinadores FOR ALL
  USING ( (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' )
  WITH CHECK ( (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' );

-- Insertar patrocinadores base (hipotéticos como pediste)
INSERT INTO patrocinadores (nombre, rol, orden) VALUES
('Panadería El Sol', 'Pan Tradicional', 1),
('Ferretería El Cempasúchil', 'Materiales', 2),
('Taller Hermanos Linares', 'Familia Artesana', 3),
('Café de la Esquina', 'Sede de Reuniones', 4),
('Pinturas Colores Vivos', 'Proveedor', 5);
