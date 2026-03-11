/**
 * BottomNav -- Barra de navegacion inferior (mobile) / centrada (desktop)
 *
 * Etiquetas de tabs traducidas automaticamente via useText.
 * En desktop (lg:) muestra labels junto a los iconos.
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, BookOpen, Map, User } from "lucide-react";
import { useText } from "@/lib/i18n/useText";

const NAV_HREFS = [
    { href: "/home", labelEs: "Inicio", icon: Home },
    { href: "/historias", labelEs: "Historias", icon: BookOpen },
    { href: "/mapa", labelEs: "Mapa", icon: Map },
    { href: "/catalogo", labelEs: "Catálogo", icon: User },
] as const;

function NavItem({ href, labelEs, icon: Icon }: { href: string; labelEs: string; icon: typeof Home }) {
    const pathname = usePathname();
    const label = useText(labelEs);
    const isActive = pathname === href || pathname?.startsWith(href + "/");

    return (
        <Link
            href={href}
            aria-label={label}
            aria-current={isActive ? "page" : undefined}
            className="relative flex items-center justify-center w-12 h-12 lg:w-auto lg:h-auto lg:gap-2 lg:px-4 lg:py-2 lg:rounded-xl"
        >
            {isActive && (
                <motion.span
                    layoutId="nav-indicator"
                    className="absolute inset-0 rounded-full lg:rounded-xl bg-mexican-pink"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
            )}
            <Icon
                size={22}
                strokeWidth={2.2}
                className={`relative z-10 transition-colors duration-200 ${isActive ? "text-white" : "text-gray-400"}`}
            />
            <span className={`hidden lg:inline relative z-10 text-sm font-heading transition-colors duration-200 ${isActive ? "text-white" : "text-gray-400"}`}>
                {label}
            </span>
        </Link>
    );
}

export default function BottomNav() {
    return (
        <nav
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50
                 bg-fiesta-ink rounded-full px-6 py-3
                 flex items-center gap-4 lg:gap-2
                 shadow-hard-lg"
            aria-label="Navegacion principal"
        >
            {NAV_HREFS.map((item) => (
                <NavItem key={item.href} {...item} />
            ))}
        </nav>
    );
}
