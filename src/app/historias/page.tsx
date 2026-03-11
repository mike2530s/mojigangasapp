/**
 * Historias Page — Feed social de historias comunitarias
 *
 * Etiquetas y textos UI traducidos via <T> y useText.
 * El contenido del feed (historias de usuarios) no se traduce -- es contenido generado por usuarios.
 */

"use client";

import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import StoriesRow from "@/components/historias/StoriesRow";
import PostCard from "@/components/historias/PostCard";
import FloatingButton from "@/components/historias/FloatingButton";
import { useHistorias } from "@/hooks/useHistorias";
import { useTranslation } from "@/lib/i18n/LangContext";
import T from "@/lib/i18n/T";
import { useText } from "@/lib/i18n/useText";
import HamburgerDrawer from "@/components/navigation/HamburgerDrawer";

const feedVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};
const postVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

/** Tiempo relativo en el idioma activo */
function useTimeAgo(dateStr: string): string {
    const { lang } = useTranslation();
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);

    if (lang === "es") {
        if (mins < 60) return `hace ${mins}m`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `hace ${hrs}h`;
        return `hace ${Math.floor(hrs / 24)}d`;
    } else {
        if (mins < 60) return `${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}h ago`;
        return `${Math.floor(hrs / 24)}d ago`;
    }
}

function PostWrapper({ h }: { h: Parameters<typeof PostCard>[0] & { created_at: string } }) {
    const timeAgo = useTimeAgo(h.created_at);
    return (
        <PostCard
            userName={h.userName}
            avatarUrl={h.avatarUrl}
            location={h.location}
            timeAgo={timeAgo}
            imageUrl={h.imageUrl}
            caption={h.caption}
        />
    );
}

export default function HistoriasPage() {
    const { historias, loading, error } = useHistorias();
    const sharePrompt = useText("Comparte tu historia...");
    const router = useRouter();

    const FEATURED_STORIES = [
        { id: "s1", label: "Taller", imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=200&q=80", href: "/taller" },
        { id: "s2", label: "Desfile", imageUrl: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=200&q=80", color: "linear-gradient(135deg, #FFD600, #FF005C)", href: "/mapa" },
        { id: "s3", label: "Artesano", imageUrl: "https://images.unsplash.com/photo-1560707303-4e980ce876ad?w=200&q=80", color: "linear-gradient(135deg, #00E5FF, #9C27B0)", href: "/artesanos" },
        { id: "s4", label: "Museo", imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&q=80", href: "/catalogo" },
    ];

    return (
        <main className="page-container bg-paper-white">
            {/* Header */}
            <header className="flex items-center justify-between px-5 pt-5 pb-3">
                <HamburgerDrawer />
                <h1 className="font-heading text-lg tracking-wide"><T>Historias</T></h1>
                <div className="w-6" /> {/* Spacer for centering */}
            </header>

            {/* Barra compartir */}
            <Link href="/subir" className="block mx-5 mb-5">
                <div className="flex items-center gap-3 bg-white rounded-full px-4 py-3 shadow-hard-sm">
                    <div className="w-9 h-9 rounded-full bg-gray-200 flex-shrink-0" />
                    <span className="text-sm text-gray-400 font-body">{sharePrompt}</span>
                </div>
            </Link>

            {/* Destacados */}
            <section className="mb-5">
                <h2 className="px-5 font-heading text-xs uppercase tracking-widest text-fiesta-yellow mb-3">
                    <T>Destacados Hoy</T>
                </h2>
                <StoriesRow
                    stories={FEATURED_STORIES}
                    onStoryClick={(id) => {
                        const story = FEATURED_STORIES.find(s => s.id === id);
                        if (story?.href) router.push(story.href);
                    }}
                />
            </section>

            {/* Error */}
            {error && (
                <div className="mx-5 mb-4 p-3 bg-red-50 border border-red-200 rounded-card text-sm text-red-600 font-body">
                    <T>No se pudieron cargar las historias. Mostrando información guardada.</T>
                </div>
            )}

            {/* Feed */}
            {loading ? (
                <div className="px-5 space-y-5 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white rounded-card h-64 animate-pulse shadow-hard-sm" />
                    ))}
                </div>
            ) : (
                <motion.section variants={feedVariants} initial="hidden" animate="visible" className="px-5 space-y-5 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">
                    {historias.map((h) => (
                        <motion.div key={h.id} variants={postVariants}>
                            <PostWrapper
                                h={{
                                    created_at: h.created_at,
                                    userName: h.usuario_nombre,
                                    avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(h.usuario_nombre)}&background=FF005C&color=fff&size=100`,
                                    location: h.ubicacion_nombre || "México",
                                    timeAgo: "",
                                    imageUrl: h.foto_url || "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80",
                                    caption: h.relato,
                                }}
                            />
                        </motion.div>
                    ))}
                </motion.section>
            )}

            <FloatingButton href="/subir" />
        </main>
    );
}
