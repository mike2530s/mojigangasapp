/**
 * useArtesanos — Hook con fallback offline para la lista de artesanos
 */

"use client";

import { useState, useEffect } from "react";
import { getArtesanos, type Artesano } from "@/lib/supabase/artesanos";

/* ── Datos offline de ejemplo ──────────────────────────── */
const FALLBACK: Artesano[] = [
    {
        id: "a1",
        nombre: "Taller Linares",
        taller: "Taller Linares",
        descripcion: "Maestro artesano con más de 20 años de experiencia en mojigangas literarias e históricas. Sus obras han recorrido toda la República Mexicana.",
        foto_url: "https://nktouapjberliqbsyiqf.supabase.co/storage/v1/object/public/fotos-mojigangas/fotos-pdf/foto_01.jpeg",
        ciudad: "San Miguel de Allende",
        created_at: new Date().toISOString(),
    },
    {
        id: "a2",
        nombre: "Casa de las Mojigangas",
        taller: "Casa de las Mojigangas",
        descripcion: "Familia artesana de cuatro generaciones dedicada a la preservación y evolución de la tradición mojiganguera.",
        foto_url: "https://nktouapjberliqbsyiqf.supabase.co/storage/v1/object/public/fotos-mojigangas/fotos-pdf/foto_05.jpeg",
        ciudad: "Guanajuato",
        created_at: new Date().toISOString(),
    },
    {
        id: "a3",
        nombre: "Arte Vivo Bajío",
        taller: "Arte Vivo Bajío",
        descripcion: "Colectivo de artesanos jóvenes que fusionan técnicas tradicionales con diseños contemporáneos e ilustraciones pop.",
        foto_url: "https://nktouapjberliqbsyiqf.supabase.co/storage/v1/object/public/fotos-mojigangas/fotos-pdf/foto_10.jpeg",
        ciudad: "León, Guanajuato",
        created_at: new Date().toISOString(),
    },
];

export function useArtesanos() {
    const [artesanos, setArtesanos] = useState<Artesano[]>(FALLBACK);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        getArtesanos()
            .then((data) => {
                if (mounted && data.length > 0) setArtesanos(data);
            })
            .catch((err) => {
                if (mounted) {
                    console.warn("useArtesanos: usando datos offline", err);
                    setError(err.message);
                }
            })
            .finally(() => {
                if (mounted) setLoading(false);
            });
        return () => { mounted = false; };
    }, []);

    return { artesanos, loading, error };
}
