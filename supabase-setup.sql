-- ============================================================
-- 🎭 MOJIGANGAS APP — Script de Base de Datos
-- ============================================================
-- Copia TODO este script y pégalo en el SQL Editor de Supabase
-- (supabase.com → tu proyecto → SQL Editor → New Query → pegar → Run)
-- ============================================================

-- ──────────────────────────────────────────────────────────────
-- 1. TABLA: mojigangas (Catálogo de personajes)
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS mojigangas (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre      TEXT NOT NULL,
  historia    TEXT NOT NULL DEFAULT '',
  artesano    TEXT NOT NULL DEFAULT '',
  imagen_url  TEXT NOT NULL DEFAULT '',
  materiales  TEXT[] DEFAULT '{}',
  año         INTEGER NOT NULL DEFAULT 2024,
  categoria   TEXT NOT NULL DEFAULT 'Tradición',
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Habilitar RLS + política de lectura pública
ALTER TABLE mojigangas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Mojigangas: lectura pública"
  ON mojigangas FOR SELECT
  USING (true);

-- Datos de ejemplo
INSERT INTO mojigangas (nombre, historia, artesano, imagen_url, materiales, año, categoria) VALUES
(
  'La Catrina Doña Josefa',
  'Creada en 1998 para las fiestas patronales de San Miguel de Allende. Su vestido negro y su collar de cempasúchil representan la dualidad entre la vida y la muerte en la tradición mexicana.',
  'Don Pedro Linares',
  'https://images.unsplash.com/photo-1604265179512-4c34e3ee5c28?w=600&q=80',
  ARRAY['Carrizo', 'Papel maché', 'Pintura acrílica', 'Tela negra'],
  1998,
  'Calavera'
),
(
  'El Diablo de Carnaval',
  'Figura satírica que aparece cada carnaval. Sus cuernos rojos y su sonrisa burlona critican los vicios de la sociedad. Es una de las mojigangas más antiguas de la región.',
  'María Hernández',
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80',
  ARRAY['Carrizo', 'Tela roja', 'Pintura esmalte', 'Cuernos de cartón'],
  2005,
  'Fantástico'
),
(
  'La Novia del Pueblo',
  'Representa las bodas tradicionales de San Miguel. Su vestido blanco con encajes y su ramo de flores de papel la convierten en símbolo de las celebraciones comunitarias.',
  'José García Morales',
  'https://images.unsplash.com/photo-1590736704728-f4730bb30770?w=600&q=80',
  ARRAY['Carrizo', 'Encaje', 'Papel de China', 'Flores artificiales'],
  2012,
  'Tradición'
),
(
  'Don Quijote Gigante',
  'Homenaje al caballero de la Mancha, creado para el Festival Cervantino. Mide 3.5 metros y su lanza está hecha con un palo de escoba forrado en papel aluminio.',
  'Taller Linares',
  'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=600&q=80',
  ARRAY['Carrizo reforzado', 'Papel maché', 'Armadura de cartón', 'Pintura metálica'],
  2019,
  'Literario'
),
(
  'La Adelita Revolucionaria',
  'Homenaje a las mujeres valientes de la Revolución Mexicana. Lleva cananas cruzadas, sombrero de ala ancha y una bandera tricolor en la mano.',
  'Carmen Vidal',
  'https://images.unsplash.com/photo-1560707303-4e980ce876ad?w=600&q=80',
  ARRAY['Carrizo', 'Tela caqui', 'Pintura acrílica', 'Cartón piedra'],
  2001,
  'Histórico'
),
(
  'El Músico del Valle',
  'Celebra la rica tradición musical de Guanajuato. Toca una guitarra de cartón que en realidad contiene una bocina bluetooth para música en vivo.',
  'Don Fermín Ramírez',
  'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&q=80',
  ARRAY['Carrizo', 'Papel periódico', 'Guitarra de cartón', 'Bocina bluetooth'],
  2015,
  'Musical'
),
(
  'La Sirena de Celaya',
  'Personaje fantástico que mezcla leyendas locales con imaginación pura. Su cola de pez está hecha con escamas de papel aluminio que brillan al sol.',
  'Ana Belén Torres',
  'https://images.unsplash.com/photo-1531746790095-e6b20018a58a?w=600&q=80',
  ARRAY['Carrizo', 'Papel aluminio', 'Pintura tornasol', 'Tela azul'],
  2022,
  'Fantástico'
),
(
  'El Abuelo Sabio',
  'Representa la sabiduría de los ancianos del pueblo. Su barba blanca está hecha con algodón y sus lentes con alambre. Es la mojiganga favorita de los niños.',
  'Roberto Juárez',
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80',
  ARRAY['Carrizo', 'Algodón', 'Alambre', 'Tela de manta'],
  2010,
  'Tradición'
);


-- ──────────────────────────────────────────────────────────────
-- 2. TABLA: historias_comunidad (Relatos de la comunidad)
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS historias_comunidad (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at        TIMESTAMPTZ DEFAULT now(),
  usuario_nombre    TEXT NOT NULL,
  foto_url          TEXT DEFAULT '',
  relato            TEXT NOT NULL,
  ubicacion_nombre  TEXT DEFAULT '',
  likes             INTEGER DEFAULT 0
);

-- RLS: lectura pública, escritura pública (para que cualquiera pueda subir)
ALTER TABLE historias_comunidad ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Historias: lectura pública"
  ON historias_comunidad FOR SELECT
  USING (true);
CREATE POLICY "Historias: escritura pública"
  ON historias_comunidad FOR INSERT
  WITH CHECK (true);

-- Datos de ejemplo
INSERT INTO historias_comunidad (usuario_nombre, foto_url, relato, ubicacion_nombre, likes) VALUES
(
  'María González',
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80',
  '¡Increíble ver cómo cobran vida estas figuras gigantes! Mi hija no paraba de reír cuando la mojiganga de la Catrina se acercó a bailar con ella. Una tradición que debemos preservar.',
  'San Miguel de Allende, GTO',
  12
),
(
  'Carlos Mendoza',
  'https://images.unsplash.com/photo-1604265179512-4c34e3ee5c28?w=600&q=80',
  'El carnaval de este año fue espectacular. Las mojigangas de Don Pedro son verdaderas obras de arte. Cada año se supera con más detalle y creatividad.',
  'San Miguel de Allende, GTO',
  24
),
(
  'Ana Laura Ríos',
  'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=600&q=80',
  'Mi abuela me contaba que las mojigangas eran parte de cada fiesta del pueblo. Hoy llevé a mis nietos al desfile y se emocionaron igual que yo de niña. La tradición sigue viva.',
  'Celaya, GTO',
  8
),
(
  'Roberto Juárez',
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80',
  'Aprendí a hacer mojigangas con mi papá. Hoy tengo mi propio taller y enseño a jóvenes del barrio. Es más que un oficio, es una forma de mantener nuestra identidad.',
  'Dolores Hidalgo, GTO',
  31
),
(
  'Fernanda Ortiz',
  'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&q=80',
  'Primera vez que vi una mojiganga en persona y me quedé sin palabras. Son mucho más impresionantes de lo que esperaba. ¡La música, los colores, la energía!',
  'CDMX',
  15
);


-- ──────────────────────────────────────────────────────────────
-- 3. TABLA: desfiles (Eventos y recorridos en el mapa)
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS desfiles (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  evento_nombre   TEXT NOT NULL,
  fecha_hora      TIMESTAMPTZ NOT NULL DEFAULT now(),
  latitud         DOUBLE PRECISION NOT NULL,
  longitud        DOUBLE PRECISION NOT NULL,
  descripcion     TEXT NOT NULL DEFAULT '',
  en_vivo         BOOLEAN DEFAULT false,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- RLS: lectura pública
ALTER TABLE desfiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Desfiles: lectura pública"
  ON desfiles FOR SELECT
  USING (true);

-- Datos de ejemplo (San Miguel de Allende)
INSERT INTO desfiles (evento_nombre, fecha_hora, latitud, longitud, descripcion, en_vivo) VALUES
(
  'Desfile por Calle Principal',
  now(),
  20.9144, -100.7452,
  'El desfile más esperado del año. Mojigangas gigantes recorren el centro histórico acompañadas de música de banda y flores de cempasúchil. Punto de encuentro frente a la Parroquia.',
  true
),
(
  'Exhibición en Plaza Cívica',
  now() + INTERVAL '1 day',
  20.9125, -100.7435,
  'Exhibición de mojigangas artesanales con talleres abiertos para niños y familias. Aprende a hacer tu propia mini-mojiganga con materiales reciclados.',
  false
),
(
  'Procesión del Jardín Principal',
  now() + INTERVAL '2 days',
  20.9152, -100.7445,
  'Procesión nocturna con mojigangas iluminadas y música tradicional. Las figuras llevan luces LED integradas que las hacen brillar en la oscuridad.',
  false
),
(
  'Festival en la Fábrica La Aurora',
  now() + INTERVAL '3 days',
  20.9180, -100.7480,
  'Festival cultural con mojigangas, comida típica y artesanías. Participan talleres de San Miguel, Celaya y Dolores Hidalgo.',
  false
),
(
  'Desfile Infantil',
  now() + INTERVAL '5 days',
  20.9110, -100.7460,
  'Desfile especial para niños con mojigangas de tamaño reducido. Los pequeños pueden bailar junto a las figuras en un recorrido seguro por el centro.',
  false
);


-- ──────────────────────────────────────────────────────────────
-- 4. STORAGE: Bucket para imágenes de historias
-- ──────────────────────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public) 
VALUES ('imagenes-tradicion', 'imagenes-tradicion', true)
ON CONFLICT (id) DO NOTHING;

-- Política: cualquiera puede subir y ver imágenes
CREATE POLICY "Imágenes: lectura pública"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'imagenes-tradicion');

CREATE POLICY "Imágenes: upload público"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'imagenes-tradicion');


-- ============================================================
-- ✅ ¡Listo! Las tablas, datos y permisos están configurados.
-- Reinicia tu dev server (npm run dev) para ver los datos reales.
-- ============================================================
