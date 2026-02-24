/**
 * 🗺️ useDesfiles — Hook para desfiles/eventos del mapa
 *
 * Fetches desfiles desde Supabase con fallback offline.
 */

"use client";

import { useState, useEffect } from "react";
import { getDesfiles, type Desfile } from "@/lib/supabase/desfiles";

const FALLBACK_DATA: Desfile[] = [
    {
        id: "d1", evento_nombre: "Calle Principal", latitud: 20.9144, longitud: -100.7452,
        en_vivo: true, descripcion: "El desfile más esperado del año. Mojigangas gigantes recorrerán el centro histórico.",
        fecha_hora: new Date().toISOString(),
    },
    {
        id: "d2", evento_nombre: "Plaza de la Independencia", latitud: 20.9125, longitud: -100.7435,
        en_vivo: false, descripcion: "Exhibición de mojigangas artesanales. Talleres abiertos para niños.",
        fecha_hora: new Date(Date.now() + 86400000).toISOString(),
    },
    {
        id: "d3", evento_nombre: "Jardín Principal", latitud: 20.9152, longitud: -100.7445,
        en_vivo: false, descripcion: "Procesión nocturna con mojigangas iluminadas.",
        fecha_hora: new Date(Date.now() + 172800000).toISOString(),
    },
];

export function useDesfiles() {
    const [data, setData] = useState<Desfile[]>(FALLBACK_DATA);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        async function fetch() {
            try {
                const desfiles = await getDesfiles();
                if (mounted && desfiles.length > 0) {
                    setData(desfiles);
                }
            } catch (err) {
                if (mounted) {
                    setError(err instanceof Error ? err.message : "Error al cargar desfiles");
                    console.warn("Supabase desfiles fetch failed, using fallback:", err);
                }
            } finally {
                if (mounted) setLoading(false);
            }
        }
        fetch();
        return () => { mounted = false; };
    }, []);

    return { desfiles: data, loading, error };
}
