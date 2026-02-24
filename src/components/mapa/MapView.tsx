/**
 * 🗺️ MapView — Mapa interactivo con Leaflet
 *
 * Renderiza un mapa de OpenStreetMap centrado en San Miguel
 * de Allende con marcadores para desfiles/eventos de mojigangas.
 * - Usa react-leaflet con tiles de OpenStreetMap
 * - Marcadores custom con popup de nombre
 * - Al hacer click en un marcador, notifica al padre
 * - Se carga dinámicamente (client-only) para evitar SSR
 */

"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* ── Fix para los íconos de Leaflet en webpack ─────────── */
const markerIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

/* ── Marcador activo (rosa mexicano) ──────────────────── */
const activeIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

export interface MapEvent {
    id: string;
    nombre: string;
    latitud: number;
    longitud: number;
    enVivo?: boolean;
}

interface MapViewProps {
    events: MapEvent[];
    selectedId?: string | null;
    onMarkerClick?: (id: string) => void;
    center?: [number, number];
    zoom?: number;
}

export default function MapView({
    events,
    selectedId,
    onMarkerClick,
    center = [20.9144, -100.7452], // San Miguel de Allende
    zoom = 14,
}: MapViewProps) {
    const [mounted, setMounted] = useState(false);

    /* Evita errores de SSR: Leaflet necesita window */
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center rounded-card">
                <span className="text-gray-400 font-body text-sm">Cargando mapa...</span>
            </div>
        );
    }

    return (
        <MapContainer
            center={center}
            zoom={zoom}
            className="w-full h-full rounded-card z-0"
            style={{ minHeight: "100%" }}
            zoomControl={false}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org">OSM</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {events.map((event) => (
                <Marker
                    key={event.id}
                    position={[event.latitud, event.longitud]}
                    icon={event.id === selectedId ? activeIcon : markerIcon}
                    eventHandlers={{
                        click: () => onMarkerClick?.(event.id),
                    }}
                >
                    <Popup>
                        <span className="font-body font-semibold text-sm">{event.nombre}</span>
                        {event.enVivo && (
                            <span className="ml-2 text-xs text-red-500 font-bold">● EN VIVO</span>
                        )}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
