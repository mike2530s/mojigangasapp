/**
 * 🧭 BottomNav — Barra de navegación inferior
 *
 * Navegación principal de la app con 4 rutas.
 * - Pill shape oscura flotante sobre el contenido
 * - El ícono activo tiene un círculo rosa mexicano con animación
 * - Usa Framer Motion para la transición del indicador activo
 * - Compatible con App Router (usePathname para ruta activa)
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, BookOpen, Map, User } from "lucide-react";

/* ── Definición de rutas de navegación ──────────────── */
const NAV_ITEMS = [
    { href: "/home", label: "Inicio", icon: Home },
    { href: "/historias", label: "Historias", icon: BookOpen },
    { href: "/mapa", label: "Mapa", icon: Map },
    { href: "/catalogo", label: "Catálogo", icon: User },
] as const;

export default function BottomNav() {
    const pathname = usePathname();

    return (
        <nav
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50
                 bg-fiesta-ink rounded-full px-6 py-3
                 flex items-center gap-8
                 shadow-hard-lg"
            aria-label="Navegación principal"
        >
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                /* Detecta si la ruta actual coincide con este item */
                const isActive =
                    pathname === href || pathname?.startsWith(href + "/");

                return (
                    <Link
                        key={href}
                        href={href}
                        aria-label={label}
                        aria-current={isActive ? "page" : undefined}
                        className="relative flex items-center justify-center w-12 h-12"
                    >
                        {/* Círculo rosa animado detrás del ícono activo */}
                        {isActive && (
                            <motion.span
                                layoutId="nav-indicator"
                                className="absolute inset-0 rounded-full bg-mexican-pink"
                                transition={{
                                    type: "spring",
                                    stiffness: 380,
                                    damping: 30,
                                }}
                            />
                        )}

                        {/* Ícono */}
                        <Icon
                            size={22}
                            strokeWidth={2.2}
                            className={`relative z-10 transition-colors duration-200 ${isActive ? "text-white" : "text-gray-400"
                                }`}
                        />
                    </Link>
                );
            })}
        </nav>
    );
}
