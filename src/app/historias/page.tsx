/**
 * 📖 Historias Page — Comunidad de historias
 *
 * Pantalla estilo feed social conectada a Supabase:
 * - Header con menú hamburguesa, título y campana
 * - Barra "Comparte tu historia..." que lleva a /subir
 * - Sección "DESTACADOS HOY" con círculos de stories
 * - Feed vertical de tarjetas PostCard (datos de Supabase)
 * - Botón flotante "+" para nueva historia
 *
 * Usa useHistorias hook con fallback offline.
 */

"use client";

import { motion } from "framer-motion";
import { Menu, Bell } from "lucide-react";
import Link from "next/link";
import StoriesRow from "@/components/historias/StoriesRow";
import PostCard from "@/components/historias/PostCard";
import FloatingButton from "@/components/historias/FloatingButton";
import { useHistorias } from "@/hooks/useHistorias";

/* ── Stories destacadas (estáticas por ahora) ──────────── */
const FEATURED_STORIES = [
    { id: "s1", label: "Taller", imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=200&q=80" },
    { id: "s2", label: "Desfile", imageUrl: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=200&q=80", color: "linear-gradient(135deg, #FFD600, #FF005C)" },
    { id: "s3", label: "Artesano", imageUrl: "https://images.unsplash.com/photo-1560707303-4e980ce876ad?w=200&q=80", color: "linear-gradient(135deg, #00E5FF, #9C27B0)" },
    { id: "s4", label: "Museo", imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&q=80" },
];

/* ── Animaciones ───────────────────────────────────────── */
const feedVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};
const postVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

/** Helper: tiempo relativo desde timestamp */
function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `hace ${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `hace ${hrs}h`;
    return `hace ${Math.floor(hrs / 24)}d`;
}

export default function HistoriasPage() {
    const { historias, loading } = useHistorias();

    return (
        <main className="page-container bg-paper-white">
            {/* Header */}
            <header className="flex items-center justify-between px-5 pt-5 pb-3">
                <button className="p-1 text-fiesta-ink hover:text-mexican-pink transition-colors">
                    <Menu size={24} />
                </button>
                <h1 className="font-heading text-lg tracking-wide">Historias</h1>
                <button className="p-1 text-fiesta-ink hover:text-mexican-pink transition-colors relative">
                    <Bell size={22} />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-mexican-pink rounded-full" />
                </button>
            </header>

            {/* Barra "Comparte tu historia..." */}
            <Link href="/subir" className="block mx-5 mb-5">
                <div className="flex items-center gap-3 bg-white rounded-full px-4 py-3 shadow-hard-sm">
                    <div className="w-9 h-9 rounded-full bg-gray-200 flex-shrink-0" />
                    <span className="text-sm text-gray-400 font-body">Comparte tu historia...</span>
                </div>
            </Link>

            {/* Destacados Hoy */}
            <section className="mb-5">
                <h2 className="px-5 font-heading text-xs uppercase tracking-widest text-fiesta-yellow mb-3">
                    Destacados Hoy
                </h2>
                <StoriesRow stories={FEATURED_STORIES} />
            </section>

            {/* Feed — ahora desde Supabase */}
            {loading ? (
                <div className="px-5 space-y-5">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white rounded-card h-64 animate-pulse shadow-hard-sm" />
                    ))}
                </div>
            ) : (
                <motion.section
                    variants={feedVariants}
                    initial="hidden"
                    animate="visible"
                    className="px-5 space-y-5"
                >
                    {historias.map((h) => (
                        <motion.div key={h.id} variants={postVariants}>
                            <PostCard
                                userName={h.usuario_nombre}
                                avatarUrl={`https://ui-avatars.com/api/?name=${encodeURIComponent(h.usuario_nombre)}&background=FF005C&color=fff&size=100`}
                                location={h.ubicacion_nombre || "México"}
                                timeAgo={timeAgo(h.created_at)}
                                imageUrl={h.foto_url || "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80"}
                                caption={h.relato}
                            />
                        </motion.div>
                    ))}
                </motion.section>
            )}

            <FloatingButton href="/subir" />
        </main>
    );
}
