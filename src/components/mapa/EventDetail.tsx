/**
 * 📋 EventDetail — Bottom sheet de detalle de evento
 *
 * Tarjeta deslizable desde abajo que muestra info del evento:
 * - Badge "EN VIVO" si aplica
 * - Nombre del evento y horario
 * - Descripción del desfile
 * - Botones "Ver Ruta" y compartir
 * - Animación slide-up con Framer Motion
 */

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Navigation, Share2, Calendar, X } from "lucide-react";

interface EventDetailProps {
    event: {
        id: string;
        nombre: string;
        descripcion: string;
        fechaHora: string;
        enVivo: boolean;
        imagenUrl?: string;
    } | null;
    onClose: () => void;
}

export default function EventDetail({ event, onClose }: EventDetailProps) {
    return (
        <AnimatePresence>
            {event && (
                <motion.div
                    key={event.id}
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: "100%", opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed bottom-20 left-3 right-3 z-30 bg-paper-white rounded-card 
                     shadow-hard-lg overflow-hidden"
                >
                    {/* Botón cerrar */}
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-gray-100 
                       flex items-center justify-center text-gray-500 
                       hover:bg-gray-200 transition-colors z-10"
                    >
                        <X size={16} />
                    </button>

                    <div className="p-5">
                        {/* Badge EN VIVO + imagen thumbnail */}
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                {event.enVivo && (
                                    <span className="badge-live mb-2">En Vivo</span>
                                )}
                                <h3 className="font-heading text-lg mt-1">{event.nombre}</h3>
                                <p className="flex items-center gap-1.5 text-xs text-gray-500 font-body mt-1">
                                    <Calendar size={12} />
                                    {event.fechaHora}
                                </p>
                            </div>
                            {event.imagenUrl && (
                                <img
                                    src={event.imagenUrl}
                                    alt={event.nombre}
                                    className="w-16 h-16 rounded-lg object-cover shadow-hard-sm flex-shrink-0"
                                />
                            )}
                        </div>

                        {/* Descripción */}
                        <p className="text-sm text-gray-600 font-body leading-relaxed mb-4">
                            <span className="font-semibold text-mexican-pink">
                                {event.nombre}:
                            </span>{" "}
                            {event.descripcion}
                        </p>

                        {/* Botones de acción */}
                        <div className="flex gap-3">
                            <button className="btn-primary flex-1">
                                <Navigation size={16} />
                                Ver Ruta
                            </button>
                            <button className="w-12 h-12 rounded-full border-2 border-gray-300 
                                 flex items-center justify-center text-gray-500
                                 hover:border-fiesta-ink hover:text-fiesta-ink transition-colors">
                                <Share2 size={18} />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
