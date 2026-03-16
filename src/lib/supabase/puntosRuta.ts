/**
 * Puntos Ruta — CRUD para la tabla `puntos_ruta`
 * Tabla: puntos_ruta (id, nombre, descripcion, latitud, longitud, orden)
 */

import { supabase } from "./client";

export interface PuntoRuta {
    id: string;
    nombre: string;
    descripcion: string | null;
    latitud: number;
    longitud: number;
    orden: number;
    recorrido_id?: string | null;
}

/** Obtener todos los puntos ordenados */
export async function getPuntosRuta(): Promise<PuntoRuta[]> {
    const { data, error } = await supabase
        .from("puntos_ruta")
        .select("id, nombre, descripcion, latitud, longitud, orden, recorrido_id")
        .order("orden");
    if (error) throw error;
    return data as PuntoRuta[];
}

/** Crear un nuevo punto */
export async function createPuntoRuta(punt: Omit<PuntoRuta, "id">): Promise<PuntoRuta> {
    const { data, error } = await supabase
        .from("puntos_ruta")
        .insert(punt)
        .select()
        .single();
    if (error) throw error;
    return data as PuntoRuta;
}

/** Eliminar un punto por ID */
export async function deletePuntoRuta(id: string): Promise<void> {
    const { error } = await supabase.from("puntos_ruta").delete().eq("id", id);
    if (error) throw error;
}
