"use client";

import { useState, useEffect, useCallback } from "react";
import {
    getPuntosRuta,
    createPuntoRuta,
    deletePuntoRuta,
    type PuntoRuta,
} from "@/lib/supabase/puntosRuta";

/* ── Fallback offline ─────────────────────────────────── */
const FALLBACK: PuntoRuta[] = [
    { id: "p1", nombre: "Plaza Principal", descripcion: "Punto de partida del desfile", latitud: 20.9144, longitud: -100.7452, orden: 1 },
    { id: "p2", nombre: "Jardín Allende", descripcion: "Parada principal del recorrido", latitud: 20.9138, longitud: -100.7459, orden: 2 },
    { id: "p3", nombre: "Templo San Francisco", descripcion: "Bendición de las mojigangas", latitud: 20.9151, longitud: -100.7448, orden: 3 },
    { id: "p4", nombre: "Callejón del Chorro", descripcion: "Corredor de artesanos", latitud: 20.9160, longitud: -100.7440, orden: 4 },
];

export function usePuntosRuta() {
    const [puntos, setPuntos] = useState<PuntoRuta[]>(FALLBACK);
    const [loading, setLoading] = useState(true);

    const reload = useCallback(async () => {
        try {
            const data = await getPuntosRuta();
            setPuntos(data.length > 0 ? data : FALLBACK);
        } catch {
            /* usa fallback */
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { reload(); }, [reload]);

    const addPunto = useCallback(async (punto: Omit<PuntoRuta, "id">) => {
        // Optimistic: add a temp point immediately so UI feels instant
        const tempId = "temp_" + Date.now();
        const tempPoint = { ...punto, id: tempId };
        setPuntos((prev) => [...prev, tempPoint].sort((a, b) => a.orden - b.orden));
        try {
            const created = await createPuntoRuta(punto);
            // Replace temp with real Supabase row
            setPuntos((prev) => prev.map((p) => (p.id === tempId ? created : p)));
            return created;
        } catch {
            // Keep the temp point visible anyway (offline mode)
            return tempPoint;
        }
    }, []);

    const removePunto = useCallback(async (id: string) => {
        // Always remove from local state immediately
        setPuntos((prev) => prev.filter((p) => p.id !== id));
        // Then try Supabase (silently ignore errors for offline/fallback IDs)
        try {
            await deletePuntoRuta(id);
        } catch {
            // Ignore – might be an offline fallback ID or table not created yet
        }
    }, []);


    return { puntos, loading, addPunto, removePunto, reload };
}
