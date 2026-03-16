/**
 * 📰 PostCard — Tarjeta de publicación comunitaria
 *
 * Muestra una historia de la comunidad con:
 * - Avatar y nombre del usuario
 * - Ubicación y tiempo relativo
 * - Imagen principal con badge de ubicación
 * - Animación de entrada con Framer Motion (opacity + scale)
 */

"use client";

import { motion } from "framer-motion";
import { MapPin, MoreHorizontal } from "lucide-react";
import PhotoCarousel from "@/components/catalogo/PhotoCarousel";

interface PostCardProps {
    userName: string;
    avatarUrl: string;
    location: string;
    timeAgo: string;
    imageUrl?: string;
    imageUrls?: string[];
    caption?: string;
    onClick?: () => void;
}

export default function PostCard({
    userName,
    avatarUrl,
    location,
    timeAgo,
    imageUrl,
    imageUrls,
    caption,
    onClick,
}: PostCardProps) {
    const images = imageUrls?.length ? imageUrls : imageUrl ? [imageUrl] : [];
    
    return (
        <motion.article
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="card-base cursor-pointer"
            onClick={onClick}
        >
            {/* Cabecera — Avatar, nombre, ubicación, menú */}
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                    <img
                        src={avatarUrl}
                        alt={userName}
                        className="w-10 h-10 rounded-full object-cover border-2 border-paper-white"
                    />
                    <div>
                        <p className="font-body font-semibold text-sm">{userName}</p>
                        <p className="text-xs text-gray-500">
                            {location} • {timeAgo}
                        </p>
                    </div>
                </div>
                <button className="p-1 text-gray-400 hover:text-fiesta-ink transition-colors">
                    <MoreHorizontal size={20} />
                </button>
            </div>

            {/* Imagen principal o Carrusel con badge de ubicación */}
            <div className="relative">
                {images.length > 1 ? (
                    // Carrusel simplificado sin indicadores grandes si es feed, o reutilizamos PhotoCarousel
                    <div onClick={(e) => e.stopPropagation()}>
                        <PhotoCarousel images={images} alt={`Historia de ${userName}`} heightClass="h-96" variant="minimal" />
                    </div>
                ) : images.length === 1 ? (
                    <img
                        src={images[0]}
                        alt={`Historia de ${userName}`}
                        loading="lazy"
                        decoding="async"
                        className="w-full aspect-[4/3] object-cover"
                    />
                ) : null}
                
                {/* Badge de ubicación superpuesto */}
                <span className="absolute top-3 right-3 z-30 inline-flex items-center gap-1 
                         bg-fiesta-ink/70 text-white text-xs px-2.5 py-1 rounded-full
                         backdrop-blur-sm font-body">
                    <MapPin size={12} />
                    {location}
                </span>
            </div>

            {/* Caption opcional */}
            {caption && (
                <p className="px-4 py-3 text-sm text-gray-700 font-body">{caption}</p>
            )}
        </motion.article>
    );
}
