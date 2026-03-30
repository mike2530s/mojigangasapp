/**
 * Header -- Cabecera global rediseñada
 *
 * Incluye accesos rápidos visibles a Artesanos y Cultura,
 * toggle de idioma, y botón de búsqueda global.
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Palette, Heart, Search } from "lucide-react";
import { useTranslation } from "@/lib/i18n/LangContext";
import T from "@/lib/i18n/T";
import SearchOverlay from "@/components/ui/SearchOverlay";

const QUICK_LINKS = [
    { href: "/artesanos", labelEs: "Artesanos", icon: Palette, accent: "hover:bg-mexican-pink" },
    { href: "/acerca-de", labelEs: "Cultura",   icon: Heart,   accent: "hover:bg-fiesta-purple" },
] as const;

export default function Header() {
    const { lang, setLang } = useTranslation();
    const pathname = usePathname();
    const [searchOpen, setSearchOpen] = useState(false);

    return (
        <header className="flex items-center justify-between px-4 pt-4 pb-2 gap-3">
            {/* ── Logo / Wordmark ── */}
            <Link href="/home" className="leading-none flex-shrink-0 group" aria-label="Inicio">
                <span className="font-display italic text-xl text-fiesta-ink
                                 group-hover:text-mexican-pink transition-colors">
                    Mojigangas
                </span>
                <br />
                <span className="font-heading text-[10px] tracking-widest text-fiesta-yellow uppercase">
                    <T>La Tradición</T>
                </span>
            </Link>

            {/* ── Quick-access pills — solo visible en tablet/desktop (en móvil están en BottomNav) ── */}
            <div className="hidden sm:flex items-center gap-1.5 flex-1 justify-center">
                {QUICK_LINKS.map(({ href, labelEs, icon: Icon, accent }) => {
                    const isActive = pathname === href || pathname?.startsWith(href + "/");
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full
                                        text-xs font-heading uppercase tracking-wide
                                        border-2 transition-all duration-200
                                        ${isActive
                                            ? "bg-fiesta-ink text-white border-fiesta-ink shadow-hard-sm"
                                            : `bg-white text-fiesta-ink border-fiesta-ink/20
                                               ${accent} hover:text-white hover:border-transparent`
                                        }`}
                        >
                            <Icon size={13} strokeWidth={2.5} />
                            <span><T>{labelEs}</T></span>
                        </Link>
                    );
                })}
            </div>

            {/* ── Acciones: búsqueda + toggle idioma ── */}
            <div className="flex items-center gap-2 flex-shrink-0">
                {/* Búsqueda */}
                <button
                    id="btn-search"
                    onClick={() => setSearchOpen(true)}
                    aria-label="Buscar"
                    className="w-8 h-8 rounded-full bg-white border-2 border-fiesta-ink
                               flex items-center justify-center text-fiesta-ink
                               shadow-hard-sm hover:bg-fiesta-ink hover:text-paper-white
                               transition-colors"
                >
                    <Search size={15} strokeWidth={2.5} />
                </button>

                {/* Toggle idioma */}
                <button
                    onClick={() => setLang(lang === "es" ? "en" : "es")}
                    className="h-8 px-3 rounded-full bg-white border-2 border-fiesta-ink
                               font-heading text-xs uppercase tracking-wider text-fiesta-ink
                               shadow-hard-sm hover:bg-fiesta-ink hover:text-paper-white
                               transition-colors"
                    aria-label="Cambiar idioma"
                >
                    {lang === "es" ? "EN" : "ES"}
                </button>
            </div>

            <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
        </header>
    );
}
