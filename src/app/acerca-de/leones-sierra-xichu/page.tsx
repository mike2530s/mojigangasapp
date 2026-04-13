"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Music, Star, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import T from "@/lib/i18n/T";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export default function LeonesXichuPage() {
    const router = useRouter();

    const fotos = [
        "https://nktouapjberliqbsyiqf.supabase.co/storage/v1/object/public/fotos-mojigangas/fotos-pdf/foto_09.jpeg",
        "https://nktouapjberliqbsyiqf.supabase.co/storage/v1/object/public/fotos-mojigangas/fotos-pdf/foto_12.jpeg",
        "https://nktouapjberliqbsyiqf.supabase.co/storage/v1/object/public/fotos-mojigangas/fotos-pdf/foto_14.jpeg",
        "https://nktouapjberliqbsyiqf.supabase.co/storage/v1/object/public/fotos-mojigangas/fotos-pdf/foto_16.jpeg",
    ];

    return (
        <main className="min-h-screen bg-paper-white pb-24 font-body">
            {/* Header / Hero */}
            <div className="relative pt-16 pb-20 px-6 bg-fiesta-ink text-white overflow-hidden">
                <button
                    onClick={() => router.back()}
                    className="absolute top-5 left-5 w-10 h-10 rounded-full bg-white/10
                               backdrop-blur-sm flex items-center justify-center text-white
                               hover:bg-white/20 transition-colors z-20"
                >
                    <ArrowLeft size={20} />
                </button>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative z-10 text-center max-w-xl mx-auto mt-4"
                >
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-fiesta-cyan/20 text-fiesta-cyan text-xs font-heading tracking-widest uppercase mb-4">
                        <Star size={12} className="fill-fiesta-cyan" />
                        <T>Colaboración Especial</T>
                    </span>
                    <h1 className="font-heading text-4xl mb-4 leading-tight flex flex-col items-center justify-center gap-2">
                        <Music size={28} className="text-mexican-pink" />
                        Leones de la Sierra de Xichú
                    </h1>
                </motion.div>

                {/* Forma inferior */}
                <div className="absolute bottom-0 left-0 w-full h-8 bg-paper-white"
                     style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 0, 0 100%)" }} />
            </div>

            <div className="px-5 pt-4 pb-0 max-w-2xl mx-auto">
                <Breadcrumbs
                    items={[
                        { label: "Inicio", href: "/home" },
                        { label: "Nuestra Cultura", href: "/acerca-de" },
                        { label: "Leones de Xichú" },
                    ]}
                    className="text-gray-400"
                />
            </div>

            <div className="px-5 pt-6 max-w-2xl mx-auto space-y-12">
                {/* ── HISTORIA DE LA COLABORACIÓN ── */}
                <section>
                    <div className="flex items-center gap-2 mb-4 text-mexican-pink">
                        <Info size={20} />
                        <h2 className="font-heading text-xl uppercase tracking-widest"><T>Historia de la Colaboración</T></h2>
                    </div>
                    
                    <div className="prose prose-sm font-body text-gray-700 leading-relaxed text-justify">
                        <p>
                            Los <strong>Leones de la Sierra de Xichú</strong> no solo son exponentes legendarios del Huapango Arribeño, 
                            sino que se han convertido en el "latido musical" que le da vida y movimiento a las mojigangas en innumerables celebraciones.
                        </p>
                        <p className="mt-4">
                            Habladores, decimeros, valones y trovadores. Su música tradicional, cargada de historias y versos locales, 
                            encuentra una sinergia perfecta con estas figuras de cartón. Juntos, logran transformar las calles en un carnaval 
                            donde lo visual y lo sonoro se fusionan, rescatando una de las tradiciones más antiguas de nuestra región.
                        </p>
                        <p className="mt-4">
                            Esta colaboración va más allá de un desfile: <em>es la prueba viviente de que cuando los ritmos tradicionales 
                            se cruzan con la cartonería monumental, la cultura se mantiene invencible ante el paso del tiempo.</em>
                        </p>
                    </div>
                </section>

                {/* ── GALERÍA DE FOTOS (Masonry) ── */}
                <section>
                    <div className="flex items-center gap-2 mb-6 text-fiesta-cyan">
                        <Music size={20} />
                        <h2 className="font-heading text-xl uppercase tracking-widest"><T>Galería en Acción</T></h2>
                    </div>

                    <div className="columns-2 gap-3 space-y-3">
                        {fotos.map((url, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="break-inside-avoid"
                            >
                                <img 
                                    src={url} 
                                    alt={`Foto de Leones de Xichú ${i+1}`} 
                                    className="w-full rounded-2xl md:rounded-[32px] object-cover shadow-sm border border-gray-100" 
                                />
                            </motion.div>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}
