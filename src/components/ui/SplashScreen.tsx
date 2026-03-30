/**
 * SplashScreen — Pantalla de bienvenida (solo primera visita)
 *
 * - Solo se muestra la primera vez que el usuario entra a la app.
 * - Al cerrar, dispara el tour de visitante (Driver.js, 7 pasos).
 * - Usa localStorage para no repetirse.
 * - El idioma se detecta automáticamente del dispositivo.
 */

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOnboarding, isGuestDone } from "@/lib/onboarding/useOnboarding";
import { useTranslation } from "@/lib/i18n/LangContext";

const LETTER_VARIANTS = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: 0.4 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    }),
};

const TITLE = "Mojigangas".split("");

export default function SplashScreen() {
    const [show, setShow] = useState(false);
    const { startGuestTour } = useOnboarding();
    const { lang } = useTranslation();

    // Verificar si es primera visita (solo en cliente)
    useEffect(() => {
        if (typeof window === "undefined") return;
        if (!isGuestDone()) {
            setShow(true);
        }
    }, []);

    const handleExplore = async () => {
        setShow(false);
        // Pequeño delay para que el splash termine de salir antes de iniciar el tour
        setTimeout(() => {
            startGuestTour(lang);
        }, 650);
    };

    // Auto-cierre después de 8 segundos si el usuario no hace nada
    useEffect(() => {
        if (!show) return;
        const t = setTimeout(handleExplore, 8000);
        return () => clearTimeout(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show]);

    const ctaText = lang === "es" ? "Explorar →" : "Explore →";
    const subtitleText = lang === "es" ? "Tradición Viva de México" : "Living Tradition of Mexico";

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    key="splash"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.04 }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    className="fixed inset-0 z-[9999] bg-fiesta-ink flex flex-col items-center justify-center px-8 select-none"
                >
                    {/* Decoración superior */}
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="absolute top-0 left-0 right-0 h-1 origin-left"
                        style={{
                            background: "repeating-linear-gradient(90deg, #FF005C 0px, #FF005C 30px, #FFD600 30px, #FFD600 60px, #00E5FF 60px, #00E5FF 90px, #9C27B0 90px, #9C27B0 120px)"
                        }}
                    />

                    {/* Emoji decorativo */}
                    <motion.div
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
                        className="text-6xl mb-6"
                        aria-hidden
                    >
                        🎭
                    </motion.div>

                    {/* Título letra por letra */}
                    <h1 className="font-display italic text-5xl md:text-7xl text-white flex overflow-hidden mb-3">
                        {TITLE.map((char, i) => (
                            <motion.span
                                key={i}
                                custom={i}
                                variants={LETTER_VARIANTS}
                                initial="hidden"
                                animate="visible"
                            >
                                {char}
                            </motion.span>
                        ))}
                    </h1>

                    {/* Subtítulo */}
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.0, duration: 0.5 }}
                        className="font-heading text-xs tracking-[0.3em] uppercase text-fiesta-yellow mb-10"
                    >
                        {subtitleText}
                    </motion.p>

                    {/* CTA */}
                    <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.3, duration: 0.4 }}
                        onClick={handleExplore}
                        className="bg-mexican-pink text-white font-heading text-sm uppercase tracking-widest
                                   px-8 py-3 rounded-full shadow-[0_4px_20px_rgba(255,0,92,0.5)]
                                   hover:shadow-[0_6px_30px_rgba(255,0,92,0.7)] transition-shadow"
                    >
                        {ctaText}
                    </motion.button>

                    {/* Indicador de auto-inicio */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2.0, duration: 0.5 }}
                        className="absolute bottom-16 text-white/30 font-body text-xs"
                    >
                        {lang === "es" ? "Se iniciará el tutorial automáticamente..." : "Tutorial will start automatically..."}
                    </motion.p>

                    {/* Decoración inferior */}
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="absolute bottom-0 left-0 right-0 h-1 origin-right"
                        style={{
                            background: "repeating-linear-gradient(90deg, #9C27B0 0px, #9C27B0 30px, #00E5FF 30px, #00E5FF 60px, #FFD600 60px, #FFD600 90px, #FF005C 90px, #FF005C 120px)"
                        }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
