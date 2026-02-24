/**
 * 🔄 ProcessCard — Tarjeta con flip 3D para el Taller
 *
 * Tarjeta interactiva que muestra el proceso de creación:
 * - Frente: imagen + número de paso + título
 * - Reverso: descripción detallada del paso
 * - Click para voltear con animación rotateY 180deg
 * - Usa las clases flip-card de globals.css
 */

"use client";

import { useState } from "react";

interface ProcessCardProps {
    step: number;
    title: string;
    imageUrl: string;
    description: string;
}

export default function ProcessCard({
    step,
    title,
    imageUrl,
    description,
}: ProcessCardProps) {
    const [flipped, setFlipped] = useState(false);

    return (
        <button
            onClick={() => setFlipped(!flipped)}
            className={`flip-card w-full ${flipped ? "flipped" : ""}`}
            style={{ perspective: "1000px" }}
        >
            <div className="flip-card-inner relative w-full" style={{ aspectRatio: "3/4" }}>
                {/* ── Frente ── */}
                <div className="flip-card-front rounded-card overflow-hidden shadow-hard">
                    <img
                        src={imageUrl}
                        alt={title}
                        className="w-full h-full object-cover"
                    />
                    {/* Overlay con info */}
                    <div className="absolute inset-0 gradient-overlay flex flex-col justify-end p-4">
                        <span className="text-fiesta-yellow font-heading text-xs uppercase tracking-widest">
                            Paso {step}
                        </span>
                        <h3 className="text-white font-heading text-lg mt-1">{title}</h3>
                        <p className="text-gray-300 text-xs font-body mt-1">Toca para ver más →</p>
                    </div>
                </div>

                {/* ── Reverso ── */}
                <div
                    className="flip-card-back rounded-card overflow-hidden shadow-hard flex flex-col justify-center p-6"
                    style={{ background: "linear-gradient(145deg, #1A1A1A, #2D2D2D)" }}
                >
                    <span className="text-fiesta-cyan font-heading text-xs uppercase tracking-widest mb-2">
                        Paso {step}
                    </span>
                    <h3 className="text-white font-heading text-xl mb-3">{title}</h3>
                    <p className="text-gray-300 text-sm font-body leading-relaxed">
                        {description}
                    </p>
                    <p className="text-gray-500 text-xs font-body mt-4">Toca para volver ←</p>
                </div>
            </div>
        </button>
    );
}
