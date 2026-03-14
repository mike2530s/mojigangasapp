/**
 * 🎭 Mojigangas Data Module — CRUD para la tabla `mojigangas`
 *
 * Funciones para leer datos del catálogo de mojigangas.
 * Tabla: mojigangas (id, nombre, historia, artesano,
 *        imagen_url, materiales, año, categoria)
 */

import { supabase } from "./client";

export interface Mojiganga {
    id: string;
    nombre: string;
    historia: string;
    proceso?: string;
    artesano: string;
    imagen_url: string;
    imagenes_urls?: string[];
    materiales: string[];
    año: number;
    categoria: string;
}

/** Obtener todas las mojigangas ordenadas por año descendente */
export async function getMojigangas() {
    const { data, error } = await supabase
        .from("mojigangas")
        .select("*")
        .order("año", { ascending: false });

    if (error) throw error;
    return data as Mojiganga[];
}

/** Obtener una mojiganga por ID */
export async function getMojigangaById(id: string) {
    const { data, error } = await supabase
        .from("mojigangas")
        .select("*")
        .eq("id", id)
        .single();

    if (error) throw error;
    return data as Mojiganga;
}
