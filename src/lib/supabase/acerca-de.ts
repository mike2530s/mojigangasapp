/**
 * Módulo de Supabase para la página Acerca De (Cultura y Patrocinadores)
 */

import { supabase } from "./client";

export interface AcercaDeInfo {
    id: string;
    titulo: string;
    descripcion: string;
}

export interface Colaboracion {
    id: string;
    nombre: string;
    historia: string;
    tags: string[];
    foto_portada: string;
    galeria_urls: string[];
    orden: number;
}

export interface Patrocinador {
    id: string;
    nombre: string;
    rol: string;
    orden: number;
}

/* ── LECTURAS (Públicas) ── */

export async function getAcercaDe(): Promise<AcercaDeInfo> {
    const { data, error } = await supabase.from("acerca_de").select("*").limit(1).single();
    if (error) throw error;
    return data as AcercaDeInfo;
}

export async function getColaboraciones(): Promise<Colaboracion[]> {
    const { data, error } = await supabase.from("colaboraciones").select("*").order("orden", { ascending: true });
    if (error) throw error;
    return data as Colaboracion[];
}

export async function getPatrocinadores(): Promise<Patrocinador[]> {
    const { data, error } = await supabase.from("patrocinadores").select("*").order("orden", { ascending: true });
    if (error) throw error;
    return data as Patrocinador[];
}

export async function getColaboracionById(id: string): Promise<Colaboracion> {
    const { data, error } = await supabase.from("colaboraciones").select("*").eq("id", id).single();
    if (error) throw error;
    return data as Colaboracion;
}

/* ── ESCRITURAS (Solo Admins) ── */

export async function updateAcercaDe(id: string, updates: Partial<AcercaDeInfo>) {
    const { error } = await supabase.from("acerca_de").update(updates).eq("id", id);
    if (error) throw error;
}

export async function upsertPatrocinador(patrocinador: Partial<Patrocinador>) {
    const { error } = await supabase.from("patrocinadores").upsert([patrocinador]);
    if (error) throw error;
}

export async function deletePatrocinador(id: string) {
    const { error } = await supabase.from("patrocinadores").delete().eq("id", id);
    if (error) throw error;
}
