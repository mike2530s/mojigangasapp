/**
 * HeroStoryCard -- Tarjeta principal "Historia del Dia"
 *
 * Tarjeta hero a pantalla completa con:
 * - Imagen de fondo con gradiente overlay oscuro
 * - Badge "HISTORIA DEL DIA" en amarillo
 * - Titulo con estilo caligrafico (Playfair Display italic)
 * - Descripcion corta y CTA "LEER ARTICULO" que enlaza al detalle
 * - Animacion de entrada con Framer Motion (scale + opacity)
 */

"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface HeroStoryCardProps {
    imageSrc: string;
    badge?: string;
    title: string;
    description: string;
    href?: string;
}

export default function HeroStoryCard({
    imageSrc,
    badge = "HISTORIA DEL DIA",
    title,
    description,
    href,
}: HeroStoryCardProps) {
    const content = (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative mx-5 rounded-card overflow-hidden shadow-hard cursor-pointer"
            style={{ minHeight: "420px" }}
        >
            {/* Imagen de fondo */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${imageSrc})` }}
            />

            {/* Gradiente oscuro sobre la imagen */}
            <div className="absolute inset-0 gradient-overlay" />

            {/* Contenido superpuesto */}
            <div className="relative z-10 flex flex-col justify-between h-full p-6"
                style={{ minHeight: "420px" }}
            >
                {/* Badge superior */}
                <div>
                    <span className="badge-tape">{badge}</span>
                </div>

                {/* Texto inferior */}
                <div>
                    <h2 className="font-display italic text-3xl text-white leading-tight mb-2">
                        {title}
                    </h2>
                    <p className="text-gray-300 text-sm font-body mb-4 line-clamp-2">
                        {description}
                    </p>
                    <span className="flex items-center gap-2 text-white font-heading text-xs uppercase tracking-wider
                       hover:gap-3 transition-all">
                        Leer Articulo <span className="text-lg">&rarr;</span>
                    </span>
                </div>
            </div>
        </motion.div>
    );

    if (href) {
        return <Link href={href}>{content}</Link>;
    }

    return content;
}
