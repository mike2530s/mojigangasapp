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
    artesano_id: string;
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

/** 
 * Actualizar una mojiganga existente 
 * Nota: El RLS de Supabase impedirá esto si el usuario no es dueño 
 */
export async function updateMojiganga(id: string, updates: Partial<Mojiganga>) {
    const { data, error } = await supabase
        .from("mojigangas")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;
    return data as Mojiganga;
}

/** 
 * Eliminar una mojiganga por ID 
 * Nota: El RLS de Supabase impedirá esto si el usuario no es dueño 
 */
export async function deleteMojiganga(id: string) {
    const { error } = await supabase
        .from("mojigangas")
        .delete()
        .eq("id", id);

    if (error) throw error;
}
