/**
 * 🌑 DarkDetailCard — Tarjeta oscura de detalle de mojiganga
 *
 * Tarjeta con fondo oscuro/glassmorphism que muestra:
 * - Categoría en cyan
 * - Título "EL ALMA DEL PAPEL" estilo vertical
 * - Descripción de la historia/tradición
 * - Tags de categoría (Tradición, Arte Popular, etc.)
 * - Animación slide-up al aparecer
 *
 * Se muestra al hacer scroll en el catálogo.
 */

"use client";

import { motion } from "framer-motion";

interface DarkDetailCardProps {
    categoria: string;
    titulo: string;
    descripcion: string;
    tags: string[];
}

export default function DarkDetailCard({
    categoria,
    titulo,
    descripcion,
    tags,
}: DarkDetailCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mx-5 rounded-card overflow-hidden"
            style={{
                background: "linear-gradient(145deg, #1A1A1A 0%, #2D2D2D 100%)",
            }}
        >
            <div className="p-6">
                {/* Categoría + título lado a lado */}
                <div className="flex gap-4 mb-4">
                    <span className="font-heading text-sm text-fiesta-cyan uppercase tracking-wider writing-vertical shrink-0"
                        style={{ writingMode: "vertical-lr", textOrientation: "mixed" }}
                    >
                        {categoria}
                    </span>
                    <h3 className="font-heading text-2xl text-white uppercase leading-tight">
                        {titulo.split(" ").map((word, i) => (
                            <span key={i} className="block">{word}</span>
                        ))}
                    </h3>
                </div>

                {/* Descripción */}
                <p className="text-gray-300 text-sm font-body leading-relaxed mb-5">
                    {descripcion}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                        <span
                            key={tag}
                            className="inline-block px-3 py-1 border border-gray-500 rounded-full
                         text-xs font-body text-gray-300 uppercase tracking-wider"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
