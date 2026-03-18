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
import { useState } from "react";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import StoriesRow from "@/components/historias/StoriesRow";
import PostCard from "@/components/historias/PostCard";
import FloatingButton from "@/components/historias/FloatingButton";
import PhotoCarousel from "@/components/catalogo/PhotoCarousel";
import { useHistorias } from "@/hooks/useHistorias";
import { useTranslation } from "@/lib/i18n/LangContext";
import T from "@/lib/i18n/T";
import { useText } from "@/lib/i18n/useText";
import HamburgerDrawer from "@/components/navigation/HamburgerDrawer";
import { PostCardSkeleton, StoriesRowSkeleton } from "@/components/ui/Skeleton";

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

function PostWrapper({ h, onClick }: { h: Parameters<typeof PostCard>[0] & { created_at: string, imageUrls?: string[] }, onClick: () => void }) {
    const timeAgo = useTimeAgo(h.created_at);
    return (
        <PostCard
            userName={h.userName}
            avatarUrl={h.avatarUrl}
            location={h.location}
            timeAgo={timeAgo}
            imageUrl={h.imageUrl}
            imageUrls={h.imageUrls}
            caption={h.caption}
            onClick={onClick}
        />
    );
}

export default function HistoriasPage() {
    const { historias, loading, error } = useHistorias();
    const sharePrompt = useText("Comparte tu historia...");
    const router = useRouter();

    // Estado para la historia destacada seleccionada (modal)
    const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);

    // Filtrar las historias que tienen 'destacada' activado
    const highlightedStories = historias
        .filter(h => h.destacada)
        .slice(0, 10) // Mostrar máximo 10
        .map((h, i) => ({
            id: h.id,
            label: h.evento || h.usuario_nombre || "Historia",
            imageUrl: h.foto_url || "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80",
            // Alternar colores de borde para que se vea dinámico
            color: i % 2 === 0 ? "linear-gradient(135deg, #FFD600, #FF005C)" : "linear-gradient(135deg, #00E5FF, #9C27B0)",
            // Si tiene id, no usamos href para que abra el modal
            href: undefined,
            originalStoryInfo: h
        }));

    // Si no hay historias destacadas en la base de datos, mostramos algunas por defecto para el diseño
    const FEATURED_STORIES = highlightedStories.length > 0 ? highlightedStories : [
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
                    <T>Destacadas</T>
                </h2>
                <StoriesRow
                    stories={FEATURED_STORIES}
                    onStoryClick={(id) => {
                        const story = FEATURED_STORIES.find(s => s.id === id);
                        if (story?.href) {
                            router.push(story.href);
                        } else {
                            // Abrir modal de historia destacada
                            setSelectedStoryId(id);
                        }
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
                        <PostCardSkeleton key={i} />
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
                                    imageUrls: h.fotos_urls && h.fotos_urls.length > 0 ? h.fotos_urls : (h.foto_url ? [h.foto_url] : []),
                                    caption: h.relato,
                                }}
                                onClick={() => setSelectedStoryId(h.id)}
                            />
                        </motion.div>
                    ))}
                </motion.section>
            )}

            <FloatingButton href="/subir" />

            {/* Modal de Historia Destacada */}
            {selectedStoryId && (
                <div className="fixed inset-0 z-[500] bg-black/90 flex items-center justify-center p-4">
                    {(() => {
                        const story = historias.find(h => h.id === selectedStoryId);
                        if (!story) {
                            setSelectedStoryId(null);
                            return null;
                        }
                        return (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-paper-white w-full max-w-sm rounded-3xl overflow-hidden relative shadow-2xl"
                            >
                                <button
                                    onClick={() => setSelectedStoryId(null)}
                                    className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center"
                                >
                                    <X size={18} />
                                </button>

                                {/* Foto principal o carrusel si hay varias */}
                                <div className="h-96 w-full bg-gray-100 relative">
                                    {story.fotos_urls && story.fotos_urls.length > 1 ? (
                                        <PhotoCarousel 
                                            images={story.fotos_urls} 
                                            alt={story.usuario_nombre} 
                                            heightClass="h-96" variant="minimal" 
                                        />
                                    ) : (
                                        <img
                                            src={story.foto_url || "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80"}
                                            alt="Historia destacada"
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                </div>

                                {/* Info */}
                                <div className="p-5">
                                    <div className="flex items-center gap-3 mb-4">
                                        <img
                                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(story.usuario_nombre)}&background=FF005C&color=fff&size=100`}
                                            alt={story.usuario_nombre}
                                            className="w-10 h-10 rounded-full"
                                        />
                                        <div>
                                            <p className="font-heading text-sm text-fiesta-ink">{story.usuario_nombre}</p>
                                            <p className="text-xs text-gray-500 font-body">
                                                {story.evento || story.ubicacion_nombre || "México"}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-700 font-body leading-relaxed whitespace-pre-wrap">
                                        {story.relato}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })()}
                </div>
            )}
        </main>
    );
}
