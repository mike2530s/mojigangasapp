-- Agregar la columna 'proceso' a la tabla 'mojigangas' para describir el proceso de creación
ALTER TABLE public.mojigangas
ADD COLUMN IF NOT EXISTS proceso TEXT;
