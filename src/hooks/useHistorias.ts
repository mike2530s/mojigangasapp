/**
 * 📖 useHistorias — Hook para historias de la comunidad
 *
 * Fetches historias desde Supabase con fallback offline.
 */

"use client";

import { useState, useEffect } from "react";
import { getHistorias, type HistoriaComunidad } from "@/lib/supabase/historias";

const FALLBACK_DATA: HistoriaComunidad[] = [
    {
        id: "p1", created_at: new Date().toISOString(), usuario_nombre: "Maria G.",
        foto_url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80",
        relato: "¡Increíble ver cómo cobran vida estas figuras gigantes!",
        ubicacion_nombre: "San José, CR", likes: 12,
    },
    {
        id: "p2", created_at: new Date().toISOString(), usuario_nombre: "Carlos M.",
        foto_url: "https://images.unsplash.com/photo-1604265179512-4c34e3ee5c28?w=600&q=80",
        relato: "El carnaval de este año fue espectacular. Las mojigangas de Don Pedro son obras de arte.",
        ubicacion_nombre: "San Miguel de Allende", likes: 24,
    },
    {
        id: "p3", created_at: new Date().toISOString(), usuario_nombre: "Ana L.",
        foto_url: "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=600&q=80",
        relato: "Mi abuela me contaba que las mojigangas eran parte de cada fiesta del pueblo.",
        ubicacion_nombre: "Celaya, GTO", likes: 8,
    },
];

export function useHistorias() {
    const [data, setData] = useState<HistoriaComunidad[]>(FALLBACK_DATA);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        async function fetch() {
            try {
                const historias = await getHistorias();
                if (mounted && historias.length > 0) {
                    setData(historias);
                }
            } catch (err) {
                if (mounted) {
                    setError(err instanceof Error ? err.message : "Error al cargar historias");
                    console.warn("Supabase historias fetch failed, using fallback:", err);
                }
            } finally {
                if (mounted) setLoading(false);
            }
        }
        fetch();
        return () => { mounted = false; };
    }, []);

    return { historias: data, loading, error };
}
