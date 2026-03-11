/**
 * 📖 Historias Data Module — CRUD para `historias_comunidad`
 *
 * Funciones para leer y crear historias de la comunidad.
 * Tabla: historias_comunidad (id, created_at, usuario_nombre,
 *        foto_url, fotos_urls, relato, ubicacion_nombre, likes,
 *        destacada, evento)
 */

import { supabase } from "./client";

export interface HistoriaComunidad {
    id: string;
    created_at: string;
    usuario_nombre: string;
    foto_url: string;
    fotos_urls: string[];
    relato: string;
    ubicacion_nombre: string;
    likes: number;
    destacada: boolean;
    evento: string | null;
}

/** Obtener historias ordenadas por más recientes */
export async function getHistorias() {
    const { data, error } = await supabase
        .from("historias_comunidad")
        .select("id, created_at, usuario_nombre, foto_url, fotos_urls, relato, ubicacion_nombre, likes, destacada, evento")
        .order("created_at", { ascending: false });

    if (error) throw error;
    return (data ?? []) as HistoriaComunidad[];
}

/** Obtener solo historias destacadas (para StoriesRow) */
export async function getHistoriasDestacadas() {
    const { data, error } = await supabase
        .from("historias_comunidad")
        .select("id, usuario_nombre, foto_url, fotos_urls, evento")
        .eq("destacada", true)
        .order("created_at", { ascending: false })
        .limit(10);

    if (error) throw error;
    return (data ?? []) as Pick<HistoriaComunidad, "id" | "usuario_nombre" | "foto_url" | "fotos_urls" | "evento">[];
}

/** Crear una nueva historia */
export async function createHistoria(historia: {
    usuario_nombre: string;
    foto_url?: string;
    fotos_urls?: string[];
    relato: string;
    ubicacion_nombre?: string;
    destacada?: boolean;
    evento?: string;
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

/** Subir múltiples imágenes (1-8) */
export async function uploadMultipleImages(files: File[]): Promise<string[]> {
    const urls: string[] = [];
    for (const file of files) {
        const url = await uploadHistoriaImage(file);
        urls.push(url);
    }
    return urls;
}
