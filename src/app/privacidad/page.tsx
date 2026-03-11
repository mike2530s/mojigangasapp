/**
 * Aviso de Privacidad — Mojigangas: Tradición Viva
 *
 * Cumple con la Ley Federal de Protección de Datos Personales
 * en Posesión de los Particulares (LFPDPPP) de México.
 */

"use client";

import { motion } from "framer-motion";
import Header from "@/components/navigation/Header";
import T from "@/lib/i18n/T";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacidadPage() {
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
                        <T>Aviso de</T><br />
                        <span className="text-mexican-pink"><T>Privacidad</T></span>
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
                {/* 1. Responsable */}
                <section className="bg-white rounded-card p-5 shadow-hard-sm">
                    <h2 className="font-heading text-sm uppercase tracking-widest mb-3 flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-mexican-pink" />
                        <T>1. Responsable de los datos</T>
                    </h2>
                    <div className="text-sm font-body text-gray-600 leading-relaxed space-y-2">
                        <p>
                            <T>La plataforma Mojigangas: Tradición Viva es un proyecto cultural educativo y sin fines de lucro, desarrollado por Miguel Díaz Rivera, estudiante de Ingeniería en Sistemas y Desarrollo de Software en el estado de Guanajuato, México.</T>
                        </p>
                        <p>
                            <strong><T>Correo de contacto:</T></strong>{" "}
                            <a href="mailto:diazriveram05@gmail.com" className="text-mexican-pink hover:underline">
                                diazriveram05@gmail.com
                            </a>
                        </p>
                    </div>
                </section>

                {/* 2. Datos que recopilamos */}
                <section className="bg-white rounded-card p-5 shadow-hard-sm">
                    <h2 className="font-heading text-sm uppercase tracking-widest mb-3 flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-fiesta-cyan" />
                        <T>2. Datos personales que recopilamos</T>
                    </h2>
                    <div className="text-sm font-body text-gray-600 leading-relaxed space-y-3">
                        <p><T>La plataforma puede recopilar los siguientes datos personales de forma voluntaria:</T></p>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-2 pr-3 font-heading uppercase tracking-wider"><T>Dato</T></th>
                                        <th className="text-left py-2 font-heading uppercase tracking-wider"><T>Finalidad</T></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    <tr>
                                        <td className="py-2 pr-3"><T>Nombre</T></td>
                                        <td className="py-2"><T>Identificar al autor de historias publicadas</T></td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 pr-3"><T>Ubicación (texto)</T></td>
                                        <td className="py-2"><T>Contexto geográfico de la historia compartida</T></td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 pr-3"><T>Fotografías</T></td>
                                        <td className="py-2"><T>Ilustrar historias y el catálogo de mojigangas</T></td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 pr-3"><T>Correo electrónico</T></td>
                                        <td className="py-2"><T>Inicio de sesión para artesanos registrados</T></td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 pr-3"><T>Preferencia de idioma</T></td>
                                        <td className="py-2"><T>Personalizar la experiencia (ES/EN)</T></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* 3. Finalidad */}
                <section className="bg-white rounded-card p-5 shadow-hard-sm">
                    <h2 className="font-heading text-sm uppercase tracking-widest mb-3 flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-fiesta-yellow" />
                        <T>3. Finalidad del tratamiento</T>
                    </h2>
                    <div className="text-sm font-body text-gray-600 leading-relaxed space-y-2">
                        <p><T>Los datos personales recabados se utilizan exclusivamente para:</T></p>
                        <ul className="list-disc pl-5 space-y-1.5">
                            <li><T>Publicar historias y contenido cultural en la plataforma.</T></li>
                            <li><T>Gestionar cuentas de artesanos registrados.</T></li>
                            <li><T>Mejorar la experiencia del usuario.</T></li>
                            <li><T>Preservar y difundir la tradición de las mojigangas.</T></li>
                        </ul>
                        <p><T>No vendemos, comercializamos ni cedemos tus datos personales a terceros.</T></p>
                    </div>
                </section>

                {/* 4. Almacenamiento */}
                <section className="bg-white rounded-card p-5 shadow-hard-sm">
                    <h2 className="font-heading text-sm uppercase tracking-widest mb-3 flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-fiesta-purple" />
                        <T>4. Almacenamiento y seguridad</T>
                    </h2>
                    <div className="text-sm font-body text-gray-600 leading-relaxed space-y-2">
                        <p>
                            <T>Los datos se almacenan en servidores de Supabase con cifrado en tránsito (TLS) y en reposo. Las contraseñas se almacenan con hash seguro y nunca en texto plano.</T>
                        </p>
                        <p>
                            <T>Las imágenes subidas se almacenan en Supabase Storage y son de acceso público dentro de la plataforma.</T>
                        </p>
                    </div>
                </section>

                {/* 5. Cookies y localStorage */}
                <section className="bg-white rounded-card p-5 shadow-hard-sm">
                    <h2 className="font-heading text-sm uppercase tracking-widest mb-3 flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-mexican-pink" />
                        <T>5. Cookies y almacenamiento local</T>
                    </h2>
                    <div className="text-sm font-body text-gray-600 leading-relaxed space-y-2">
                        <p><T>La plataforma utiliza:</T></p>
                        <ul className="list-disc pl-5 space-y-1.5">
                            <li><T>localStorage para guardar tu preferencia de idioma (ES/EN) y caché de traducciones.</T></li>
                            <li><T>Cookies de sesión de Supabase para mantener la sesión de artesanos autenticados.</T></li>
                        </ul>
                        <p><T>No utilizamos cookies de rastreo, publicidad ni analíticas de terceros.</T></p>
                    </div>
                </section>

                {/* 6. Derechos ARCO */}
                <section className="bg-white rounded-card p-5 shadow-hard-sm">
                    <h2 className="font-heading text-sm uppercase tracking-widest mb-3 flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-fiesta-cyan" />
                        <T>6. Derechos ARCO</T>
                    </h2>
                    <div className="text-sm font-body text-gray-600 leading-relaxed space-y-2">
                        <p>
                            <T>De acuerdo con la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP), tienes derecho a:</T>
                        </p>
                        <ul className="list-disc pl-5 space-y-1.5">
                            <li><strong><T>Acceder</T></strong> <T>a tus datos personales.</T></li>
                            <li><strong><T>Rectificar</T></strong> <T>tus datos si son inexactos.</T></li>
                            <li><strong><T>Cancelar</T></strong> <T>el uso de tus datos.</T></li>
                            <li><strong><T>Oponerte</T></strong> <T>al tratamiento de tus datos.</T></li>
                        </ul>
                        <p>
                            <T>Para ejercer cualquiera de estos derechos, envía un correo a</T>{" "}
                            <a href="mailto:diazriveram05@gmail.com" className="text-mexican-pink hover:underline">
                                diazriveram05@gmail.com
                            </a>{" "}
                            <T>indicando tu solicitud.</T>
                        </p>
                    </div>
                </section>

                {/* 7. Menores */}
                <section className="bg-white rounded-card p-5 shadow-hard-sm">
                    <h2 className="font-heading text-sm uppercase tracking-widest mb-3 flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-fiesta-yellow" />
                        <T>7. Menores de edad</T>
                    </h2>
                    <p className="text-sm font-body text-gray-600 leading-relaxed">
                        <T>La plataforma no establece restricción de edad para su uso. Sin embargo, recomendamos que los menores de edad utilicen la plataforma bajo la supervisión de un adulto, especialmente al compartir contenido que incluya datos personales.</T>
                    </p>
                </section>

                {/* 8. Cambios */}
                <section className="bg-white rounded-card p-5 shadow-hard-sm">
                    <h2 className="font-heading text-sm uppercase tracking-widest mb-3 flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-fiesta-purple" />
                        <T>8. Cambios al aviso</T>
                    </h2>
                    <p className="text-sm font-body text-gray-600 leading-relaxed">
                        <T>Nos reservamos el derecho de actualizar este aviso de privacidad. Cualquier cambio será publicado en esta página con la fecha de actualización correspondiente.</T>
                    </p>
                </section>

                {/* Contacto */}
                <section className="bg-fiesta-ink rounded-card p-5 shadow-hard">
                    <h2 className="font-heading text-sm uppercase tracking-widest mb-3 flex items-center gap-2 text-fiesta-yellow">
                        <span className="w-3 h-3 rounded-full bg-fiesta-yellow" />
                        <T>Contacto</T>
                    </h2>
                    <p className="text-sm font-body text-gray-300 leading-relaxed">
                        <T>Para cualquier duda sobre este aviso de privacidad o el tratamiento de tus datos, contáctanos:</T>
                    </p>
                    <a href="mailto:diazriveram05@gmail.com"
                        className="inline-block mt-2 text-sm font-heading text-fiesta-yellow hover:text-white transition-colors">
                        diazriveram05@gmail.com
                    </a>
                    <p className="text-xs text-gray-500 font-body mt-2">
                        Guanajuato, México
                    </p>
                </section>

                {/* Link a términos */}
                <div className="text-center pt-2">
                    <Link href="/terminos" className="text-sm font-body text-mexican-pink hover:underline">
                        <T>Ver Términos y Condiciones</T> →
                    </Link>
                </div>
            </motion.div>
        </main>
    );
}
