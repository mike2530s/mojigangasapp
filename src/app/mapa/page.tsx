/**
 * 🗺️ Mapa Page — Recorrido de mojigangas + eventos en vivo
 *
 * - Muestra ruta del recorrido (línea punteada + pines numerados)
 * - Admin puede agregar / eliminar puntos tocando el mapa
 * - También muestra marcadores de desfiles/eventos de Supabase
 */

"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import EventDetail from "@/components/mapa/EventDetail";
import type { MapEvent } from "@/components/mapa/MapView";
import { useDesfiles } from "@/hooks/useDesfiles";
import { usePuntosRuta } from "@/hooks/usePuntosRuta";
import { useRecorridos } from "@/hooks/useRecorridos";
import { useAuth } from "@/lib/auth/AuthContext";
import T from "@/lib/i18n/T";
import { Route, Edit3, Plus, X, Calendar, MapPin, Info, Clock } from "lucide-react";
import DateTimePicker from "@/components/ui/DateTimePicker";

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
    const { desfiles, error: desfilesError } = useDesfiles();
    const { puntos, addPunto, removePunto } = usePuntosRuta();
    const { recorridos, addRecorrido } = useRecorridos();
    const { isAdmin } = useAuth();

    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [adminMode, setAdminMode] = useState(false);
    
    // Recorridos State
    const [selectedRecorridoId, setSelectedRecorridoId] = useState<string | null>(null);
    const [showNewRouteModal, setShowNewRouteModal] = useState(false);
    
    // Form state for new Route
    const [newRoute, setNewRoute] = useState({ nombre: "", motivo: "", origen: "", destino: "", fecha_hora: "", duracion: "" });
    const [isCreating, setIsCreating] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);

    // Filter points by the selected Recorrido (if there are none, show fallback points for backwards compatibility)
    const activeRoutePuntos = puntos.filter(p => p.recorrido_id === selectedRecorridoId || (!p.recorrido_id && !selectedRecorridoId));
    const activeRecorrido = recorridos.find(r => r.id === selectedRecorridoId);

    // Auto-select the first route when loaded
    useEffect(() => {
        if (recorridos.length > 0 && !selectedRecorridoId) {
            setSelectedRecorridoId(recorridos[0].id);
        }
    }, [recorridos, selectedRecorridoId]);

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
            orden: activeRoutePuntos.length + 1,
            recorrido_id: selectedRecorridoId,
        });
    };

    const handleCreateRoute = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreating(true);
        try {
            const created = await addRecorrido({
                ...newRoute,
                fecha_hora: newRoute.fecha_hora 
            });
            setSelectedRecorridoId(created.id);
            setShowNewRouteModal(false);
            setNewRoute({ nombre: "", motivo: "", origen: "", destino: "", fecha_hora: "", duracion: "" });
        } catch (error) {
            console.error(error);
            alert("Error al crear recorrido");
        } finally {
            setIsCreating(false);
        }
    };

    const handleDateSelect = (fecha: Date, duracion: string) => {
        setNewRoute(prev => ({
            ...prev,
            fecha_hora: fecha.toISOString(),
            duracion
        }));
        setShowDatePicker(false);
    };

    return (
        <main className="fixed inset-0 flex flex-col bg-paper-white">
            {/* Error */}
            {desfilesError && (
                <div className="mx-3 mt-2 p-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600 font-body z-10">
                    <T>No se pudieron cargar los eventos. Mostrando datos guardados.</T>
                </div>
            )}
            {/* Top info bar */}
            <div className="absolute top-3 left-3 right-3 z-[400] flex items-start justify-between pointer-events-none gap-2">
                <div className="flex flex-col gap-2 pointer-events-auto max-w-[65%]">
                    {/* Route selector / counter chip */}
                    <div className="flex bg-white/90 backdrop-blur-sm shadow-hard-sm rounded-xl overflow-hidden pointer-events-auto">
                        <select
                            value={selectedRecorridoId || ""}
                            onChange={(e) => setSelectedRecorridoId(e.target.value)}
                            className="bg-transparent text-xs font-heading font-medium text-fiesta-ink pl-3 pr-8 py-2 outline-none appearance-none cursor-pointer truncate max-w-[200px]"
                            style={{ backgroundPosition: "calc(100% - 8px) center", backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`, backgroundRepeat: "no-repeat", backgroundSize: "14px" }}
                        >
                            {recorridos.length === 0 && <option value="">Cargando rutas...</option>}
                            {recorridos.map(r => (
                                <option key={r.id} value={r.id}>{r.nombre}</option>
                            ))}
                        </select>
                        <div className="flex items-center gap-1.5 px-3 py-2 bg-gray-50/50 border-l border-gray-200">
                            <Route size={14} className="text-mexican-pink" />
                            <span className="bg-mexican-pink text-white rounded-full px-1.5 py-0.5 text-[10px] min-w-4 text-center">
                                {activeRoutePuntos.length}
                            </span>
                        </div>
                    </div>

                    {/* Active Route Details Card */}
                    {activeRecorrido && !adminMode && (
                        <div className="bg-white/95 backdrop-blur-md rounded-xl p-3 shadow-hard-sm border border-gray-100/50 animate-in fade-in slide-in-from-top-2">
                            <h3 className="text-xs font-heading text-fiesta-ink mb-2 leading-tight">
                                {activeRecorrido.nombre}
                            </h3>
                            <div className="flex flex-col gap-1.5 text-[10px] font-body text-gray-600">
                                <div className="flex gap-1.5">
                                    <Calendar size={12} className="text-fiesta-cyan shrink-0" />
                                    <span>{new Date(activeRecorrido.fecha_hora).toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                                </div>
                                <div className="flex gap-1.5">
                                    <MapPin size={12} className="text-red-500 shrink-0" />
                                    <span className="truncate">De: {activeRecorrido.origen} <br/>A: {activeRecorrido.destino}</span>
                                </div>
                                <div className="flex gap-1.5 mt-0.5">
                                    <Info size={12} className="text-mexican-pink shrink-0" />
                                    <span className="line-clamp-2 text-gray-500 italic">"{activeRecorrido.motivo}"</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Admin controls */}
                <div className="flex flex-col items-end gap-2">
                    {isAdmin && (
                        <button
                            onClick={() => setAdminMode(!adminMode)}
                            className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-heading
                                        shadow-hard-sm pointer-events-auto transition-colors
                                        ${adminMode
                                    ? "bg-mexican-pink text-white"
                                    : "bg-white/90 backdrop-blur-sm text-fiesta-ink hover:bg-gray-50"
                                }`}
                        >
                            <Edit3 size={14} />
                            {adminMode ? <T>Editando</T> : <T>Editar ruta</T>}
                        </button>
                    )}
                    {isAdmin && adminMode && (
                         <button
                         onClick={() => setShowNewRouteModal(true)}
                         className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-heading bg-fiesta-cyan text-white shadow-hard-sm pointer-events-auto hover:bg-opacity-90 transition-colors"
                     >
                         <Plus size={14} />
                         <T>Nueva</T>
                     </button>
                    )}
                </div>
            </div>

            {/* Map */}
            <div className="flex-1 relative">
                <RouteMapView
                    puntos={activeRoutePuntos}
                    isAdmin={adminMode}
                    onAddPunto={handleAddPunto}
                    onDeletePunto={removePunto}
                    onBackgroundClick={() => setSelectedId(null)}
                />
            </div>

            {/* Event bottom sheet */}
            <EventDetail
                event={selectedEvent}
                onClose={() => setSelectedId(null)}
            />

            {/* New Route Modal (Admin Only) */}
            {showNewRouteModal && (
                <div className="fixed inset-0 z-[600] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-hard-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="font-heading text-lg text-fiesta-ink">Crear Recorrido</h2>
                            <button onClick={() => setShowNewRouteModal(false)} className="text-gray-400 hover:text-fiesta-ink"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleCreateRoute} className="flex flex-col gap-3">
                            <input required placeholder="Nombre del evento" value={newRoute.nombre} onChange={e => setNewRoute({...newRoute, nombre: e.target.value})} className="input-field text-sm" />
                            <input required placeholder="Motivo (ej. Preserva de tradición)" value={newRoute.motivo} onChange={e => setNewRoute({...newRoute, motivo: e.target.value})} className="input-field text-sm" />
                            <div className="grid grid-cols-2 gap-2 w-full">
                                <input required placeholder="Origen (ej. Templo)" value={newRoute.origen} onChange={e => setNewRoute({...newRoute, origen: e.target.value})} className="input-field text-sm w-full min-w-0" />
                                <input required placeholder="Destino" value={newRoute.destino} onChange={e => setNewRoute({...newRoute, destino: e.target.value})} className="input-field text-sm w-full min-w-0" />
                            </div>
                            
                            <button 
                                type="button" 
                                onClick={() => setShowDatePicker(true)}
                                className={`flex items-center gap-2 justify-between w-full input-field text-sm text-left transition ${!newRoute.fecha_hora ? "text-gray-400" : "text-fiesta-ink font-medium"}`}
                            >
                                <span className="flex items-center gap-2 truncate">
                                    <Clock size={16} className={newRoute.fecha_hora ? "text-fiesta-cyan" : "text-gray-400"} />
                                    {newRoute.fecha_hora 
                                        ? `${new Date(newRoute.fecha_hora).toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' })} — ${newRoute.duracion}`
                                        : "Seleccionar fecha y hora"}
                                </span>
                            </button>

                            <button type="submit" disabled={isCreating || !newRoute.fecha_hora} className="btn-primary mt-2 flex justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                                {isCreating ? "Creando..." : "Crear Recorrido"}
                            </button>
                        </form>
                    </div>

                    {showDatePicker && (
                        <div className="fixed inset-0 z-[700] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
                            <DateTimePicker 
                                onConfirm={handleDateSelect}
                                onClose={() => setShowDatePicker(false)} 
                            />
                        </div>
                    )}
                </div>
            )}
        </main>
    );
}

