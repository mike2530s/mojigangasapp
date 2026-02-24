/**
 * 🗺️ Mapa Page — Desfiles y eventos en vivo
 *
 * Pantalla con mapa Leaflet conectada a Supabase:
 * - Mapa interactivo centrado en San Miguel de Allende
 * - Marcadores para cada desfile/evento (datos de Supabase)
 * - Bottom sheet con detalle al tocar un marcador
 *
 * Usa useDesfiles hook con fallback offline.
 */

"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import EventDetail from "@/components/mapa/EventDetail";
import type { MapEvent } from "@/components/mapa/MapView";
import { useDesfiles } from "@/hooks/useDesfiles";

/* ── Carga dinámica del mapa (Leaflet no soporta SSR) ── */
const MapView = dynamic(() => import("@/components/mapa/MapView"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
            <span className="text-gray-400 font-body text-sm">Cargando mapa...</span>
        </div>
    ),
});

export default function MapaPage() {
    const { desfiles } = useDesfiles();
    const [selectedId, setSelectedId] = useState<string | null>(null);

    /* Transforma datos de Supabase al formato de MapView */
    const mapEvents: MapEvent[] = desfiles.map((d) => ({
        id: d.id,
        nombre: d.evento_nombre,
        latitud: d.latitud,
        longitud: d.longitud,
        enVivo: d.en_vivo,
    }));

    /* Busca el evento seleccionado y extrae campos para EventDetail */
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

    return (
        <main className="fixed inset-0 flex flex-col bg-paper-white">
            <div className="flex-1 relative">
                <MapView
                    events={mapEvents}
                    selectedId={selectedId}
                    onMarkerClick={(id) => setSelectedId(id)}
                />
            </div>
            <EventDetail
                event={selectedEvent}
                onClose={() => setSelectedId(null)}
            />
        </main>
    );
}
