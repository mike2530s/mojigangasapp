"use client";

import dynamic from "next/dynamic";
import { type TallerMap, type PuntoRutaMap } from "./MapaInteractivo";
import { MapPin } from "lucide-react";

// Importación dinámica con ssr: false
const MapaInteractivoDinamico = dynamic(
    () => import("./MapaInteractivo"),
    { 
        ssr: false,
        loading: () => (
            <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 animate-pulse">
                <MapPin className="text-mexican-pink mb-2 animate-bounce" size={32} />
                <p className="font-heading text-sm uppercase tracking-widest text-gray-400">Cargando mapa...</p>
            </div>
        )
    }
);

interface MapaProps {
    talleres: TallerMap[];
    ruta: PuntoRutaMap[];
}

export default function Mapa({ talleres, ruta }: MapaProps) {
    return (
        <div className="w-full aspect-square md:aspect-video rounded-xl overflow-hidden shadow-hard-lg border-4 border-white">
            <MapaInteractivoDinamico talleres={talleres} ruta={ruta} />
        </div>
    );
}
