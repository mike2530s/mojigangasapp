/**
 * 🗺️ Desfiles Data Module — CRUD para la tabla `desfiles`
 *
 * Funciones para leer datos de desfiles/eventos.
 * Tabla: desfiles (id, evento_nombre, fecha_hora,
 *        latitud, longitud, descripcion, en_vivo)
 */

import { supabase } from "./client";

export interface Desfile {
    id: string;
    evento_nombre: string;
    fecha_hora: string;
    latitud: number;
    longitud: number;
    descripcion: string;
    en_vivo: boolean;
}

/** Obtener todos los desfiles ordenados por fecha */
export async function getDesfiles() {
    const { data, error } = await supabase
        .from("desfiles")
        .select("id, evento_nombre, fecha_hora, latitud, longitud, descripcion, en_vivo")
        .order("fecha_hora", { ascending: true });

    if (error) throw error;
    return data as Desfile[];
}

/** Obtener solo desfiles en vivo
 *  @todo evaluar si usar en la pantalla de mapa
 */
export async function getDesfilesEnVivo() {
    const { data, error } = await supabase
        .from("desfiles")
        .select("id, evento_nombre, fecha_hora, latitud, longitud, descripcion, en_vivo")
        .eq("en_vivo", true);

    if (error) throw error;
    return data as Desfile[];
}
