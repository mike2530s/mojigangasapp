"use client";

import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Taller/Artesano type
export interface TallerMap {
    id: string;
    nombre: string;
    descripcion?: string;
    latitud: number;
    longitud: number;
}

// PuntoRuta type
export interface PuntoRutaMap {
    id: string;
    nombre: string;
    latitud: number;
    longitud: number;
    orden: number;
}

interface MapaInteractivoProps {
    talleres: TallerMap[];
    ruta: PuntoRutaMap[];
}

// Solución al problema de los iconos de Leaflet en Next.js
const customIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

// Icono vibrante (Cyan/Rosa)
const tallerIcon = new L.DivIcon({
    className: "bg-transparent",
    html: `<div class="w-6 h-6 bg-fiesta-cyan rounded-full border-2 border-white shadow-lg flex items-center justify-center"><div class="w-2 h-2 bg-white rounded-full"></div></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
});

const routeNodeIcon = new L.DivIcon({
    className: "bg-transparent",
    html: `<div class="w-4 h-4 bg-mexican-pink rounded-full border-2 border-white shadow-md"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -8],
});

export default function MapaInteractivo({ talleres, ruta }: MapaInteractivoProps) {
    const defaultCenter: [number, number] = [20.9144, -100.7452]; // San Miguel
    const center = ruta.length > 0 ? [ruta[0].latitud, ruta[0].longitud] : talleres.length > 0 ? [talleres[0].latitud, talleres[0].longitud] : defaultCenter;

    // Coordenadas para la polyline
    const polylinePositions = ruta.sort((a, b) => a.orden - b.orden).map(p => [p.latitud, p.longitud] as [number, number]);

    return (
        <MapContainer center={center as [number, number]} zoom={14} className="w-full h-full min-h-[400px] z-0 rounded-xl shadow-hard-lg">
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Polyline del recorrido (Rosa Mexicano) */}
            {polylinePositions.length > 1 && (
                <Polyline positions={polylinePositions} pathOptions={{ color: "#E01A59", weight: 5, opacity: 0.8, dashArray: "10, 10" }} />
            )}

            {/* Marcadores de la ruta */}
            {ruta.map((punto) => (
                <Marker key={punto.id} position={[punto.latitud, punto.longitud]} icon={routeNodeIcon}>
                    <Popup>
                        <div className="text-center font-body min-w-[100px]">
                            <h3 className="font-heading text-mexican-pink text-sm">{punto.nombre}</h3>
                            <p className="text-xs text-gray-500">Parada #{punto.orden}</p>
                        </div>
                    </Popup>
                </Marker>
            ))}

            {/* Marcadores de los talleres (Cyan) */}
            {talleres.map((taller) => (
                <Marker key={taller.id} position={[taller.latitud, taller.longitud]} icon={tallerIcon}>
                    <Popup>
                        <div className="font-body min-w-[120px]">
                            <h3 className="font-heading text-fiesta-cyan text-sm">{taller.nombre}</h3>
                            {taller.descripcion && <p className="text-xs text-gray-600 mt-1">{taller.descripcion}</p>}
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
