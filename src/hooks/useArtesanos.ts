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
        foto_url: "https://images.unsplash.com/photo-1560707303-4e980ce876ad?w=400&q=80",
        ciudad: "San Miguel de Allende",
        created_at: new Date().toISOString(),
    },
    {
        id: "a2",
        nombre: "Casa de las Mojigangas",
        taller: "Casa de las Mojigangas",
        descripcion: "Familia artesana de cuatro generaciones dedicada a la preservación y evolución de la tradición mojiganguera.",
        foto_url: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&q=80",
        ciudad: "Guanajuato",
        created_at: new Date().toISOString(),
    },
    {
        id: "a3",
        nombre: "Arte Vivo Bajío",
        taller: "Arte Vivo Bajío",
        descripcion: "Colectivo de artesanos jóvenes que fusionan técnicas tradicionales con diseños contemporáneos e ilustraciones pop.",
        foto_url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80",
        ciudad: "León, Guanajuato",
        created_at: new Date().toISOString(),
    },
];

export function useArtesanos() {
    const [artesanos, setArtesanos] = useState<Artesano[]>(FALLBACK);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getArtesanos()
            .then((data) => {
                if (data.length > 0) setArtesanos(data);
            })
            .catch((err) => {
                console.warn("useArtesanos: usando datos offline", err);
                setError(err.message);
            })
            .finally(() => setLoading(false));
    }, []);

    return { artesanos, loading, error };
}
