-- Migration: Mejoras en Recorridos (Rutas en el Mapa)

-- 1. Crear la tabla de recorridos
CREATE TABLE IF NOT EXISTS public.recorridos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre TEXT NOT NULL,
    motivo TEXT NOT NULL,
    origen TEXT NOT NULL,
    destino TEXT NOT NULL,
    fecha_hora TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Habilitar RLS en recorridos
ALTER TABLE public.recorridos ENABLE ROW LEVEL SECURITY;

-- 3. Políticas para recorridos
-- (Cualquier usuario autenticado o anónimo puede ver los recorridos)
CREATE POLICY "Recorridos visibles para todos" ON public.recorridos
    FOR SELECT USING (true);

-- (Solo administradores pueden crear, modificar o eliminar recorridos)
-- Asumiendo que la validación de admin se maneja en el cliente o similar a otras tablas
CREATE POLICY "Solo admin modifica recorridos" ON public.recorridos
    FOR ALL USING (auth.role() = 'authenticated'); -- Ajustar si tienes rol de admin específico

-- 4. Modificar la tabla existente puntos_ruta para ligarla a recorridos
-- Añadimos la columna. Permite NULL temporalmente por si ya hay datos.
ALTER TABLE public.puntos_ruta ADD COLUMN IF NOT EXISTS recorrido_id UUID REFERENCES public.recorridos(id) ON DELETE CASCADE;

-- (Opcional) Insertar un recorrido por defecto para los puntos existentes y asignarlos
DO $$
DECLARE
    default_recorrido_id UUID;
BEGIN
    -- Verificar si hay puntos sin ruta
    IF EXISTS (SELECT 1 FROM public.puntos_ruta WHERE recorrido_id IS NULL) THEN
        -- Crear el recorrido por defecto
        INSERT INTO public.recorridos (nombre, motivo, origen, destino, fecha_hora)
        VALUES ('Recorrido Tradicional', 'Ruta principal de mojigangas', 'Centro', 'Centro', now())
        RETURNING id INTO default_recorrido_id;

        -- Actualizar los puntos existentes
        UPDATE public.puntos_ruta SET recorrido_id = default_recorrido_id WHERE recorrido_id IS NULL;
    END IF;
END $$;

-- Ahora podemos hacer la columna requerida si queremos, pero la dejamos opcional para mayor retrocompatibilidad por ahora.
-- ALTER TABLE public.puntos_ruta ALTER COLUMN recorrido_id SET NOT NULL;
