/**
 * RouteMapView — Mapa con recorrido y editor admin
 *
 * - Muestra la ruta como línea rosa conectando todos los puntos
 * - Marcadores numerados para cada punto del recorrido
 * - Modo admin: clic en el mapa → abre mini-formulario para nombrar y guardar el punto
 * - Admin puede eliminar puntos con el botón × en el popup
 *
 * Se carga dinámicamente (no SSR) porque Leaflet requiere window.
 */

"use client";

import { useEffect, useState, useCallback } from "react";
import {
    MapContainer, TileLayer, Marker, Popup,
    Polyline, useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { PuntoRuta } from "@/lib/supabase/puntosRuta";

/* ── Icono numerado coloreado ─────────────────────────── */
function makeNumberedIcon(n: number, color = "#FF005C") {
    return L.divIcon({
        className: "",
        html: `<div style="
            width:28px;height:28px;border-radius:50% 50% 50% 0;
            background:${color};transform:rotate(-45deg);
            display:flex;align-items:center;justify-content:center;
            box-shadow:0 2px 6px rgba(0,0,0,0.3);
        "><span style="transform:rotate(45deg);color:#fff;font-weight:700;font-size:11px">${n}</span></div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        popupAnchor: [0, -30],
    });
}

/* ── ClickHandler: registra clic admin ─────────────────── */
function ClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
    useMapEvents({
        click(e) {
            onMapClick(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
}

/* ── Props ─────────────────────────────────────────────── */
export interface RouteMapViewProps {
    puntos: PuntoRuta[];
    isAdmin: boolean;
    onAddPunto: (lat: number, lng: number, nombre: string) => Promise<void>;
    onDeletePunto: (id: string) => Promise<void>;
    onBackgroundClick?: () => void;
    center?: [number, number];
    zoom?: number;
}

/* ── Component ─────────────────────────────────────────── */
export default function RouteMapView({
    puntos,
    isAdmin,
    onAddPunto,
    onDeletePunto,
    onBackgroundClick,
    center = [20.9144, -100.7452],
    zoom = 15,
}: RouteMapViewProps) {
    const [mounted, setMounted] = useState(false);
    /* Pending click coords while admin names the punto */
    const [pendingLatLng, setPendingLatLng] = useState<[number, number] | null>(null);
    const [pendingName, setPendingName] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => setMounted(true), []);

    const handleMapClick = useCallback(
        (lat: number, lng: number) => {
            if (isAdmin) {
                setPendingLatLng([lat, lng]);
                setPendingName("");
            } else {
                onBackgroundClick?.();
            }
        },
        [isAdmin, onBackgroundClick]
    );

    const handleSave = async () => {
        if (!pendingLatLng || !pendingName.trim()) return;
        setSaving(true);
        try {
            await onAddPunto(pendingLatLng[0], pendingLatLng[1], pendingName.trim());
            setPendingLatLng(null);
        } finally {
            setSaving(false);
        }
    };

    if (!mounted) {
        return (
            <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
                <span className="text-gray-400 font-body text-sm">Cargando mapa...</span>
            </div>
        );
    }

    /* Polyline coords */
    const routeCoords = puntos.map((p) => [p.latitud, p.longitud] as [number, number]);

    return (
        <div className="relative w-full h-full">

            <MapContainer
                center={center}
                zoom={zoom}
                className="w-full h-full z-0"
                style={{ minHeight: "100%" }}
                zoomControl={false}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org">OSM</a>'
                />

                {/* Click handler for adding points or dismissing cards */}
                <ClickHandler onMapClick={handleMapClick} />

                {/* Route polyline */}
                {routeCoords.length > 1 && (
                    <Polyline
                        positions={routeCoords}
                        pathOptions={{ color: "#FF005C", weight: 4, opacity: 0.8, dashArray: "8 6" }}
                    />
                )}

                {/* Route point markers */}
                {puntos.map((p, i) => (
                    <Marker
                        key={p.id}
                        position={[p.latitud, p.longitud]}
                        icon={makeNumberedIcon(i + 1)}
                    >
                        <Popup>
                            <div className="min-w-[140px]">
                                <p className="font-semibold text-sm mb-0.5">
                                    {i + 1}. {p.nombre}
                                </p>
                                {p.descripcion && (
                                    <p className="text-xs text-gray-500">{p.descripcion}</p>
                                )}
                                {isAdmin && (
                                    <button
                                        onClick={() => onDeletePunto(p.id)}
                                        className="mt-2 text-xs text-red-500 hover:underline"
                                    >
                                        🗑 Eliminar punto
                                    </button>
                                )}
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {/* Pending marker (admin preview) */}
                {pendingLatLng && (
                    <Marker
                        position={pendingLatLng}
                        icon={makeNumberedIcon(puntos.length + 1, "#7C3AED")}
                    />
                )}
            </MapContainer>

            {/* ── Admin form overlay ── */}
            {isAdmin && pendingLatLng && (
                <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-[600]
                                w-11/12 max-w-sm bg-white rounded-2xl shadow-2xl p-4 border border-gray-100 flex flex-col box-border">
                    <p className="font-heading text-xs uppercase tracking-wider text-gray-500 mb-2">
                        Nombre del punto
                    </p>
                    <input
                        type="text"
                        value={pendingName}
                        onChange={(e) => setPendingName(e.target.value)}
                        placeholder="ej. Plaza Principal"
                        autoFocus
                        onKeyDown={(e) => e.key === "Enter" && handleSave()}
                        className="w-full min-w-0 text-sm border border-gray-200 rounded-xl px-3 py-2
                                   outline-none focus:border-mexican-pink mb-3"
                    />
                    <div className="flex gap-2 w-full shrink-0">
                        <button
                            onClick={() => setPendingLatLng(null)}
                            className="flex-1 min-w-0 text-sm font-body text-gray-500 bg-gray-100
                                       rounded-xl px-2 py-2 hover:bg-gray-200 transition-colors shrink-0"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={!pendingName.trim() || saving}
                            className="flex-1 min-w-0 text-sm font-heading text-white bg-mexican-pink
                                       rounded-xl px-2 py-2 disabled:opacity-50 transition-opacity shrink-0"
                        >
                            {saving ? "Guardando..." : "Guardar"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
