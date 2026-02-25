/**
 * Home Page — Pantalla de inicio
 *
 * Todo el texto UI se traduce automaticamente via <T> y useText.
 */

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Header from "@/components/navigation/Header";
import HeroStoryCard from "@/components/home/HeroStoryCard";
import { useMojigangas } from "@/hooks/useMojigangas";
import T from "@/lib/i18n/T";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};
const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
};

export default function HomePage() {
    const { mojigangas } = useMojigangas();
    const hero = mojigangas[0];
    const collection = mojigangas.slice(1);

    return (
        <main className="page-container">
            <Header />

            {/* Hero */}
            <section className="mt-4">
                <HeroStoryCard
                    imageSrc={hero?.imagen_url || "https://images.unsplash.com/photo-1531746790095-e6b20018a58a?w=800&q=80"}
                    title={hero?.nombre || "Ojos que Cuentan Historias"}
                    description={hero?.historia || "Descubre el significado detrás de la mirada esmeralda de Doña Josefa..."}
                    href={hero ? `/catalogo/${hero.id}` : undefined}
                />
            </section>

            {/* Coleccion Viva */}
            <section className="mt-8 px-5">
                <div className="flex items-center gap-2 mb-4">
                    <span className="w-3 h-3 rounded-full bg-mexican-pink" />
                    <h3 className="font-heading text-sm uppercase tracking-widest">
                        <T>Colección Viva</T>
                    </h3>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 -mx-1 px-1"
                >
                    {collection.map((item) => (
                        <motion.div key={item.id} variants={cardVariants} className="flex-shrink-0 w-48">
                            <Link href={`/catalogo/${item.id}`}>
                                <div className="card-polaroid">
                                    <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-gray-200">
                                        <img src={item.imagen_url} alt={item.nombre} className="w-full h-full object-cover" />
                                        <span className="absolute bottom-2 right-2 bg-fiesta-ink/80 text-white text-xs px-2 py-0.5 rounded font-body">
                                            {item.año}
                                        </span>
                                    </div>
                                </div>
                                <p className="mt-2 text-sm font-body text-gray-700 text-center line-clamp-2">{item.nombre}</p>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            <div className="divider-fiesta mx-5 mt-8 mb-6 rounded-full" />

            {/* Descubre Mas */}
            <section className="px-5 mb-8">
                <div className="flex items-center gap-2 mb-4">
                    <span className="w-3 h-3 rounded-full bg-fiesta-cyan" />
                    <h3 className="font-heading text-sm uppercase tracking-widest">
                        <T>Descubre Más</T>
                    </h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <a href="/taller" className="bg-fiesta-ink rounded-card p-5 shadow-hard-sm group">
                        <span className="text-fiesta-yellow font-heading text-xs uppercase tracking-widest"><T>Proceso</T></span>
                        <h4 className="text-white font-heading text-lg mt-1 group-hover:text-fiesta-yellow transition-colors"><T>El Taller</T></h4>
                        <p className="text-gray-400 text-xs font-body mt-1"><T>Cómo se crea una mojiganga</T></p>
                    </a>
                    <a href="/tips" className="bg-white rounded-card p-5 shadow-hard-sm group border-2 border-transparent hover:border-mexican-pink transition-colors">
                        <span className="text-fiesta-purple font-heading text-xs uppercase tracking-widest"><T>Curiosidades</T></span>
                        <h4 className="text-fiesta-ink font-heading text-lg mt-1"><T>Tips & Datos</T></h4>
                        <p className="text-gray-500 text-xs font-body mt-1"><T>Sabías que...</T></p>
                    </a>
                </div>
            </section>
        </main>
    );
}
