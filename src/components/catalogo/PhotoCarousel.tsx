/* eslint-disable @next/next/no-img-element */
/**
 * PhotoCarousel — Carrusel premium de fotos para mojigangas
 *
 * Características:
 * - Swipe táctil y arrastre de ratón (drag)
 * - Snap animado con Framer Motion
 * - Puntos indicadores activos + contador (1/5)
 * - Tiras de miniaturas tocables en la parte inferior
 * - Gradiente inferior para legibilidad del título
 * - Zoom sutil en cada imagen al entrar
 */

"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PhotoCarouselProps {
    images: string[];          // URLs de las fotos (1–5)
    alt: string;               // texto alt (nombre mojiganga)
    children?: React.ReactNode; // contenido sobre el gradiente inferior (título, badge)
    heightClass?: string;       // ej. "h-[55vh]" → default h-[55vh]
    variant?: "default" | "minimal"; // "minimal" oculta las miniaturas para vistas más limpias
}

export default function PhotoCarousel({
    images,
    alt,
    children,
    heightClass = "h-[55vh]",
    variant = "default",
}: PhotoCarouselProps) {
    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(0); // -1 prev / 1 next
    const dragStartX = useRef(0);

    const total = images.length;

    const go = (idx: number) => {
        if (idx === current) return;
        setDirection(idx > current ? 1 : -1);
        setCurrent(idx);
    };

    const prev = () => go((current - 1 + total) % total);
    const next = () => go((current + 1) % total);

    /* ── Swipe handler ──────────────────────────────────── */
    const handleDragEnd = (_: unknown, info: PanInfo) => {
        if (info.offset.x < -50) next();
        else if (info.offset.x > 50) prev();
    };

    /* ── Slide variants ─────────────────────────────────── */
    const variants = {
        enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0.6, scale: 0.97 }),
        center: { x: 0, opacity: 1, scale: 1 },
        exit: (d: number) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0.6, scale: 0.97 }),
    };

    if (total === 0) return null;

    /* ── Single image (no controls needed) ─────────────── */
    if (total === 1) {
        return (
            <div className={`relative ${heightClass} overflow-hidden`}>
                <img src={images[0]} alt={alt} className="w-full h-full object-cover" />
                <div className="gradient-overlay absolute inset-0" />
                {children && (
                    <div className="absolute bottom-0 left-0 right-0 p-5 z-10">{children}</div>
                )}
            </div>
        );
    }

    return (
        <div className={`relative ${heightClass} overflow-hidden bg-black`}>
            {/* ── Main slide area ── */}
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.div
                    key={current}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ type: "spring", stiffness: 380, damping: 36, mass: 0.8 }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.15}
                    onDragEnd={handleDragEnd}
                    className="absolute inset-0 cursor-grab active:cursor-grabbing"
                >
                    <img
                        src={images[current]}
                        alt={`${alt} — foto ${current + 1}`}
                        className="w-full h-full object-cover select-none pointer-events-none"
                        draggable={false}
                    />
                </motion.div>
            </AnimatePresence>

            {/* ── Gradient overlay (solo si no es minimal o si hay children) ── */}
            {(variant === "default" || children) && (
                <div className="gradient-overlay absolute inset-0 pointer-events-none z-10" />
            )}

            {/* ── Counter badge ── */}
            <div className="absolute top-4 right-4 z-20 bg-black/50 backdrop-blur-md
                            text-white text-xs font-heading px-2.5 py-1 rounded-full">
                {current + 1} / {total}
            </div>

            {/* ── Prev / Next buttons (only on wider screens / hover) ── */}
            {total > 1 && (
                <>
                    <button
                        onClick={prev}
                        className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 z-20
                                   w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm items-center
                                   justify-center text-white hover:bg-white/40 transition-colors"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={next}
                        className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 z-20
                                   w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm items-center
                                   justify-center text-white hover:bg-white/40 transition-colors"
                    >
                        <ChevronRight size={20} />
                    </button>
                </>
            )}

            {/* ── Dot indicators ── */}
            <div className={`absolute ${variant === "minimal" ? "bottom-4" : "bottom-20"} left-0 right-0 z-20 flex justify-center gap-1.5 pointer-events-none`}>
                {images.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => go(i)}
                        className="pointer-events-auto transition-all duration-300"
                        aria-label={`Foto ${i + 1}`}
                    >
                        <motion.div
                            animate={{
                                width: i === current ? 20 : 6,
                                backgroundColor: i === current ? "#FF005C" : "rgba(255,255,255,0.6)",
                            }}
                            transition={{ duration: 0.25 }}
                            className="h-1.5 rounded-full"
                        />
                    </button>
                ))}
            </div>

            {/* ── Thumbnail strip (solo default) ── */}
            {variant === "default" && (
                <div className="absolute bottom-3 left-0 right-0 z-20 flex justify-center gap-2 px-4">
                    {images.map((src, i) => (
                        <button
                            key={i}
                            onClick={() => go(i)}
                            className={`relative flex-shrink-0 transition-all duration-300 rounded-xl overflow-hidden
                                        ${i === current
                                    ? "w-14 h-14 ring-2 ring-mexican-pink ring-offset-1 ring-offset-black/30"
                                    : "w-10 h-10 opacity-60 hover:opacity-90"
                                }`}
                        >
                            <img src={src} alt="" className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}

            {/* ── Title / children overlay ── */}
            {children && (
                <div className="absolute bottom-[88px] left-0 right-0 p-5 z-20">
                    {children}
                </div>
            )}
        </div>
    );
}
