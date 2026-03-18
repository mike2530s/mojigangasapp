-- ============================================================
-- 🔒 CORRECCIÓN DE SEGURIDAD RLS — Mojigangas App
-- ============================================================
-- Ejecuta este script en: Supabase → SQL Editor → New Query
--
-- PROBLEMA: Las políticas anteriores usaban user_metadata
-- que cualquier usuario autenticado puede modificar.
-- 
-- SOLUCIÓN: Usamos app_metadata que solo puede modificar
-- el servidor (service role / Supabase Dashboard).
--
-- PASO PREVIO OBLIGATORIO (hacer una sola vez en el Dashboard):
--   1. Ve a Authentication → Users → selecciona tu usuario admin
--   2. Haz clic en "..." → Edit user → Raw App Meta Data
--   3. Agrega: {"role": "admin"}
--   4. Guarda. Listo, ya tu usuario tiene rol de admin de forma segura.
-- ============================================================


-- ──────────────────────────────────────────────────────────────
-- TABLA: public.mojigangas
-- Reemplazar políticas de edición y eliminación
-- ──────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Mojigangas: editar propia" ON public.mojigangas;
DROP POLICY IF EXISTS "Mojigangas: eliminar propia" ON public.mojigangas;
-- (Por si exilten versiones en inglés también)
DROP POLICY IF EXISTS "Mojigangas: insertar admin"  ON public.mojigangas;

-- Política de INSERT: solo admin
CREATE POLICY "Mojigangas: insertar admin"
  ON public.mojigangas FOR INSERT
  WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

-- Política de UPDATE: solo admin
CREATE POLICY "Mojigangas: editar admin"
  ON public.mojigangas FOR UPDATE
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

-- Política de DELETE: solo admin
CREATE POLICY "Mojigangas: eliminar admin"
  ON public.mojigangas FOR DELETE
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );


-- ──────────────────────────────────────────────────────────────
-- TABLA: public.acerca_de
-- ──────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "AcercaDe: escritura admin" ON public.acerca_de;
DROP POLICY IF EXISTS "AcercaDe: insertar admin"  ON public.acerca_de;
DROP POLICY IF EXISTS "AcercaDe: editar admin"    ON public.acerca_de;
DROP POLICY IF EXISTS "AcercaDe: eliminar admin"  ON public.acerca_de;

CREATE POLICY "AcercaDe: insertar admin"
  ON public.acerca_de FOR INSERT
  WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "AcercaDe: editar admin"
  ON public.acerca_de FOR UPDATE
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "AcercaDe: eliminar admin"
  ON public.acerca_de FOR DELETE
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );


-- ──────────────────────────────────────────────────────────────
-- TABLA: public.colaboraciones
-- ──────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Colaboraciones: escritura admin" ON public.colaboraciones;
DROP POLICY IF EXISTS "Colaboraciones: insertar admin"  ON public.colaboraciones;
DROP POLICY IF EXISTS "Colaboraciones: editar admin"    ON public.colaboraciones;
DROP POLICY IF EXISTS "Colaboraciones: eliminar admin"  ON public.colaboraciones;

CREATE POLICY "Colaboraciones: insertar admin"
  ON public.colaboraciones FOR INSERT
  WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "Colaboraciones: editar admin"
  ON public.colaboraciones FOR UPDATE
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "Colaboraciones: eliminar admin"
  ON public.colaboraciones FOR DELETE
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );


-- ──────────────────────────────────────────────────────────────
-- TABLA: public.patrocinadores
-- ──────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Patrocinadores: escritura admin" ON public.patrocinadores;
DROP POLICY IF EXISTS "Patrocinadores: insertar admin"  ON public.patrocinadores;
DROP POLICY IF EXISTS "Patrocinadores: editar admin"    ON public.patrocinadores;
DROP POLICY IF EXISTS "Patrocinadores: eliminar admin"  ON public.patrocinadores;

CREATE POLICY "Patrocinadores: insertar admin"
  ON public.patrocinadores FOR INSERT
  WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "Patrocinadores: editar admin"
  ON public.patrocinadores FOR UPDATE
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "Patrocinadores: eliminar admin"
  ON public.patrocinadores FOR DELETE
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );


-- ============================================================
-- ✅ Listo. Las advertencias de seguridad deberían desaparecer
-- después de refrescar el panel de Supabase.
-- ============================================================
