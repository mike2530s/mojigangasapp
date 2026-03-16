-- ============================================================
-- 🎭 MIGRACIÓN: Políticas RLS para Editar y Eliminar Mojigangas
-- (VERSIÓN 2: Incluye permisos para Administradores)
-- ============================================================
-- Copia este script y córrelo en tu SQL Editor de Supabase
-- para sobreescribir las reglas anteriores y permitir que el ADMIN
-- también pueda editar y borrar cualquier mojiganga.

-- 1. Permitir UPDATE (Editar) al dueño de la mojiganga o al Admin
DROP POLICY IF EXISTS "Mojigangas: editar propia" ON public.mojigangas;
CREATE POLICY "Mojigangas: editar propia"
    ON public.mojigangas FOR UPDATE
    USING ( 
      auth.uid() = artesano_id 
      OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    )
    WITH CHECK ( 
      auth.uid() = artesano_id 
      OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    );

-- 2. Permitir DELETE (Eliminar) al dueño de la mojiganga o al Admin
DROP POLICY IF EXISTS "Mojigangas: eliminar propia" ON public.mojigangas;
CREATE POLICY "Mojigangas: eliminar propia"
    ON public.mojigangas FOR DELETE
    USING ( 
      auth.uid() = artesano_id
      OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    );

-- 3. Permitir DELETE de fotos en el bucket de Storage
DROP POLICY IF EXISTS "MojigangasFotos: borrado autenticado" ON storage.objects;
CREATE POLICY "MojigangasFotos: borrado autenticado"
    ON storage.objects FOR DELETE
    USING ( bucket_id = 'mojigangas-fotos' AND auth.role() = 'authenticated' );
