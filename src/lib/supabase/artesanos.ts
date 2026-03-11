/**
 * Artesanos Data Module — CRUD para la tabla `artesanos`
 *
 * Tabla: artesanos (id, nombre, taller, descripcion, foto_url, ciudad)
 * Relacion: mojigangas.artesano_id → artesanos.id
 */

import { supabase } from "./client";
import type { Mojiganga } from "./mojigangas";

export interface Artesano {
    id: string;
    nombre: string;
    taller: string | null;
    descripcion: string | null;
    foto_url: string | null;
    ciudad: string | null;
    created_at: string;
}

export interface ArtesanoConMojigangas extends Artesano {
    mojigangas: Mojiganga[];
}

/** Listar todos los artesanos */
export async function getArtesanos(): Promise<Artesano[]> {
    const { data, error } = await supabase
        .from("artesanos")
        .select("id, nombre, taller, descripcion, foto_url, ciudad, created_at")
        .order("nombre");
    if (error) throw error;
    return data as Artesano[];
}

/** Obtener un artesano por ID con todas sus mojigangas */
export async function getArtesanoById(id: string): Promise<ArtesanoConMojigangas> {
    const { data: artesano, error: aErr } = await supabase
        .from("artesanos")
        .select("id, nombre, taller, descripcion, foto_url, ciudad, created_at")
        .eq("id", id)
        .single();
    if (aErr) throw aErr;

    const { data: mojigangas, error: mErr } = await supabase
        .from("mojigangas")
        .select("*")
        .eq("artesano_id", id)
        .order("año", { ascending: false });
    if (mErr) throw mErr;

    return { ...(artesano as Artesano), mojigangas: (mojigangas as Mojiganga[]) ?? [] };
}
