/**
 * 🎭 useMojigangas — Hook para datos del catálogo
 *
 * Fetches mojigangas desde Supabase con estado de loading/error.
 * Fallback a datos locales si Supabase falla (offline-first).
 */

"use client";

import { useState, useEffect } from "react";
import { getMojigangas, type Mojiganga } from "@/lib/supabase/mojigangas";

/* Datos fallback para modo offline o si la tabla está vacía */
const FALLBACK_DATA: Mojiganga[] = [
    {
        id: "m1", nombre: "La Catrina Doña Josefa", historia: "Creada para las fiestas de 1998...",
        artesano: "Don Pedro Linares", artesano_id: "a1", imagen_url: "https://images.unsplash.com/photo-1604265179512-4c34e3ee5c28?w=400&q=80",
        materiales: ["Carrizo", "Papel", "Pintura"], año: 1998, categoria: "Calavera",
    },
    {
        id: "m2", nombre: "El Diablo de Carnaval", historia: "Figura satírica del carnaval...",
        artesano: "María Hernández", artesano_id: "a2", imagen_url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80",
        materiales: ["Carrizo", "Tela", "Pintura"], año: 2005, categoria: "Fantástico",
    },
    {
        id: "m3", nombre: "La Novia del Pueblo", historia: "Representa las bodas tradicionales...",
        artesano: "José García", artesano_id: "a3", imagen_url: "https://images.unsplash.com/photo-1590736704728-f4730bb30770?w=400&q=80",
        materiales: ["Carrizo", "Encaje", "Papel"], año: 2012, categoria: "Tradición",
    },
    {
        id: "m4", nombre: "Don Quijote Gigante", historia: "Homenaje al caballero de la Mancha...",
        artesano: "Taller Linares", artesano_id: "a1", imagen_url: "https://images.unsplash.com/photo-1533929736458-ca588d08cbe?w=400&q=80",
        materiales: ["Carrizo", "Papel maché", "Metal"], año: 2019, categoria: "Literario",
    },
    {
        id: "m5", nombre: "La Adelita Revolucionaria", historia: "Homenaje a las mujeres de la revolución...",
        artesano: "Carmen Vidal", artesano_id: "a4", imagen_url: "https://images.unsplash.com/photo-1560707303-4e980ce876ad?w=400&q=80",
        materiales: ["Carrizo", "Tela", "Pintura"], año: 2001, categoria: "Histórico",
    },
    {
        id: "m6", nombre: "El Músico del Valle", historia: "Celebra la música tradicional...",
        artesano: "Don Fermín", artesano_id: "a5", imagen_url: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&q=80",
        materiales: ["Carrizo", "Papel", "Instrumento"], año: 2015, categoria: "Musical",
    },
];

export function useMojigangas() {
    const [data, setData] = useState<Mojiganga[]>(FALLBACK_DATA);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        async function fetch() {
            try {
                const mojigangas = await getMojigangas();
                if (mounted && mojigangas.length > 0) {
                    setData(mojigangas);
                }
            } catch (err) {
                if (mounted) {
                    setError(err instanceof Error ? err.message : "Error al cargar datos");
                    console.warn("Supabase fetch failed, using fallback data:", err);
                }
            } finally {
                if (mounted) setLoading(false);
            }
        }
        fetch();
        return () => { mounted = false; };
    }, []);

    return { mojigangas: data, loading, error };
}
