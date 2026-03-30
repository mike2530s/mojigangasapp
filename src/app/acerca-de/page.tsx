"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Heart, Users, Star, Music, ChevronRight, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { 
    getAcercaDe, getColaboraciones, getPatrocinadores,
    type AcercaDeInfo, type Colaboracion, type Patrocinador
} from "@/lib/supabase/acerca-de";
import T from "@/lib/i18n/T";
import { useOnboarding } from "@/lib/onboarding/useOnboarding";
import { useTranslation } from "@/lib/i18n/LangContext";
import { GraduationCap } from "lucide-react";

export default function AcercaDePage() {
    const router = useRouter();
    const { isAdmin, user } = useAuth();
    const { startGuestTour, startUserTour, resetTour } = useOnboarding();
    const { lang } = useTranslation();
    
    const [loading, setLoading] = useState(true);
    const [acercaDe, setAcercaDe] = useState<AcercaDeInfo | null>(null);
    const [colaboraciones, setColaboraciones] = useState<Colaboracion[]>([]);
    const [patrocinadores, setPatrocinadores] = useState<Patrocinador[]>([]);

    useEffect(() => {
        Promise.all([
            getAcercaDe().catch(() => null),
            getColaboraciones().catch(() => []),
            getPatrocinadores().catch(() => []),
        ]).then(([acerca, colabs, patrocs]) => {
            setAcercaDe(acerca);
            setColaboraciones(colabs);
            setPatrocinadores(patrocs);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <main className="min-h-screen bg-paper-white flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-gray-300 border-t-mexican-pink rounded-full animate-spin" />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-paper-white pb-24 font-body relative">
            
            {/* ── HEADER HERO ── */}
            <div className="relative pt-16 pb-20 px-6 bg-fiesta-ink text-white overflow-hidden">
                {/* Patrón de fondo sutil */}
                <div className="absolute inset-0 opacity-10"
                     style={{
                         backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                         backgroundSize: "24px 24px"
                     }}>
                </div>
                
                <button
                    onClick={() => router.back()}
                    className="absolute top-5 left-5 w-10 h-10 rounded-full bg-white/10
                               backdrop-blur-sm flex items-center justify-center text-white
                               hover:bg-white/20 transition-colors z-20"
                >
                    <ArrowLeft size={20} />
                </button>

                {isAdmin && (
                    <Link
                        href="/acerca-de/editar"
                        className="absolute top-5 right-5 h-10 px-4 rounded-full bg-mexican-pink/80
                                   backdrop-blur-sm flex items-center justify-center text-white gap-2 font-heading text-xs
                                   hover:bg-mexican-pink transition-colors z-20 shadow-hard-sm"
                    >
                        <Settings size={14} />
                        <T>Administrar</T>
                    </Link>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative z-10 text-center max-w-lg mx-auto mt-4"
                >
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-heading tracking-widest uppercase mb-4">
                        <Heart size={12} className="text-mexican-pink fill-mexican-pink" />
                        <T>El Corazón del Proyecto</T>
                    </span>
                    <h1 className="font-heading text-4xl mb-4 leading-tight">
                        {acercaDe?.titulo || <T>Rescatando Nuestras Tradiciones</T>}
                    </h1>
                    <p className="text-white/80 text-sm leading-relaxed">
                        {acercaDe?.descripcion || <T>Más que un archivo digital, esta plataforma es un homenaje vivo a las manos creativas que por generaciones han llenado de magia, color y baile las calles de San Miguel.</T>}
                    </p>
                </motion.div>

                {/* Decoración inferior */}
                <div className="absolute bottom-0 left-0 w-full h-8 bg-paper-white"
                     style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 0, 0 100%)" }} />
            </div>

            {/* ── COLABORACIONES ESPECIALES ── */}
            <div className="px-5 pt-12 pb-8 max-w-xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-10 text-center"
                >
                    <h2 className="font-heading text-2xl text-fiesta-ink mb-3 flex items-center justify-center gap-2">
                        <Star size={24} className="text-mexican-pink fill-mexican-pink" />
                        <T>Colaboraciones Especiales</T>
                        <Star size={24} className="text-mexican-pink fill-mexican-pink" />
                    </h2>
                    <p className="text-gray-500 text-sm">
                        <T>Proyectos y agrupaciones que laten en conjunto con la cultura mojiganguera.</T>
                    </p>
                </motion.div>

                {/* Cards de Colaboraciones Dinámicas */}
                {colaboraciones.map((colab, idx) => (
                    <Link key={colab.id} href={`/acerca-de/colaboraciones/${colab.id}`} className="block outline-none mb-6 last:mb-0">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -4 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white rounded-[24px] overflow-hidden shadow-hard-lg border-2 border-transparent hover:border-fiesta-cyan/30 transition-all cursor-pointer relative"
                        >
                            <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center z-20 text-white">
                                <ChevronRight size={18} />
                            </div>

                            <div className="h-44 bg-gray-200 relative group">
                                <img 
                                    src={colab.foto_portada || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80"} 
                                    alt={colab.nombre}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-fiesta-ink/90 via-fiesta-ink/40 to-transparent flex items-end p-5">
                                    <h3 className="text-white font-heading text-xl flex items-center gap-2">
                                        <Music size={18} className="text-fiesta-cyan" />
                                        {colab.nombre}
                                    </h3>
                                </div>
                            </div>
                            <div className="p-6">
                                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                                    {colab.historia}
                                </p>
                                <div className="flex flex-wrap gap-2 items-center">
                                    {colab.tags.map(tag => (
                                        <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-heading">{tag}</span>
                                    ))}
                                    <span className="ml-auto text-mexican-pink text-xs font-heading group-hover:underline"><T>Ver más</T></span>
                                </div>
                            </div>
                        </motion.div>
                    </Link>
                ))}
            </div>


            {/* ── AGRADECIMIENTOS Y PATROCINADORES ── */}
            <div className="px-5 py-12 bg-gray-50 mt-8 rounded-t-[40px] border-t border-gray-100">
                <div className="max-w-xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-8 text-center"
                    >
                        <h2 className="font-heading text-2xl text-fiesta-ink mb-3 flex items-center justify-center gap-2">
                            <Users size={24} className="text-fiesta-cyan" />
                            <T>Gracias por hacerlo posible</T>
                        </h2>
                        <p className="text-gray-500 text-sm">
                            <T>Negocios locales e instituciones que patrocinan y creen en el trabajo de nuestros artesanos.</T>
                        </p>
                    </motion.div>

                    {/* Mosaico de patrocinadores Dinámicos */}
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                        {patrocinadores.map((sponsor, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-center flex flex-col items-center justify-center aspect-[4/3]"
                            >
                                {/* Círculo gris como "Logo placeholder" */}
                                <div className="w-10 h-10 rounded-full bg-gray-100 mb-3 flex items-center justify-center">
                                    <Star size={16} className="text-gray-300" />
                                </div>
                                <h4 className="font-heading text-[11px] text-fiesta-ink uppercase text-balance leading-tight mb-1">
                                    {sponsor.nombre}
                                </h4>
                                <span className="text-[10px] text-gray-400 font-body">
                                    {sponsor.rol}
                                </span>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-12 text-center">
                        <p className="text-gray-400 text-xs font-body italic">
                            <T>¿Te interesa patrocinar o colaborar?</T>
                            <br/>
                            <a href="mailto:hola@ejemplo.com" className="text-mexican-pink not-italic hover:underline mt-1 inline-block">
                                contáctanos
                            </a>
                        </p>
                    </div>

                </div>
            </div>

            {/* ── VER TUTORIAL ── */}
            <div className="px-5 py-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-xs mx-auto"
                >
                    <div className="w-14 h-14 rounded-full bg-mexican-pink/10 flex items-center justify-center mx-auto mb-4">
                        <GraduationCap size={28} className="text-mexican-pink" />
                    </div>
                    <h3 className="font-heading text-lg text-fiesta-ink mb-2">
                        <T>Ver el tutorial nuevamente</T>
                    </h3>
                    <p className="text-gray-500 text-sm font-body mb-5">
                        <T>¿Quieres que te expliquemos las secciones de la app?</T>
                    </p>
                    <motion.button
                        whileTap={{ scale: 0.96 }}
                        onClick={() => {
                            resetTour();
                            setTimeout(() => {
                                if (user) {
                                    startUserTour(user.id, lang);
                                } else {
                                    startGuestTour(lang);
                                }
                            }, 100);
                        }}
                        className="btn-primary w-full justify-center"
                    >
                        <GraduationCap size={16} />
                        <T>Iniciar tutorial</T>
                    </motion.button>
                </motion.div>
            </div>

        </main>
    );
}
