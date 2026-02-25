/**
 * 🗺️ Mapa Page — Recorrido de mojigangas + eventos en vivo
 *
 * - Muestra ruta del recorrido (línea punteada + pines numerados)
 * - Admin puede agregar / eliminar puntos tocando el mapa
 * - También muestra marcadores de desfiles/eventos de Supabase
 */

"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import EventDetail from "@/components/mapa/EventDetail";
import type { MapEvent } from "@/components/mapa/MapView";
import { useDesfiles } from "@/hooks/useDesfiles";
import { usePuntosRuta } from "@/hooks/usePuntosRuta";
import { useAuth } from "@/lib/auth/AuthContext";
import T from "@/lib/i18n/T";
import { MapPin, Route, Edit3 } from "lucide-react";

/* ── Carga dinámica (Leaflet no soporta SSR) ── */
const RouteMapView = dynamic(() => import("@/components/mapa/RouteMapView"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
            <span className="text-gray-400 font-body text-sm">Cargando mapa...</span>
        </div>
    ),
});

export default function MapaPage() {
    const { desfiles } = useDesfiles();
    const { puntos, addPunto, removePunto } = usePuntosRuta();
    const { isAdmin } = useAuth();

    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [adminMode, setAdminMode] = useState(false);

    /* Transforma desfiles al formato de marcadores */
    const mapEvents: MapEvent[] = desfiles.map((d) => ({
        id: d.id,
        nombre: d.evento_nombre,
        latitud: d.latitud,
        longitud: d.longitud,
        enVivo: d.en_vivo,
    }));

    const found = desfiles.find((d) => d.id === selectedId);
    const selectedEvent = found
        ? {
            id: found.id,
            nombre: found.evento_nombre,
            descripcion: found.descripcion,
            fechaHora: new Date(found.fecha_hora).toLocaleString("es-MX", {
                weekday: "long",
                hour: "2-digit",
                minute: "2-digit",
            }),
            enVivo: found.en_vivo,
        }
        : null;

    const handleAddPunto = async (lat: number, lng: number, nombre: string) => {
        await addPunto({
            nombre,
            descripcion: null,
            latitud: lat,
            longitud: lng,
            orden: puntos.length + 1,
        });
    };

    return (
        <main className="fixed inset-0 flex flex-col bg-paper-white">
            {/* Top info bar */}
            <div className="absolute top-3 left-3 right-3 z-[400] flex items-center justify-between pointer-events-none">
                {/* Route counter chip */}
                <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm
                                shadow-hard-sm rounded-full px-3 py-1.5 text-xs font-heading pointer-events-auto">
                    <Route size={13} className="text-mexican-pink" />
                    <T>Recorrido</T>
                    <span className="bg-mexican-pink text-white rounded-full px-1.5 py-0.5 text-[10px]">
                        {puntos.length}
                    </span>
                </div>

                {/* Admin toggle */}
                {isAdmin && (
                    <button
                        onClick={() => setAdminMode(!adminMode)}
                        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-heading
                                    shadow-hard-sm pointer-events-auto transition-colors
                                    ${adminMode
                                ? "bg-mexican-pink text-white"
                                : "bg-white/90 backdrop-blur-sm text-fiesta-ink"
                            }`}
                    >
                        <Edit3 size={13} />
                        {adminMode ? <T>Editando</T> : <T>Editar ruta</T>}
                    </button>
                )}
            </div>

            {/* Map */}
            <div className="flex-1 relative">
                <RouteMapView
                    puntos={puntos}
                    isAdmin={adminMode}
                    onAddPunto={handleAddPunto}
                    onDeletePunto={removePunto}
                />
            </div>

            {/* Event bottom sheet */}
            <EventDetail
                event={selectedEvent}
                onClose={() => setSelectedId(null)}
            />
        </main>
    );
}

