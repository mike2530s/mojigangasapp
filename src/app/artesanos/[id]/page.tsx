/* eslint-disable @next/next/no-img-element */
/**
 * Artesano Detail Page — Perfil completo de un artesano
 *
 * Muestra:
 * - Foto de portada + nombre + taller + ciudad
 * - Descripcion / biografia
 * - Galeria de mojigangas (cada una con foto, nombre, anio, categoria, materiales)
 * - Boton volver
 */

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Calendar, Tag, Package, Plus } from "lucide-react";
import Link from "next/link";
import { getArtesanoById, type ArtesanoConMojigangas } from "@/lib/supabase/artesanos";
import { useAuth } from "@/lib/auth/AuthContext";
import { useArtesanos } from "@/hooks/useArtesanos";
import type { Mojiganga } from "@/lib/supabase/mojigangas";
import T from "@/lib/i18n/T";

/* ── Offline fallback mojigangas for "a1" (Taller Linares) ── */
const FALLBACK_MOJIGANGAS: Record<string, Mojiganga[]> = {
    a1: [
        {
            id: "m1",
            nombre: "Don Quijote Gigante",
            historia: "Homenaje al caballero de la Mancha, creado para el Festival Cervantino. Mide 3.5 metros y su lanza está hecha con un palo de escoba forrado en papel aluminio.",
            artesano: "Taller Linares",
            artesano_id: "a1",
            imagen_url: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&q=80",
            materiales: ["Carrizo reforzado", "Papel maché", "Armadura de cartón", "Pintura metálica"],
            año: 2019,
            categoria: "Literario",
        },
        {
            id: "m2",
            nombre: "La Catrina Eterna",
            historia: "Inspirada en la icónica obra de José Guadalupe Posada. Vestida con encajes victorianos y sombrero floral.",
            artesano: "Taller Linares",
            artesano_id: "a1",
            imagen_url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80",
            materiales: ["Carrizo", "Tela de encaje", "Flores de papel", "Pintura acrílica"],
            año: 2021,
            categoria: "Cultural",
        },
    ],
};

/* ── MojigangaCard sub-component ───────────────────────── */
function MojigangaCard({ m }: { m: Mojiganga }) {
    return (
        <Link href={`/catalogo/${m.id}`}>
            <motion.div
                whileHover={{ y: -4 }}
                className="bg-white rounded-card shadow-hard-sm overflow-hidden"
            >
                {/* Imagen */}
                <div className="relative h-44 bg-gray-100 overflow-hidden">
                    <img src={m.imagen_url} alt={m.nombre} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <span className="absolute bottom-2 left-3 text-white font-heading text-xs">
                        {m.año}
                    </span>
                </div>

                {/* Info */}
                <div className="p-4">
                    <span className="badge-tape text-xs mb-2 inline-block">{m.categoria}</span>
                    <h3 className="font-heading text-sm leading-tight mb-3">{m.nombre}</h3>

                    {/* Historia truncada */}
                    <p className="text-xs text-gray-600 font-body leading-relaxed line-clamp-2 mb-3">
                        {m.historia}
                    </p>

                    {/* Materiales */}
                    {m.materiales?.length > 0 && (
                        <div>
                            <div className="flex items-center gap-1 text-xs font-heading text-gray-400 uppercase tracking-wider mb-2">
                                <Package size={10} />
                                <T>Materiales</T>
                            </div>
                            <div className="flex flex-wrap gap-1">
                                {m.materiales.slice(0, 3).map((mat, i) => (
                                    <span key={i} className="text-xs bg-gray-100 text-gray-600 rounded-full px-2 py-0.5 font-body">
                                        {mat}
                                    </span>
                                ))}
                                {m.materiales.length > 3 && (
                                    <span className="text-xs bg-gray-100 text-gray-400 rounded-full px-2 py-0.5 font-body">
                                        +{m.materiales.length - 3}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </Link>
    );
}

/* ── Main Page ──────────────────────────────────────────── */
export default function ArtesanoProfilePage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const { artesanos: fallbackList } = useArtesanos();
    const [data, setData] = useState<ArtesanoConMojigangas | null>(null);
    const [loading, setLoading] = useState(true);
    const { user, isAdmin } = useAuth();

    const isOwnerOrAdmin = (user?.id === id) || isAdmin;

    useEffect(() => {
        getArtesanoById(id)
            .then(setData)
            .catch(() => {
                // Fallback: combine offline artesano + mojigangas
                const fallback = fallbackList.find((a) => a.id === id);
                if (fallback) {
                    setData({ ...fallback, mojigangas: FALLBACK_MOJIGANGAS[id] ?? [] });
                }
            })
            .finally(() => setLoading(false));
    }, [id, fallbackList]);

    if (loading) {
        return (
            <main className="page-container flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-gray-300 border-t-mexican-pink rounded-full animate-spin" />
            </main>
        );
    }

    if (!data) {
        return (
            <main className="page-container flex flex-col items-center justify-center px-5 text-center">
                <h1 className="font-heading text-2xl mb-2"><T>Artesano no encontrado</T></h1>
                <button onClick={() => router.push("/artesanos")} className="btn-primary mt-4">
                    <T>Ver todos los artesanos</T>
                </button>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-paper-white pb-24">
            {/* ── Hero / Portada ── */}
            <div className="relative h-56 overflow-hidden">
                {data.foto_url ? (
                    <img src={data.foto_url} alt={data.nombre} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-fiesta-ink to-fiesta-purple" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Volver */}
                <button
                    onClick={() => router.back()}
                    className="absolute top-5 left-5 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm
                               flex items-center justify-center text-white hover:bg-white/40 transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>

                {/* Nombre y taller sobre la imagen */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute bottom-0 left-0 right-0 p-5"
                >
                    {data.taller && (
                        <span className="badge-tape mb-2 inline-block">{data.taller}</span>
                    )}
                    <h1 className="font-heading text-2xl text-white leading-tight">{data.nombre}</h1>
                    {data.ciudad && (
                        <p className="flex items-center gap-1 text-white/70 text-xs font-body mt-1">
                            <MapPin size={11} />
                            {data.ciudad}
                        </p>
                    )}
                </motion.div>
            </div>

            {/* ── Contenido ── */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="px-5 py-6"
            >
                {/* Biografia */}
                {data.descripcion && (
                    <section className="mb-8">
                        <h2 className="font-heading text-sm uppercase tracking-widest mb-3 flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-mexican-pink" />
                            <T>Sobre el artesano</T>
                        </h2>
                        <p className="text-gray-700 font-body text-sm leading-relaxed">
                            {data.descripcion}
                        </p>
                    </section>
                )}

                {/* Galeria de mojigangas */}
                <section>
                    <div className="flex items-center justify-between mb-4 gap-2">
                        <h2 className="font-heading text-sm uppercase tracking-widest flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full flex-shrink-0 bg-fiesta-cyan" />
                            <T>Sus mojigangas</T>
                            <span className="bg-fiesta-ink text-white text-xs font-heading rounded-full px-2 py-0.5">
                                {data.mojigangas.length}
                            </span>
                        </h2>
                        {isOwnerOrAdmin && (
                            <Link href="/subir-mojiganga" className="flex-shrink-0 flex items-center gap-1.5 bg-mexican-pink text-white text-xs font-heading px-3 py-1.5 rounded-full hover:opacity-90 transition-opacity shadow-sm">
                                <Plus size={14} />
                                <T>Subir</T>
                            </Link>
                        )}
                    </div>

                    {data.mojigangas.length === 0 ? (
                        <div className="bg-white rounded-card p-8 text-center shadow-hard-sm">
                            <span className="text-4xl block mb-3">🎭</span>
                            <p className="text-gray-500 font-body text-sm">
                                <T>Aún no hay mojigangas registradas</T>
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {data.mojigangas.map((m) => (
                                <MojigangaCard key={m.id} m={m} />
                            ))}
                        </div>
                    )}
                </section>

                {/* Divider */}
                <div className="divider-fiesta mt-8 mb-6 rounded-full" />

                {/* Volver a lista */}
                <button onClick={() => router.push("/artesanos")} className="btn-outline w-full justify-center">
                    <T>Ver todos los artesanos</T>
                </button>
            </motion.div>
        </main>
    );
}
