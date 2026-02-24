/**
 * 📸 PolaroidCard — Tarjeta estilo foto polaroid
 *
 * Tarjeta con efecto de rotación sutil (-2deg) al aparecer.
 * Muestra la imagen de una mojiganga con:
 * - Marco blanco estilo polaroid
 * - Badge del año en la esquina inferior
 * - Animación de entrada con Framer Motion (rotate + opacity)
 * - Hover para enderezar y escalar
 */

"use client";

import { motion } from "framer-motion";

interface PolaroidCardProps {
    id: string;
    nombre: string;
    imagenUrl: string;
    año: number;
    index?: number;
    onClick?: (id: string) => void;
}

export default function PolaroidCard({
    id,
    nombre,
    imagenUrl,
    año,
    index = 0,
    onClick,
}: PolaroidCardProps) {
    /* Rotación alternada: impares a la izquierda, pares a la derecha */
    const rotation = index % 2 === 0 ? -2 : 2;

    return (
        <motion.button
            initial={{ opacity: 0, rotate: 0, scale: 0.9 }}
            animate={{ opacity: 1, rotate: rotation, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ rotate: 0, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onClick?.(id)}
            className="block"
        >
            <div className="bg-white p-3 pb-6 shadow-hard rounded-lg">
                {/* Imagen */}
                <div className="relative aspect-[3/4] rounded overflow-hidden bg-gray-200">
                    <img
                        src={imagenUrl}
                        alt={nombre}
                        className="w-full h-full object-cover"
                    />
                    {/* Badge del año */}
                    <span className="absolute bottom-2 right-2 bg-fiesta-ink/80 text-white
                           text-xs px-2 py-0.5 rounded font-body font-semibold">
                        {año}
                    </span>
                </div>
            </div>
            {/* Nombre debajo del marco */}
            <p className="mt-2 text-sm font-body text-gray-700 text-center line-clamp-2 px-1">
                {nombre}
            </p>
        </motion.button>
    );
}
