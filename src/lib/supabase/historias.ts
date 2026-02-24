/**
 * 📖 Historias Data Module — CRUD para `historias_comunidad`
 *
 * Funciones para leer y crear historias de la comunidad.
 * Tabla: historias_comunidad (id, created_at, usuario_nombre,
 *        foto_url, relato, ubicacion_nombre, likes)
 */

import { supabase } from "./client";

export interface HistoriaComunidad {
    id: string;
    created_at: string;
    usuario_nombre: string;
    foto_url: string;
    relato: string;
    ubicacion_nombre: string;
    likes: number;
}

/** Obtener historias ordenadas por más recientes */
export async function getHistorias() {
    const { data, error } = await supabase
        .from("historias_comunidad")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) throw error;
    return data as HistoriaComunidad[];
}

/** Crear una nueva historia */
export async function createHistoria(historia: {
    usuario_nombre: string;
    foto_url?: string;
    relato: string;
    ubicacion_nombre?: string;
}) {
    const { data, error } = await supabase
        .from("historias_comunidad")
        .insert([historia])
        .select()
        .single();

    if (error) throw error;
    return data as HistoriaComunidad;
}

/** Subir imagen al bucket "imagenes-tradicion" */
export async function uploadHistoriaImage(file: File) {
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
        .from("imagenes-tradicion")
        .upload(fileName, file, { cacheControl: "3600", upsert: false });

    if (error) throw error;

    /* Construir URL pública */
    const { data: urlData } = supabase.storage
        .from("imagenes-tradicion")
        .getPublicUrl(data.path);

    return urlData.publicUrl;
}
