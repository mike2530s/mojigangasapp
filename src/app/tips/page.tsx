/**
 * 💡 Tips Page — Consejos y curiosidades sobre Mojigangas
 *
 * Pantalla con tips estilo tarjetas informativas:
 * - Header con branding
 * - Título "SABÍAS QUE..." con badge
 * - Lista de tarjetas con íconos, títulos y descripciones
 * - Dato curioso destacado con fondo amarillo
 * - Animaciones de entrada stagger
 */

"use client";

import { motion } from "framer-motion";
import Header from "@/components/navigation/Header";
import { Lightbulb, Ruler, Calendar, Users, Sparkles, MapPin } from "lucide-react";

/* ── Tips / datos curiosos ─────────────────────────────── */
const TIPS = [
    {
        icon: Ruler,
        title: "Hasta 3.5 metros",
        description: "Las mojigangas más grandes pueden medir más de 3 metros de altura y pesar hasta 25 kg.",
        color: "bg-mexican-pink",
    },
    {
        icon: Calendar,
        title: "Siglo XVI",
        description: "La tradición llegó a México con los evangelizadores españoles y se fusionó con rituales prehispánicos.",
        color: "bg-fiesta-purple",
    },
    {
        icon: Users,
        title: "Una sola persona",
        description: "A pesar de su tamaño, una mojiganga la baila una sola persona que carga la estructura desde adentro.",
        color: "bg-fiesta-cyan",
    },
    {
        icon: MapPin,
        title: "San Miguel de Allende",
        description: "La capital de las mojigangas. Aquí se celebran los desfiles más espectaculares durante las fiestas patronales.",
        color: "bg-fiesta-yellow",
    },
    {
        icon: Sparkles,
        title: "Patrimonio Vivo",
        description: "En 2023 se presentó la solicitud para declarar a las mojigangas como Patrimonio Cultural Inmaterial.",
        color: "bg-mexican-pink",
    },
];

const DATO_CURIOSO = {
    titulo: "¿Sabías que...?",
    texto: "La palabra 'Mojiganga' viene del árabe 'moharracha', que significa 'bufonada'. En España eran representaciones teatrales cómicas que se hacían en las calles.",
};

/* ── Animaciones ───────────────────────────────────────── */
const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
};

export default function TipsPage() {
    return (
        <main className="page-container">
            <Header />

            {/* ── Encabezado ── */}
            <section className="px-5 mt-4 mb-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <span className="badge-tape mb-3 inline-block">Curiosidades</span>
                    <h1 className="font-heading text-4xl uppercase leading-none tracking-tight mb-2">
                        Tips &amp;<br />
                        <span className="text-mexican-pink">Datos</span>
                    </h1>
                </motion.div>
            </section>

            {/* ── Dato curioso destacado ── */}
            <motion.section
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mx-5 mb-6 bg-fiesta-yellow rounded-card p-5 shadow-hard"
            >
                <div className="flex items-start gap-3">
                    <Lightbulb size={24} className="text-fiesta-ink flex-shrink-0 mt-0.5" />
                    <div>
                        <h2 className="font-heading text-sm uppercase tracking-wider mb-1">
                            {DATO_CURIOSO.titulo}
                        </h2>
                        <p className="text-sm font-body text-fiesta-ink/80 leading-relaxed">
                            {DATO_CURIOSO.texto}
                        </p>
                    </div>
                </div>
            </motion.section>

            {/* ── Lista de tips ── */}
            <motion.section
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="px-5 space-y-4 mb-8"
            >
                {TIPS.map((tip, index) => {
                    const IconComponent = tip.icon;
                    return (
                        <motion.div
                            key={index}
                            variants={cardVariants}
                            className="bg-white rounded-card p-4 shadow-hard-sm flex items-start gap-4"
                        >
                            {/* Ícono con color */}
                            <div className={`${tip.color} w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0`}>
                                <IconComponent size={20} className="text-white" />
                            </div>
                            {/* Texto */}
                            <div>
                                <h3 className="font-heading text-sm mb-1">{tip.title}</h3>
                                <p className="text-xs text-gray-600 font-body leading-relaxed">
                                    {tip.description}
                                </p>
                            </div>
                        </motion.div>
                    );
                })}
            </motion.section>
        </main>
    );
}
