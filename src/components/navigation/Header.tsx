/**
 * Header -- Cabecera "Viviendo la Tradicion"
 *
 * Aparece en las pantallas principales (Home, Catalogo, etc.).
 * - Titulo estilizado con fuente Playfair Display en italica
 * - Subtitulo "LA TRADICION" en amarillo fiesta
 * - Boton Home (icono de casa) en la esquina superior derecha
 */

"use client";

import Link from "next/link";
import { Home } from "lucide-react";

export default function Header() {
    return (
        <header className="flex items-start justify-between px-5 pt-5 pb-2">
            {/* Titulo del sitio */}
            <div className="leading-none">
                <span className="font-display italic text-2xl text-fiesta-ink">
                    Viviendo
                </span>
                <br />
                <span className="font-heading text-sm tracking-wider text-fiesta-yellow">
                    LA TRADICION
                </span>
            </div>

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
        </header>
    );
}
