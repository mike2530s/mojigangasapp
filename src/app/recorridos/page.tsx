import { supabase } from "@/lib/supabase/client";
import Mapa from "@/components/map/Mapa";
import { Map, Calendar } from "lucide-react";

// Forzamos el renderizado dinámico para traer datos reales de Supabase en cada carga
export const dynamic = "force-dynamic";

export default async function RecorridosPage() {
    // 1. Obtener talleres/artesanos (se asume que la tabla es 'artesanos' o perfiles relacionados)
    const { data: artesanosData, error: artesanosError } = await supabase
        .from("artesanos")
        .select("id, nombre, descripcion");

    // 2. Obtener puntos_ruta
    const { data: rutaData, error: rutaError } = await supabase
        .from("puntos_ruta")
        .select("id, nombre, latitud, longitud, orden")
        .order("orden", { ascending: true });

    if (rutaError) {
        console.error("Error al obtener ruta:", rutaError);
    }

    // Adaptamos los artesanos a nuestra interfaz de Taller (si no tienen coordenadas, les asignamos un fallback local cerca del centro)
    const talleres = (artesanosData || []).map((a) => ({
        id: a.id,
        nombre: a.nombre,
        descripcion: a.descripcion || "Taller tradicional artesanal",
        // Fallback coord near San Miguel if not directly stored in DB currently:
        latitud: 20.9150 + (Math.random() * 0.01 - 0.005), 
        longitud: -100.7450 + (Math.random() * 0.01 - 0.005),
    }));

    const ruta = rutaData || [];

    return (
        <main className="min-h-screen bg-paper-white pb-20 pt-8 px-4 md:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-fiesta-cyan text-white shadow-hard-sm mb-4">
                        <Map size={32} />
                    </div>
                    <h1 className="text-3xl font-heading text-fiesta-ink mb-2">Recorrido Oficial</h1>
                    <p className="text-gray-600 font-body max-w-xl mx-auto">
                        Acompaña la tradición paso a paso. Sigue la ruta de las mojigangas y descubre los talleres donde la magia cobra vida.
                    </p>
                </div>

                {/* Map Container */}
                <div className="mb-10 relative">
                    {/* Decoración vibrante */}
                    <div className="absolute -inset-2 bg-gradient-to-r from-mexican-pink to-fiesta-cyan rounded-2xl opacity-20 blur-xl"></div>
                    <div className="relative">
                        <Mapa talleres={talleres} ruta={ruta} />
                    </div>
                </div>

                {/* Status & Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl p-6 shadow-hard-sm border-l-4 border-mexican-pink">
                        <h2 className="font-heading text-lg text-fiesta-ink mb-4">La Ruta</h2>
                        <ul className="space-y-3 font-body text-sm text-gray-600">
                            {ruta.map((p) => (
                                <li key={p.id} className="flex gap-3 items-center">
                                    <span className="w-6 h-6 rounded-full bg-mexican-pink/10 text-mexican-pink flex items-center justify-center font-bold text-xs shrink-0">
                                        {p.orden}
                                    </span>
                                    <span>{p.nombre}</span>
                                </li>
                            ))}
                            {ruta.length === 0 && <li className="text-gray-400">Sin ruta programada actualmente.</li>}
                        </ul>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-hard-sm border-l-4 border-fiesta-cyan">
                        <h2 className="font-heading text-lg text-fiesta-ink mb-4">Talleres Participantes</h2>
                        <ul className="space-y-4 font-body text-sm text-gray-600">
                            {talleres.map((t) => (
                                <li key={t.id} className="flex gap-3 items-start">
                                    <span className="w-2 h-2 rounded-full bg-fiesta-cyan mt-1.5 shrink-0"></span>
                                    <span className="flex-1">
                                        <strong className="block text-fiesta-ink text-base mb-0.5">{t.nombre}</strong>
                                        <span className="text-xs text-gray-500 leading-relaxed block">{t.descripcion}</span>
                                    </span>
                                </li>
                            ))}
                            {talleres.length === 0 && <li className="text-gray-400">Sin talleres registrados.</li>}
                        </ul>
                    </div>
                </div>
            </div>
        </main>
    );
}
