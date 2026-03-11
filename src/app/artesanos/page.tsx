/**
 * Artesanos Page — Lista de todos los artesanos / perfiles de creadores
 */

"use client";

import { motion } from "framer-motion";
import Header from "@/components/navigation/Header";
import ArtesanoCard from "@/components/artesano/ArtesanoCard";
import { useArtesanos } from "@/hooks/useArtesanos";
import T from "@/lib/i18n/T";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function ArtesanosPage() {
    const { artesanos, loading, error } = useArtesanos();

    return (
        <main className="page-container">
            <Header />

            {/* Encabezado */}
            <section className="px-5 mt-4 mb-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <span className="badge-tape mb-3 inline-block"><T>Creadores</T></span>
                    <h1 className="font-heading text-4xl uppercase leading-none tracking-tight mb-2">
                        <T>Almas</T><br />
                        <span className="text-mexican-pink"><T>Artesanas</T></span>
                    </h1>
                    <p className="text-gray-600 font-body text-sm leading-relaxed">
                        <T>Conoce a los maestros artesanos que dan vida a estas magníficas figuras.</T>
                    </p>
                </motion.div>
            </section>

            {/* Error */}
            {error && (
                <div className="mx-5 mb-4 p-3 bg-red-50 border border-red-200 rounded-card text-sm text-red-600 font-body">
                    <T>No se pudieron cargar los artesanos. Mostrando información guardada.</T>
                </div>
            )}

            {/* Grid de artesanos */}
            {loading ? (
                <div className="px-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white rounded-card h-52 animate-pulse shadow-hard-sm" />
                    ))}
                </div>
            ) : (
                <motion.section
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="px-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-24"
                >
                    {artesanos.map((a) => (
                        <motion.div key={a.id} variants={cardVariants}>
                            <ArtesanoCard artesano={a} />
                        </motion.div>
                    ))}
                </motion.section>
            )}
        </main>
    );
}
