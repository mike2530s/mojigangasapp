/**
 * ConsentBanner — Banner de consentimiento de Términos y Privacidad
 *
 * Aparece al fondo de la pantalla la primera vez que un visitante
 * entra al sitio. Al aceptar, se guarda en localStorage y no vuelve
 * a mostrarse.
 */

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Shield } from "lucide-react";
import T from "@/lib/i18n/T";

const STORAGE_KEY = "mojigangas_consent_accepted";

export default function ConsentBanner() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Solo mostrar si no ha aceptado antes
        const accepted = localStorage.getItem(STORAGE_KEY);
        if (!accepted) {
            // Pequeño delay para no interrumpir la carga inicial
            const timer = setTimeout(() => setVisible(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem(STORAGE_KEY, "true");
        setVisible(false);
    };

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ y: 200, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 200, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed bottom-0 left-0 right-0 z-[60] p-4 pb-24 sm:pb-4"
                >
                    <div className="max-w-lg mx-auto bg-fiesta-ink rounded-2xl p-5 shadow-2xl
                                    border border-white/10 backdrop-blur-sm">
                        {/* Icono + Texto */}
                        <div className="flex items-start gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-mexican-pink/20 flex items-center
                                            justify-center flex-shrink-0 mt-0.5">
                                <Shield size={20} className="text-mexican-pink" />
                            </div>
                            <div>
                                <h3 className="font-heading text-sm text-white mb-1">
                                    <T>Tu privacidad es importante</T>
                                </h3>
                                <p className="text-xs font-body text-gray-400 leading-relaxed">
                                    <T>Al continuar navegando en Mojigangas: Tradición Viva, aceptas nuestros</T>{" "}
                                    <Link href="/terminos" className="text-fiesta-yellow underline hover:text-white transition-colors">
                                        <T>Términos y Condiciones</T>
                                    </Link>{" "}
                                    <T>y nuestro</T>{" "}
                                    <Link href="/privacidad" className="text-fiesta-yellow underline hover:text-white transition-colors">
                                        <T>Aviso de Privacidad</T>
                                    </Link>.
                                </p>
                            </div>
                        </div>

                        {/* Botones */}
                        <div className="flex gap-3">
                            <button
                                onClick={handleAccept}
                                className="flex-1 bg-mexican-pink text-white font-heading text-sm
                                           py-2.5 rounded-xl hover:bg-pink-600 transition-colors"
                            >
                                <T>Aceptar</T>
                            </button>
                            <Link
                                href="/terminos"
                                className="px-4 py-2.5 border border-white/20 text-white/70 font-body
                                           text-xs rounded-xl hover:bg-white/10 transition-colors
                                           flex items-center"
                            >
                                <T>Leer más</T>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
