/* eslint-disable @next/next/no-img-element */
/**
 * Detalle de Mojiganga — Página individual con carrusel de fotos
 *
 * - Carrusel touch/swipe con hasta 5 fotos
 * - Historia, materiales, meta info
 * - Botón para volver al catálogo
 */

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";
import { getMojigangaById, type Mojiganga } from "@/lib/supabase/mojigangas";
import { useMojigangas } from "@/hooks/useMojigangas";
import T from "@/lib/i18n/T";
import PhotoCarousel from "@/components/catalogo/PhotoCarousel";

export default function MojigangaDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const { mojigangas } = useMojigangas();
    const [mojiganga, setMojiganga] = useState<Mojiganga | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getMojigangaById(id);
                setMojiganga(data);
            } catch {
                const fallback = mojigangas.find((m) => m.id === id) || null;
                setMojiganga(fallback);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [id, mojigangas]);

    if (loading) {
        return (
            <main className="page-container flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-gray-300 border-t-mexican-pink rounded-full animate-spin" />
            </main>
        );
    }

    if (!mojiganga) {
        return (
            <main className="page-container flex flex-col items-center justify-center px-5 text-center">
                <h1 className="font-heading text-2xl mb-2"><T>No encontrada</T></h1>
                <p className="text-gray-500 font-body text-sm mb-6">
                    <T>Esta mojiganga no existe o fue removida.</T>
                </p>
                <button onClick={() => router.push("/catalogo")} className="btn-primary">
                    <T>Ver todo el Catálogo</T>
                </button>
            </main>
        );
    }

    /* ── Fotos: imagenes_urls[] → fallback a imagen_url ── */
    const raw = mojiganga as unknown as { imagenes_urls?: string[] };
    const photos: string[] =
        raw.imagenes_urls && raw.imagenes_urls.length > 0
            ? raw.imagenes_urls
            : mojiganga.imagen_url
                ? [mojiganga.imagen_url]
                : [];

    return (
        <main className="min-h-screen bg-paper-white">

            {/* ── Carrusel premium ── */}
            <div className="relative">
                <PhotoCarousel images={photos} alt={mojiganga.nombre} heightClass="h-[58vh]">
                    <span className="badge-tape mb-2 inline-block">{mojiganga.categoria}</span>
                    <h1 className="font-heading text-3xl text-white leading-tight drop-shadow-lg">
                        {mojiganga.nombre}
                    </h1>
                </PhotoCarousel>

                {/* Botón volver — flotante sobre el carrusel */}
                <button
                    onClick={() => router.back()}
                    className="absolute top-5 left-5 w-10 h-10 rounded-full bg-white/20
                               backdrop-blur-sm flex items-center justify-center text-white
                               hover:bg-white/40 transition-colors z-30"
                >
                    <ArrowLeft size={20} />
                </button>
            </div>

            {/* ── Contenido ── */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="px-5 py-6 pb-24"
            >
                {/* Meta info */}
                <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex items-center gap-1.5 text-sm text-gray-600 font-body">
                        <User size={14} className="text-mexican-pink" />
                        {mojiganga.artesano}
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-gray-600 font-body">
                        <Calendar size={14} className="text-fiesta-cyan" />
                        {mojiganga.año}
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-gray-600 font-body">
                        <Tag size={14} className="text-fiesta-purple" />
                        {mojiganga.categoria}
                    </div>
                </div>

                {/* Historia */}
                <h2 className="font-heading text-sm uppercase tracking-widest mb-3 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-mexican-pink" />
                    <T>Historia</T>
                </h2>
                <p className="text-gray-700 font-body text-sm leading-relaxed mb-8 break-words">
                    {mojiganga.historia}
                </p>

                {/* Proceso de Creación */}
                {mojiganga.proceso && (
                    <>
                        <h2 className="font-heading text-sm uppercase tracking-widest mb-3 flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-fiesta-yellow" />
                            <T>Proceso de creación</T>
                        </h2>
                        <p className="text-gray-700 font-body text-sm leading-relaxed mb-8 whitespace-pre-wrap break-words">
                            {mojiganga.proceso}
                        </p>
                    </>
                )}

                {/* Materiales */}
                {mojiganga.materiales && mojiganga.materiales.length > 0 && (
                    <>
                        <h2 className="font-heading text-sm uppercase tracking-widest mb-3 flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-fiesta-cyan" />
                            <T>Materiales</T>
                        </h2>
                        <div className="flex flex-wrap gap-2 mb-8">
                            {mojiganga.materiales.map((mat, i) => (
                                <span
                                    key={i}
                                    className="px-4 py-2 bg-white rounded-[20px] text-sm font-body leading-relaxed
                                               text-gray-700 shadow-hard-sm border border-gray-100 break-all"
                                >
                                    {mat}
                                </span>
                            ))}
                        </div>
                    </>
                )}

                {/* Botón volver */}
                <button onClick={() => router.push("/catalogo")} className="btn-outline w-full justify-center">
                    <T>Ver todo el Catálogo</T>
                </button>
            </motion.div>
        </main>
    );
}
