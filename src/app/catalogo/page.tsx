/**
 * 📚 Catálogo Page — "Almas de Cartón" Enciclopedia de Personajes
 *
 * Pantalla del catálogo de mojigangas con:
 * - Header con branding "Viviendo LA TRADICIÓN"
 * - Hero section: título grande "ALMAS DE CARTÓN", badge púrpura
 * - Grid de tarjetas polaroid con rotación alternada
 * - Dark detail card con información cultural
 *
 * Conectado a Supabase via useMojigangas hook (fallback offline).
 */

"use client";

import { motion } from "framer-motion";
import Header from "@/components/navigation/Header";
import PolaroidCard from "@/components/catalogo/PolaroidCard";
import DarkDetailCard from "@/components/catalogo/DarkDetailCard";
import { useMojigangas } from "@/hooks/useMojigangas";

export default function CatalogoPage() {
    const { mojigangas, loading } = useMojigangas();

    return (
        <main className="page-container">
            <Header />

            {/* ── Hero Section ── */}
            <section className="px-5 mt-4 mb-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="font-heading text-5xl uppercase leading-none tracking-tight text-fiesta-ink">
                        Almas de
                        <br />
                        <span className="text-stroke">Cartón</span>
                    </h1>
                    <div className="mt-3 mb-3">
                        <span className="inline-block px-4 py-1.5 bg-fiesta-purple text-white 
                             font-heading text-xs uppercase tracking-wider shadow-hard-sm">
                            Enciclopedia de Personajes
                        </span>
                    </div>
                    <button className="flex items-center gap-2 font-heading text-xs uppercase tracking-wider
                             text-fiesta-ink hover:text-mexican-pink transition-colors">
                        Descubre sus historias <span className="text-lg">→</span>
                    </button>
                </motion.div>
            </section>

            {/* ── Grid de Polaroids ── */}
            <section className="px-5 mb-8">
                {loading ? (
                    <div className="grid grid-cols-2 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="aspect-[3/4] bg-gray-200 rounded-card animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-6">
                        {mojigangas.map((m, index) => (
                            <PolaroidCard
                                key={m.id}
                                id={m.id}
                                nombre={m.nombre}
                                imagenUrl={m.imagen_url}
                                año={m.año}
                                index={index}
                                onClick={(id) => console.log("Ver detalle:", id)}
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* ── Dark Detail Card ── */}
            <section className="mb-8">
                <DarkDetailCard
                    categoria="Tradición"
                    titulo="El Alma del Papel"
                    descripcion="Cada Mojiganga nace de una estructura de carrizo y capas de papel impregnadas de engrudo. No son solo muñecos, son contenedores de historias locales y sátira social que cobran vida cuando alguien las baila."
                    tags={["Tradición", "Arte Popular"]}
                />
            </section>
        </main>
    );
}
