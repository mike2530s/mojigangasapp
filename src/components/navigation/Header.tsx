/**
 * Header -- Cabecera con toggle de idioma
 *
 * Tagline y subtitulo se traducen automaticamente via <T>.
 * El toggle muestra ES/EN y cambia el idioma via LangContext.
 */

"use client";

import Link from "next/link";
import { Home } from "lucide-react";
import { useTranslation } from "@/lib/i18n/LangContext";
import T from "@/lib/i18n/T";

export default function Header() {
    const { lang, setLang } = useTranslation();

    return (
        <header className="flex items-start justify-between px-5 pt-5 pb-2">
            {/* Titulo */}
            <div className="leading-none">
                <span className="font-display italic text-2xl text-fiesta-ink">
                    <T>Viviendo</T>
                </span>
                <br />
                <span className="font-heading text-sm tracking-wider text-fiesta-yellow">
                    <T>LA TRADICIÓN</T>
                </span>
            </div>

            {/* Acciones: toggle idioma + home */}
            <div className="flex items-center gap-2">
                {/* Toggle ES / EN */}
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

                {/* Boton Home */}
                <Link
                    href="/home"
                    className="w-10 h-10 rounded-xl bg-fiesta-ink text-paper-white
                         flex items-center justify-center shadow-hard-sm
                         hover:scale-105 active:scale-95 transition-transform"
                    aria-label="Ir al inicio"
                >
                    <Home size={18} />
                </Link>
            </div>
        </header>
    );
}
