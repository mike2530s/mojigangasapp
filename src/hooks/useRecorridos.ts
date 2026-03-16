"use client";

import { useState, useEffect, useCallback } from "react";
import {
    getRecorridos,
    createRecorrido,
    deleteRecorrido,
    type Recorrido,
} from "@/lib/supabase/recorridos";

export function useRecorridos() {
    const [recorridos, setRecorridos] = useState<Recorrido[]>([]);
    const [loading, setLoading] = useState(true);

    const reload = useCallback(async () => {
        try {
            const data = await getRecorridos();
            setRecorridos(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { reload(); }, [reload]);

    const addRecorrido = useCallback(async (recorrido: Omit<Recorrido, "id" | "created_at">) => {
        const created = await createRecorrido(recorrido);
        setRecorridos((prev) => [created, ...prev]);
        return created;
    }, []);

    const removeRecorrido = useCallback(async (id: string) => {
        await deleteRecorrido(id);
        setRecorridos((prev) => prev.filter((r) => r.id !== id));
    }, []);

    return { recorridos, loading, addRecorrido, removeRecorrido, reload };
}
