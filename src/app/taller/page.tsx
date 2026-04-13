/**
 * Taller Page — Como se hace una Mojiganga
 *
 * Todo el texto pasa por <T> para traduccion automatica via MyMemory API.
 */

"use client";

import { motion } from "framer-motion";
import Header from "@/components/navigation/Header";
import ProcessCard from "@/components/artesano/ProcessCard";
import T from "@/lib/i18n/T";

const PROCESS_STEPS = [
    {
        step: 1,
        titleEs: "Estructura de Carrizo",
        imageUrl: "https://nktouapjberliqbsyiqf.supabase.co/storage/v1/object/public/fotos-mojigangas/fotos-pdf/foto_20.jpeg",
        descEs: "Se construye un esqueleto ligero con varas de carrizo atadas con alambre. Esta estructura define la forma y tamaño de la mojiganga, que puede medir hasta 3.5 metros.",
    },
    {
        step: 2,
        titleEs: "Modelado con Papel",
        imageUrl: "https://nktouapjberliqbsyiqf.supabase.co/storage/v1/object/public/fotos-mojigangas/fotos-pdf/foto_21.jpeg",
        descEs: "Se aplican capas de papel periódico impregnado con engrudo. Cada capa se deja secar antes de aplicar la siguiente para dar rigidez.",
    },
    {
        step: 3,
        titleEs: "Pintura y Detalle",
        imageUrl: "https://nktouapjberliqbsyiqf.supabase.co/storage/v1/object/public/fotos-mojigangas/fotos-pdf/foto_22.jpeg",
        descEs: "Se pinta con colores vibrantes: esmaltes, acrílicos y pigmentos naturales. Los detalles del rostro definen la personalidad del personaje.",
    },
    {
        step: 4,
        titleEs: "Vestimenta Final",
        imageUrl: "https://nktouapjberliqbsyiqf.supabase.co/storage/v1/object/public/fotos-mojigangas/fotos-pdf/foto_23.jpeg",
        descEs: "Se viste con telas, encajes y adornos. La ropa refleja la identidad del personaje: novia, diablo, catrina o personaje histórico.",
    },
];

const MATERIALES = [
    { emoji: "🎋", nombreEs: "Carrizo" },
    { emoji: "📰", nombreEs: "Papel" },
    { emoji: "🫗", nombreEs: "Engrudo" },
    { emoji: "🎨", nombreEs: "Pintura" },
    { emoji: "🧵", nombreEs: "Tela" },
    { emoji: "✨", nombreEs: "Adornos" },
];

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

            {/* Hero */}
            <section className="px-5 mt-4 mb-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <span className="badge-tape mb-3 inline-block"><T>Proceso Artesanal</T></span>
                    <h1 className="font-heading text-4xl uppercase leading-none tracking-tight mb-2">
                        <T>El Taller</T>
                    </h1>
                    <p className="text-gray-600 font-body text-sm leading-relaxed">
                        <T>Descubre el proceso ancestral de creación de una mojiganga, desde la estructura de carrizo hasta la vestimenta final.</T>
                    </p>
                </motion.div>
            </section>

            {/* Grid de tarjetas flip */}
            <motion.section variants={containerVariants} initial="hidden" animate="visible" className="px-5 mb-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                    {PROCESS_STEPS.map((s) => (
                        <motion.div key={s.step} variants={itemVariants}>
                            <ProcessCard
                                step={s.step}
                                title={s.titleEs}
                                imageUrl={s.imageUrl}
                                description={s.descEs}
                            />
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* Materiales */}
            <section className="px-5 mb-8">
                <h2 className="font-heading text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-fiesta-cyan" />
                    <T>Materiales Tradicionales</T>
                </h2>
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {MATERIALES.map((mat, i) => (
                        <div key={i} className="bg-white rounded-2xl p-4 text-center shadow-hard-sm">
                            <span className="text-2xl block mb-1">{mat.emoji}</span>
                            <span className="text-xs font-body text-gray-600"><T>{mat.nombreEs}</T></span>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}
