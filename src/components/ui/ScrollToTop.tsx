/**
 * ScrollToTop — Botón flotante para volver al inicio de la página
 *
 * Aparece cuando el usuario ha scrollado más de 300px.
 * Posicionado encima del BottomNav.
 */

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 300);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const scrollUp = () => window.scrollTo({ top: 0, behavior: "smooth" });

    return (
        <AnimatePresence>
            {visible && (
                <motion.button
                    key="scroll-top"
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    transition={{ type: "spring", stiffness: 380, damping: 28 }}
                    onClick={scrollUp}
                    aria-label="Volver arriba"
                    className="fixed bottom-24 left-4 z-40
                               w-10 h-10 rounded-full bg-white border-2 border-fiesta-ink
                               flex items-center justify-center
                               shadow-hard-sm hover:bg-fiesta-ink hover:text-white
                               text-fiesta-ink transition-colors"
                >
                    <ArrowUp size={18} strokeWidth={2.5} />
                </motion.button>
            )}
        </AnimatePresence>
    );
}
