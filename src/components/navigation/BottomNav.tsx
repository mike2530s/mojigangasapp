/**
 * BottomNav -- Barra de navegación inferior rediseñada
 *
 * 6 destinos principales, todos siempre visibles.
 * Badges (dot rojo pulsante) en Historias y Catálogo cuando hay contenido nuevo (< 3 días).
 * El badge desaparece cuando el usuario visita la página.
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, BookOpen, Map, Layers, Palette, Heart } from "lucide-react";
import { useText } from "@/lib/i18n/useText";
import { useHistorias } from "@/hooks/useHistorias";
import { useMojigangas } from "@/hooks/useMojigangas";
import { useEffect, useState } from "react";

const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

function useNewContentBadge(storageKey: string, timestamps: string[]) {
    const [hasNew, setHasNew] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined") return;
        const lastSeen = parseInt(localStorage.getItem(storageKey) || "0", 10);
        const now = Date.now();
        const isRecent = timestamps.some(ts => {
            const age = now - new Date(ts).getTime();
            return age < THREE_DAYS_MS && new Date(ts).getTime() > lastSeen;
        });
        setHasNew(isRecent);
    }, [storageKey, timestamps]);

    return hasNew;
}

const NAV_ITEMS = [
    { href: "/home",      labelEs: "Inicio",    icon: Home,     color: "text-fiesta-yellow", badgeKey: null },
    { href: "/historias", labelEs: "Historias", icon: BookOpen, color: "text-fiesta-cyan",   badgeKey: "seen_historias" },
    { href: "/mapa",      labelEs: "Mapa",      icon: Map,      color: "text-fiesta-cyan",   badgeKey: null },
    { href: "/catalogo",  labelEs: "Catálogo",  icon: Layers,   color: "text-fiesta-yellow", badgeKey: "seen_catalogo" },
    { href: "/artesanos", labelEs: "Artesanos", icon: Palette,  color: "text-mexican-pink",  badgeKey: null },
    { href: "/acerca-de", labelEs: "Cultura",   icon: Heart,    color: "text-mexican-pink",  badgeKey: null },
] as const;

type NavItemProps = {
    href: string;
    labelEs: string;
    icon: typeof Home;
    color: string;
    showBadge?: boolean;
};

function NavItem({ href, labelEs, icon: Icon, color, showBadge }: NavItemProps) {
    const pathname = usePathname();
    const label = useText(labelEs);
    const isActive = pathname === href || pathname?.startsWith(href + "/");

    return (
        <Link
            href={href}
            aria-label={label}
            aria-current={isActive ? "page" : undefined}
            className="relative flex flex-col items-center justify-center gap-0.5
                       w-12 h-14 lg:w-auto lg:h-auto lg:flex-row lg:gap-2 lg:px-4 lg:py-2.5
                       flex-shrink-0"
        >
            {isActive && (
                <motion.span
                    layoutId="nav-indicator"
                    className="absolute inset-0 rounded-2xl bg-white/15"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
            )}

            {/* Icon wrapper — glows when active */}
            <span className={`relative z-10 transition-all duration-200
                ${isActive
                    ? `${color} drop-shadow-[0_0_6px_currentColor]`
                    : "text-white/40"
                }`}
            >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />

                {/* Badge punto rojo */}
                {showBadge && !isActive && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-mexican-pink
                                     ring-2 ring-fiesta-ink animate-pulse" />
                )}
            </span>

            {/* Label — oculto en móvil pequeño, visible en sm+ */}
            <span className={`relative z-10 text-[9px] font-heading uppercase tracking-wide
                            transition-colors duration-200 leading-none hidden sm:block
                            lg:text-xs lg:normal-case lg:tracking-normal
                            ${isActive ? "text-white" : "text-white/40"}`}>
                {label}
            </span>
        </Link>
    );
}

export default function BottomNav() {
    const { historias } = useHistorias();
    const { mojigangas } = useMojigangas();

    const historiasTs = historias.map(h => h.created_at).filter(Boolean) as string[];
    const mojigangasTs = mojigangas.map(m => (m as { created_at?: string }).created_at ?? "").filter(Boolean);

    const historiasNew = useNewContentBadge("seen_historias", historiasTs);
    const catalogoNew = useNewContentBadge("seen_catalogo", mojigangasTs);

    const BADGE_MAP: Record<string, boolean> = {
        "/historias": historiasNew,
        "/catalogo": catalogoNew,
    };

    return (
        <nav
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50
                       bg-fiesta-ink border border-white/10
                       rounded-2xl px-3 py-1
                       flex items-center gap-1 lg:gap-0
                       shadow-[0_8px_32px_rgba(0,0,0,0.35)]
                       max-w-[96vw] overflow-x-auto hide-scrollbar"
            aria-label="Navegación principal"
        >
            {NAV_ITEMS.map((item, i) => (
                <>
                    {i === 4 && (
                        <span
                            key="divider"
                            className="w-px h-8 bg-white/10 mx-1 flex-shrink-0"
                            aria-hidden
                        />
                    )}
                    <NavItem
                        key={item.href}
                        {...item}
                        showBadge={BADGE_MAP[item.href] ?? false}
                    />
                </>
            ))}
        </nav>
    );
}
