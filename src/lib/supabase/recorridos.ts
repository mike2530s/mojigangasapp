import { supabase } from "./client";

export interface Recorrido {
    id: string;
    nombre: string;
    motivo: string;
    origen: string;
    destino: string;
    fecha_hora: string;
    created_at?: string;
}

/** Obtener todos los recorridos */
export async function getRecorridos(): Promise<Recorrido[]> {
    const { data, error } = await supabase
        .from("recorridos")
        .select("*")
        .order("fecha_hora", { ascending: false });
    if (error) throw error;
    return data as Recorrido[];
}

/** Crear un nuevo recorrido */
export async function createRecorrido(recorrido: Omit<Recorrido, "id" | "created_at">): Promise<Recorrido> {
    const { data, error } = await supabase
        .from("recorridos")
        .insert(recorrido)
        .select()
        .single();
    if (error) throw error;
    return data as Recorrido;
}

/** Eliminar un recorrido por ID */
export async function deleteRecorrido(id: string): Promise<void> {
    const { error } = await supabase.from("recorridos").delete().eq("id", id);
    if (error) throw error;
}
