/**
 * Términos y Condiciones — Mojigangas: Tradición Viva
 */

"use client";

import { motion } from "framer-motion";
import Header from "@/components/navigation/Header";
import T from "@/lib/i18n/T";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TerminosPage() {
    return (
        <main className="page-container">
            <Header />

            <section className="px-5 mt-4 mb-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <Link href="/home" className="inline-flex items-center gap-2 text-sm font-body text-gray-500 hover:text-mexican-pink mb-4">
                        <ArrowLeft size={16} /> <T>Volver al inicio</T>
                    </Link>
                    <span className="badge-tape mb-3 inline-block"><T>Legal</T></span>
                    <h1 className="font-heading text-3xl uppercase leading-none tracking-tight mb-4">
                        <T>Términos y</T><br />
                        <span className="text-mexican-pink"><T>Condiciones</T></span>
                    </h1>
                    <p className="text-gray-400 font-body text-xs mb-6">
                        <T>Última actualización:</T> 10 de marzo de 2026
                    </p>
                </motion.div>
            </section>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="px-5 mb-8 space-y-6"
            >
                {/* 1. Aceptación */}
                <section className="bg-white rounded-card p-5 shadow-hard-sm">
                    <h2 className="font-heading text-sm uppercase tracking-widest mb-3 flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-mexican-pink" />
                        <T>1. Aceptación de los términos</T>
                    </h2>
                    <p className="text-sm font-body text-gray-600 leading-relaxed">
                        <T>Al acceder y utilizar la plataforma Mojigangas: Tradición Viva, aceptas estos términos y condiciones en su totalidad. Si no estás de acuerdo con alguno de ellos, te pedimos que no utilices la plataforma.</T>
                    </p>
                </section>

                {/* 2. Descripción */}
                <section className="bg-white rounded-card p-5 shadow-hard-sm">
                    <h2 className="font-heading text-sm uppercase tracking-widest mb-3 flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-fiesta-cyan" />
                        <T>2. Descripción del servicio</T>
                    </h2>
                    <p className="text-sm font-body text-gray-600 leading-relaxed">
                        <T>Mojigangas: Tradición Viva es una plataforma web cultural, educativa y sin fines de lucro que busca preservar y difundir la tradición de las mojigangas del estado de Guanajuato, México. La plataforma ofrece un catálogo visual de mojigangas, historias de la comunidad, un mapa interactivo de eventos y contenido educativo sobre el proceso artesanal.</T>
                    </p>
                </section>

                {/* 3. Contenido del usuario */}
                <section className="bg-white rounded-card p-5 shadow-hard-sm">
                    <h2 className="font-heading text-sm uppercase tracking-widest mb-3 flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-fiesta-yellow" />
                        <T>3. Contenido generado por usuarios</T>
                    </h2>
                    <div className="text-sm font-body text-gray-600 leading-relaxed space-y-3">
                        <p>
                            <T>Al subir historias, fotografías u otro contenido a la plataforma, declaras que:</T>
                        </p>
                        <ul className="list-disc pl-5 space-y-1.5">
                            <li><T>Eres el autor o cuentas con los derechos necesarios para compartir dicho contenido.</T></li>
                            <li><T>Otorgas a la plataforma una licencia no exclusiva, gratuita y mundial para mostrar, distribuir y promocionar tu contenido dentro de la plataforma con fines culturales y educativos.</T></li>
                            <li><T>El contenido no contiene material ofensivo, discriminatorio, violento, ilegal o que viole derechos de terceros.</T></li>
                        </ul>
                        <p>
                            <T>Nos reservamos el derecho de moderar, editar o eliminar cualquier contenido que consideremos inapropiado o que viole estos términos, sin necesidad de previo aviso.</T>
                        </p>
                    </div>
                </section>

                {/* 4. Uso aceptable */}
                <section className="bg-white rounded-card p-5 shadow-hard-sm">
                    <h2 className="font-heading text-sm uppercase tracking-widest mb-3 flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-fiesta-purple" />
                        <T>4. Uso aceptable</T>
                    </h2>
                    <div className="text-sm font-body text-gray-600 leading-relaxed space-y-3">
                        <p><T>Al usar la plataforma, te comprometes a:</T></p>
                        <ul className="list-disc pl-5 space-y-1.5">
                            <li><T>No utilizar la plataforma para fines comerciales sin autorización.</T></li>
                            <li><T>No subir contenido que sea falso, engañoso o spam.</T></li>
                            <li><T>No intentar acceder de forma no autorizada a sistemas o datos de la plataforma.</T></li>
                            <li><T>Respetar la propiedad intelectual de los artesanos y creadores.</T></li>
                            <li><T>Tratar con respeto a todos los miembros de la comunidad.</T></li>
                        </ul>
                    </div>
                </section>

                {/* 5. Propiedad intelectual */}
                <section className="bg-white rounded-card p-5 shadow-hard-sm">
                    <h2 className="font-heading text-sm uppercase tracking-widest mb-3 flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-mexican-pink" />
                        <T>5. Propiedad intelectual</T>
                    </h2>
                    <p className="text-sm font-body text-gray-600 leading-relaxed">
                        <T>El diseño, código, textos originales y estructura de la plataforma son propiedad de sus creadores. Las imágenes y relatos subidos por artesanos y usuarios son propiedad de sus respectivos autores. La plataforma actúa únicamente como medio de difusión cultural.</T>
                    </p>
                </section>

                {/* 6. Gratuidad */}
                <section className="bg-white rounded-card p-5 shadow-hard-sm">
                    <h2 className="font-heading text-sm uppercase tracking-widest mb-3 flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-fiesta-cyan" />
                        <T>6. Gratuidad</T>
                    </h2>
                    <p className="text-sm font-body text-gray-600 leading-relaxed">
                        <T>El uso de la plataforma es completamente gratuito. No se cobra ninguna tarifa por acceder, publicar contenido o utilizar cualquiera de sus funcionalidades.</T>
                    </p>
                </section>

                {/* 7. Limitación de responsabilidad */}
                <section className="bg-white rounded-card p-5 shadow-hard-sm">
                    <h2 className="font-heading text-sm uppercase tracking-widest mb-3 flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-fiesta-yellow" />
                        <T>7. Limitación de responsabilidad</T>
                    </h2>
                    <p className="text-sm font-body text-gray-600 leading-relaxed">
                        <T>La plataforma se ofrece &quot;tal cual&quot; sin garantías de ningún tipo. No nos hacemos responsables por la veracidad del contenido publicado por usuarios, interrupciones del servicio, pérdida de datos o cualquier daño derivado del uso de la plataforma.</T>
                    </p>
                </section>

                {/* 8. Modificaciones */}
                <section className="bg-white rounded-card p-5 shadow-hard-sm">
                    <h2 className="font-heading text-sm uppercase tracking-widest mb-3 flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-fiesta-purple" />
                        <T>8. Modificaciones</T>
                    </h2>
                    <p className="text-sm font-body text-gray-600 leading-relaxed">
                        <T>Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor al ser publicados en esta página. El uso continuado de la plataforma después de los cambios constituye tu aceptación de los mismos.</T>
                    </p>
                </section>

                {/* 9. Contacto */}
                <section className="bg-fiesta-ink rounded-card p-5 shadow-hard">
                    <h2 className="font-heading text-sm uppercase tracking-widest mb-3 flex items-center gap-2 text-fiesta-yellow">
                        <span className="w-3 h-3 rounded-full bg-fiesta-yellow" />
                        <T>9. Contacto</T>
                    </h2>
                    <p className="text-sm font-body text-gray-300 leading-relaxed">
                        <T>Si tienes dudas o comentarios sobre estos términos, puedes contactarnos en:</T>
                    </p>
                    <a href="mailto:diazriveram05@gmail.com"
                        className="inline-block mt-2 text-sm font-heading text-fiesta-yellow hover:text-white transition-colors">
                        diazriveram05@gmail.com
                    </a>
                </section>

                {/* Link a privacidad */}
                <div className="text-center pt-2">
                    <Link href="/privacidad" className="text-sm font-body text-mexican-pink hover:underline">
                        <T>Ver Aviso de Privacidad</T> →
                    </Link>
                </div>
            </motion.div>
        </main>
    );
}
