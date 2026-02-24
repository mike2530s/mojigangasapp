/**
 * 🎨 Taller Page — "Cómo se hace una Mojiganga"
 *
 * Pantalla educativa que muestra el proceso paso a paso:
 * - Header con branding
 * - Título "EL TALLER" con subtítulo explicativo
 * - Grid de tarjetas flip 3D (click para voltear)
 *   Frente: imagen + paso | Reverso: descripción
 * - Sección de materiales con íconos
 *
 * Datos placeholder hasta conectar Supabase (paso 7).
 */

"use client";

import { motion } from "framer-motion";
import Header from "@/components/navigation/Header";
import ProcessCard from "@/components/artesano/ProcessCard";

/* ── Pasos del proceso de creación ─────────────────────── */
const PROCESS_STEPS = [
    {
        step: 1,
        title: "Estructura de Carrizo",
        imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&q=80",
        description:
            "Se construye un esqueleto ligero con varas de carrizo atadas con alambre. Esta estructura define la forma y tamaño de la mojiganga, que puede medir hasta 3.5 metros.",
    },
    {
        step: 2,
        title: "Modelado con Papel",
        imageUrl: "https://images.unsplash.com/photo-1560707303-4e980ce876ad?w=400&q=80",
        description:
            "Se aplican capas de papel periódico impregnado con engrudo (mezcla de harina y agua). Cada capa se deja secar antes de aplicar la siguiente para dar rigidez.",
    },
    {
        step: 3,
        title: "Pintura y Detalle",
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80",
        description:
            "Se pinta con colores vibrantes: esmaltes, acrílicos y pigmentos naturales. Los detalles del rostro, vestimenta y accesorios definen la personalidad del personaje.",
    },
    {
        step: 4,
        title: "Vestimenta Final",
        imageUrl: "https://images.unsplash.com/photo-1604265179512-4c34e3ee5c28?w=400&q=80",
        description:
            "Se viste con telas, encajes y adornos. La ropa refleja la identidad del personaje: puede ser una novia, un diablo, una catrina o un personaje histórico.",
    },
];

/* ── Materiales tradicionales ──────────────────────────── */
const MATERIALES = [
    { emoji: "🎋", nombre: "Carrizo" },
    { emoji: "📰", nombre: "Papel" },
    { emoji: "🫗", nombre: "Engrudo" },
    { emoji: "🎨", nombre: "Pintura" },
    { emoji: "🧵", nombre: "Tela" },
    { emoji: "✨", nombre: "Adornos" },
];

/* ── Animaciones ───────────────────────────────────────── */
const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function TallerPage() {
    return (
        <main className="page-container">
            <Header />

            {/* ── Hero del Taller ── */}
            <section className="px-5 mt-4 mb-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <span className="badge-tape mb-3 inline-block">Proceso Artesanal</span>
                    <h1 className="font-heading text-4xl uppercase leading-none tracking-tight mb-2">
                        El Taller
                    </h1>
                    <p className="text-gray-600 font-body text-sm leading-relaxed">
                        Descubre el proceso ancestral de creación de una mojiganga,
                        desde la estructura de carrizo hasta la vestimenta final.
                    </p>
                </motion.div>
            </section>

            {/* ── Grid de tarjetas flip ── */}
            <motion.section
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="px-5 mb-8"
            >
                <div className="grid grid-cols-2 gap-5">
                    {PROCESS_STEPS.map((step) => (
                        <motion.div key={step.step} variants={itemVariants}>
                            <ProcessCard
                                step={step.step}
                                title={step.title}
                                imageUrl={step.imageUrl}
                                description={step.description}
                            />
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* ── Materiales ── */}
            <section className="px-5 mb-8">
                <h2 className="font-heading text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-fiesta-cyan" />
                    Materiales Tradicionales
                </h2>
                <div className="grid grid-cols-3 gap-3">
                    {MATERIALES.map((mat) => (
                        <div
                            key={mat.nombre}
                            className="bg-white rounded-2xl p-4 text-center shadow-hard-sm"
                        >
                            <span className="text-2xl block mb-1">{mat.emoji}</span>
                            <span className="text-xs font-body text-gray-600">{mat.nombre}</span>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}
