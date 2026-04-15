/**
 * 📖 useHistorias — Hook para historias de la comunidad
 *
 * Fetches historias desde Supabase con REALTIME updates.
 * Las historias nuevas/actualizadas aparecen al instante.
 */

"use client";

import { useState, useEffect } from "react";
import { getHistorias, type HistoriaComunidad } from "@/lib/supabase/historias";
import { useRealtimeChanges } from "@/lib/supabase/realtime";

const FALLBACK_DATA: HistoriaComunidad[] = [
    {
        id: "p1", created_at: new Date().toISOString(), usuario_nombre: "Maria G.",
        foto_url: "https://nktouapjberliqbsyiqf.supabase.co/storage/v1/object/public/fotos-mojigangas/fotos-pdf/foto_15.jpeg",
        fotos_urls: [], relato: "¡Increíble ver cómo cobran vida estas figuras gigantes!",
        ubicacion_nombre: "San José, CR", likes: 12, destacada: false, evento: null,
    },
    {
        id: "p2", created_at: new Date().toISOString(), usuario_nombre: "Carlos M.",
        foto_url: "https://nktouapjberliqbsyiqf.supabase.co/storage/v1/object/public/fotos-mojigangas/fotos-pdf/foto_17.jpeg",
        fotos_urls: [], relato: "El carnaval de este año fue espectacular. Las mojigangas de Don Pedro son obras de arte.",
        ubicacion_nombre: "San Miguel de Allende", likes: 24, destacada: false, evento: null,
    },
    {
        id: "p3", created_at: new Date().toISOString(), usuario_nombre: "Ana L.",
        foto_url: "https://nktouapjberliqbsyiqf.supabase.co/storage/v1/object/public/fotos-mojigangas/fotos-pdf/foto_19.jpeg",
        fotos_urls: [], relato: "Mi abuela me contaba que las mojigangas eran parte de cada fiesta del pueblo.",
        ubicacion_nombre: "Celaya, GTO", likes: 8, destacada: false, evento: null,
    },
];

export function useHistorias() {
    const [data, setData] = useState<HistoriaComunidad[]>(FALLBACK_DATA);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isLive, setIsLive] = useState(false);

    useEffect(() => {
        let mounted = true;

        /* 1️⃣ Cargar historias iniciales */
        async function fetchInitial() {
            try {
                const historias = await getHistorias();
                if (mounted && historias.length > 0) {
                    setData(historias);
                }
            } catch (err) {
                if (mounted) {
                    setError(err instanceof Error ? err.message : "Error al cargar historias");
                    console.warn("[useHistorias] Fetch failed, using fallback:", err);
                }
            } finally {
                if (mounted) setLoading(false);
            }
        }

        fetchInitial();

        /* 2️⃣ Suscribirse a nuevas historias en tiempo real */
        const realtime = useRealtimeChanges<HistoriaComunidad>(
            "historias_comunidad",
            (updatedHistoria) => {
                if (!mounted) return;

                setData((prev) => {
                    const exists = prev.find((h) => h.id === updatedHistoria.id);
                    if (exists) {
                        /* Historia existente fue actualizada (ej: más likes) */
                        return prev.map((h) =>
                            h.id === updatedHistoria.id ? updatedHistoria : h
                        );
                    } else {
                        /* Nueva historia — aparece al inicio del feed */
                        return [updatedHistoria, ...prev];
                    }
                });

                /* Indicador visual de actualización en vivo */
                setIsLive(true);
                setTimeout(() => setIsLive(false), 3000);
            }
        );

        realtime.start();

        return () => {
            mounted = false;
            realtime.stop();
        };
    }, []);

    return { historias: data, loading, error, isLive };
}
