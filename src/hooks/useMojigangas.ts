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
        artesano: "Don Pedro Linares", artesano_id: "a1", imagen_url: "https://nktouapjberliqbsyiqf.supabase.co/storage/v1/object/public/fotos-mojigangas/fotos-pdf/foto_02.jpeg",
        materiales: ["Carrizo", "Papel", "Pintura"], año: 1998, categoria: "Calavera",
    },
    {
        id: "m2", nombre: "El Diablo de Carnaval", historia: "Figura satírica del carnaval...",
        artesano: "María Hernández", artesano_id: "a2", imagen_url: "https://nktouapjberliqbsyiqf.supabase.co/storage/v1/object/public/fotos-mojigangas/fotos-pdf/foto_04.jpeg",
        materiales: ["Carrizo", "Tela", "Pintura"], año: 2005, categoria: "Fantástico",
    },
    {
        id: "m3", nombre: "La Novia del Pueblo", historia: "Representa las bodas tradicionales...",
        artesano: "José García", artesano_id: "a3", imagen_url: "https://nktouapjberliqbsyiqf.supabase.co/storage/v1/object/public/fotos-mojigangas/fotos-pdf/foto_06.jpeg",
        materiales: ["Carrizo", "Encaje", "Papel"], año: 2012, categoria: "Tradición",
    },
    {
        id: "m4", nombre: "Don Quijote Gigante", historia: "Homenaje al caballero de la Mancha...",
        artesano: "Taller Linares", artesano_id: "a1", imagen_url: "https://nktouapjberliqbsyiqf.supabase.co/storage/v1/object/public/fotos-mojigangas/fotos-pdf/foto_08.jpeg",
        materiales: ["Carrizo", "Papel maché", "Metal"], año: 2019, categoria: "Literario",
    },
    {
        id: "m5", nombre: "La Adelita Revolucionaria", historia: "Homenaje a las mujeres de la revolución...",
        artesano: "Carmen Vidal", artesano_id: "a4", imagen_url: "https://nktouapjberliqbsyiqf.supabase.co/storage/v1/object/public/fotos-mojigangas/fotos-pdf/foto_11.jpeg",
        materiales: ["Carrizo", "Tela", "Pintura"], año: 2001, categoria: "Histórico",
    },
    {
        id: "m6", nombre: "El Músico del Valle", historia: "Celebra la música tradicional...",
        artesano: "Don Fermín", artesano_id: "a5", imagen_url: "https://nktouapjberliqbsyiqf.supabase.co/storage/v1/object/public/fotos-mojigangas/fotos-pdf/foto_13.jpeg",
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
