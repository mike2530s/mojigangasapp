/**
 * FAB — Floating Action Button global
 *
 * Solo visible para usuarios isArtesano o isAdmin.
 * Al tocar el +, expande dos opciones con stagger animado:
 *  - Subir Mojiganga
 *  - Subir Historia
 */

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, ImagePlus, BookOpen } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";

const ACTIONS = [
    { href: "/subir-mojiganga", label: "Mojiganga", icon: ImagePlus, color: "bg-fiesta-purple" },
    { href: "/subir",           label: "Historia",  icon: BookOpen,  color: "bg-fiesta-ink"    },
];

export default function FAB() {
    const { isArtesano, isAdmin } = useAuth();
    const [open, setOpen] = useState(false);

    // Solo visible para artesanos/admins
    if (!isArtesano && !isAdmin) return null;

    return (
        <div className="fixed bottom-24 right-4 z-40 flex flex-col items-end gap-2">
            {/* Action items (stagger) */}
            <AnimatePresence>
                {open && ACTIONS.map((action, i) => (
                    <motion.div
                        key={action.href}
                        initial={{ opacity: 0, y: 10, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.8 }}
                        transition={{
                            delay: open ? (ACTIONS.length - 1 - i) * 0.07 : i * 0.05,
                            type: "spring", stiffness: 380, damping: 28,
                        }}
                    >
                        <Link
                            href={action.href}
                            onClick={() => setOpen(false)}
                            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full text-white
                                        font-heading text-xs uppercase tracking-wide shadow-hard-sm
                                        hover:opacity-90 transition-opacity ${action.color}`}
                        >
                            <action.icon size={14} />
                            {action.label}
                        </Link>
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* Main button */}
            <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setOpen(prev => !prev)}
                aria-label={open ? "Cerrar menú" : "Subir contenido"}
                className="w-12 h-12 rounded-full bg-mexican-pink text-white
                           flex items-center justify-center
                           shadow-[0_4px_20px_rgba(255,0,92,0.5)]
                           hover:shadow-[0_6px_28px_rgba(255,0,92,0.65)]
                           transition-shadow"
            >
                <motion.div
                    animate={{ rotate: open ? 45 : 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                    {open ? <X size={22} /> : <Plus size={22} />}
                </motion.div>
            </motion.button>
        </div>
    );
}
