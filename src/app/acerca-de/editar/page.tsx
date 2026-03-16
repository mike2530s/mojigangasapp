"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Plus, Trash2, Settings } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { 
    getAcercaDe, updateAcercaDe, getPatrocinadores,
    upsertPatrocinador, deletePatrocinador,
    type AcercaDeInfo, type Patrocinador
} from "@/lib/supabase/acerca-de";
import { toast } from "sonner";

export default function EditarAcercaDePage() {
    const router = useRouter();
    const { isAdmin, user } = useAuth();
    
    // Auth Check
    useEffect(() => {
        if (!isAdmin && user) {
            router.replace("/acerca-de");
        }
    }, [isAdmin, user, router]);

    // Data State
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    // AcercaDe Form State
    const [acercaId, setAcercaId] = useState("");
    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");

    // Patrocinadores State
    const [patrocinadores, setPatrocinadores] = useState<Patrocinador[]>([]);
    const [newNomPatro, setNewNomPatro] = useState("");
    const [newRolPatro, setNewRolPatro] = useState("");

    useEffect(() => {
        async function load() {
            try {
                const acerca = await getAcercaDe();
                setAcercaId(acerca.id);
                setTitulo(acerca.titulo);
                setDescripcion(acerca.descripcion);

                const patrocs = await getPatrocinadores();
                setPatrocinadores(patrocs);
            } catch (err) {
                console.error("Error loading panel:", err);
            } finally {
                setLoading(false);
            }
        }
        if (isAdmin) load();
    }, [isAdmin]);

    // HANDLERS
    const handleSaveAcercaDe = async () => {
        if (!acercaId) return;
        setSaving(true);
        try {
            await updateAcercaDe(acercaId, { titulo, descripcion });
            await new Promise(r => setTimeout(r, 500));
            toast.success("Textos guardados exitosamente.");
        } catch (error) {
            console.error(error);
            toast.error("Error al guardar textos.");
        } finally {
            setSaving(false);
        }
    };

    const handleAddPatrocinador = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newNomPatro.trim() || !newRolPatro.trim()) return;
        setSaving(true);
        try {
            await upsertPatrocinador({ 
                nombre: newNomPatro, 
                rol: newRolPatro,
                orden: patrocinadores.length + 1
            });
            const refreshed = await getPatrocinadores();
            setPatrocinadores(refreshed);
            setNewNomPatro("");
            setNewRolPatro("");
            toast.success("Patrocinador agregado.");
        } catch(err) {
            console.error(err);
            toast.error("Error al agregar patrocinador.");
        } finally {
             setSaving(false);
        }
    };

    const handleDeletePatrocinador = async (id: string) => {
        if(!confirm("¿Borrar patrocinador?")) return;
        setSaving(true);
        try {
            await deletePatrocinador(id);
            setPatrocinadores(prev => prev.filter(p => p.id !== id));
            toast.success("Patrocinador eliminado.");
        } catch(err) {
            console.error(err);
            toast.error("Error al eliminar patrocinador.");
        } finally {
            setSaving(false);
        }
    };


    if (!isAdmin) return null; // Wait for redirect
    if (loading) return <div className="p-10 text-center animate-pulse">Cargando panel...</div>;

    return (
        <main className="min-h-screen bg-gray-50 pb-24 font-body">
            {/* Cabecera */}
            <div className="bg-fiesta-ink text-white pt-12 pb-8 px-6 sticky top-0 z-10 
                            shadow-md border-b-4 border-mexican-pink">
                <div className="max-w-2xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => router.back()} className="p-2 bg-white/10 rounded-full hover:bg-white/20">
                            <ArrowLeft size={18} />
                        </button>
                        <div>
                            <h1 className="font-heading text-xl flex items-center gap-2">
                                <Settings size={20} className="text-fiesta-yellow" />
                                Panel de Cultura
                            </h1>
                            <p className="text-xs text-gray-400">Edición exclusiva para administradores</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-5 pt-8 space-y-10">

                {/* --- SECCIÓN 1: TEXTOS PRINCIPALES --- */}
                <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="font-heading text-lg text-fiesta-ink mb-4 border-b pb-2">1. Textos Principales</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Título Principal</label>
                            <input 
                                value={titulo}
                                onChange={e => setTitulo(e.target.value)}
                                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:border-mexican-pink outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Descripción Larga</label>
                            <textarea 
                                value={descripcion}
                                onChange={e => setDescripcion(e.target.value)}
                                rows={4}
                                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:border-mexican-pink outline-none"
                            />
                        </div>
                        <div className="flex justify-end">
                            <button 
                                onClick={handleSaveAcercaDe}
                                disabled={saving}
                                className="bg-fiesta-ink text-white px-6 py-2 rounded-xl text-sm font-heading flex items-center gap-2 hover:bg-black disabled:opacity-50"
                            >
                                <Save size={16}/> {saving ? "Guardando..." : "Guardar Textos"}
                            </button>
                        </div>
                    </div>
                </section>

                {/* --- SECCIÓN 2: PATROCINADORES --- */}
                <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="font-heading text-lg text-fiesta-ink mb-4 border-b pb-2 flex items-center justify-between">
                        2. Patrocinadores
                        <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-full">{patrocinadores.length}</span>
                    </h2>

                    {/* Lista */}
                    <div className="space-y-2 mb-6">
                        {patrocinadores.map(p => (
                            <div key={p.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 gap-3">
                                <div>
                                    <p className="font-heading text-sm text-fiesta-ink">{p.nombre}</p>
                                    <p className="text-xs text-gray-500">{p.rol}</p>
                                </div>
                                <button 
                                    onClick={() => handleDeletePatrocinador(p.id)}
                                    disabled={saving}
                                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors self-end sm:self-auto"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                        {patrocinadores.length === 0 && (
                            <p className="text-sm text-gray-400 italic">No hay patrocinadores registrados.</p>
                        )}
                    </div>

                    {/* Agregar Nuevo */}
                    <form onSubmit={handleAddPatrocinador} className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                        <h3 className="text-xs font-semibold text-blue-800 uppercase tracking-widest mb-3">Añadir Nuevo Patrocinador</h3>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <input 
                                placeholder="Nombre (Ej. La Hacienda)" 
                                value={newNomPatro} onChange={e => setNewNomPatro(e.target.value)}
                                className="flex-1 text-sm border-gray-200 rounded-lg p-2.5 outline-none focus:border-blue-400"
                            />
                            <input 
                                placeholder="Rol (Ej. Sede)" 
                                value={newRolPatro} onChange={e => setNewRolPatro(e.target.value)}
                                className="flex-1 text-sm border-gray-200 rounded-lg p-2.5 outline-none focus:border-blue-400"
                            />
                            <button type="submit" disabled={saving || !newNomPatro || !newRolPatro}
                                    className="bg-blue-600 text-white p-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center">
                                <Plus size={18} />
                            </button>
                        </div>
                    </form>
                </section>

                <div className="text-center pb-10">
                    <p className="text-xs text-gray-400">
                        La edición de colaboraciones especiales (fotos) se gestionará en el futuro. Por ahora puedes editar los textos principales y patrocinadores.
                    </p>
                </div>

            </div>
        </main>
    );
}
