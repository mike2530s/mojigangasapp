/* eslint-disable @next/next/no-img-element */
/**
 * Editar Mojiganga — Formulario para modificar una obra existente
 */

"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft, ImagePlus, X, Loader2, CheckCircle,
    Palette, Calendar, Tag, FileText, Lock, Menu, Plus
} from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { supabase } from "@/lib/supabase/client";
import { getMojigangaById, updateMojiganga, type Mojiganga } from "@/lib/supabase/mojigangas";
import { uploadMojigangaPhoto, deleteMojigangaPhotos } from "@/lib/supabase/storage";
import T from "@/lib/i18n/T";
import { useText } from "@/lib/i18n/useText";

const CATEGORIAS = [
    "Literario", "Histórico", "Fantástico", "Religioso",
    "Regional", "Político", "Animal", "Otro",
];

const MAX_FOTOS = 8;

interface FotoItem { 
    file?: File; // Si es null o undefined, es una foto ya existente
    preview: string; 
    isExisting: boolean; // Flag to indicate if it's already in Supabase
}

function TagInput({ tags, onChange, placeholder }: { tags: string[]; onChange: (t: string[]) => void; placeholder: string }) {
    const [input, setInput] = useState("");
    const add = () => {
        const v = input.trim();
        if (v && !tags.includes(v)) onChange([...tags, v]);
        setInput("");
    };
    return (
        <div className="space-y-2">
            <div className="flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
                    placeholder={placeholder}
                    className="flex-1 min-w-0 text-sm font-body bg-white border border-gray-200 rounded-xl
                               px-3 py-2.5 outline-none focus:border-mexican-pink transition-colors"
                />
                <button type="button" onClick={add}
                    className="w-10 h-10 bg-fiesta-ink text-white rounded-xl flex items-center justify-center flex-shrink-0">
                    <Plus size={16} />
                </button>
            </div>
            {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {tags.map((t) => (
                        <span key={t}
                            className="flex items-center gap-1.5 bg-fiesta-ink/10 text-fiesta-ink
                                       text-sm font-body leading-relaxed rounded-[20px] px-4 py-2 break-all">
                            {t}
                            <button type="button" onClick={() => onChange(tags.filter((x) => x !== t))}>
                                <X size={10} />
                            </button>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function EditarMojigangaPage() {
    const { user, isArtesano, isAdmin, loading: authLoading } = useAuth();
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    
    const canEdit = isArtesano || isAdmin;

    /* ── Form state ── */
    const [loadingData, setLoadingData] = useState(true);
    const [mojigangaOriginal, setMojigangaOriginal] = useState<Mojiganga | null>(null);

    const [nombre, setNombre] = useState("");
    const [historia, setHistoria] = useState("");
    const [proceso, setProceso] = useState("");
    const [año, setAño] = useState("");
    const [categoria, setCategoria] = useState(CATEGORIAS[0]);
    const [materiales, setMateriales] = useState<string[]>([]);
    
    const [fotos, setFotos] = useState<FotoItem[]>([]);
    const [fotosBorradasUrls, setFotosBorradasUrls] = useState<string[]>([]);

    const [guardando, setGuardando] = useState(false);
    const [guardado, setGuardado] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [progreso, setProgreso] = useState(0);
    const fileRef = useRef<HTMLInputElement>(null);

    const nombrePh = useText("ej. La Catrina Gigante");
    const historiaPh = useText("Cuéntanos la historia e inspiración de esta mojiganga...");
    const procesoPh = useText("Comparte paso a paso cómo fue el proceso de creación...");

    /* ── Load initial data ── */
    useEffect(() => {
        if (!id) return;
        getMojigangaById(id)
            .then((data) => {
                setMojigangaOriginal(data);
                setNombre(data.nombre);
                setHistoria(data.historia || "");
                setProceso(data.proceso || "");
                setAño(data.año.toString());
                setCategoria(data.categoria || CATEGORIAS[0]);
                setMateriales(data.materiales || []);
                
                // Initialize existing photos
                if (data.imagenes_urls && data.imagenes_urls.length > 0) {
                    setFotos(data.imagenes_urls.map(url => ({
                        preview: url,
                        isExisting: true
                    })));
                } else if (data.imagen_url) {
                    setFotos([{ preview: data.imagen_url, isExisting: true }]);
                }
            })
            .catch((err) => {
                setError("Error al cargar la mojiganga: " + err.message);
            })
            .finally(() => setLoadingData(false));
    }, [id]);

    /* ── Auth & Ownership guard ── */
    if (!authLoading && !loadingData && (!canEdit || (mojigangaOriginal && !isAdmin && user?.id !== mojigangaOriginal.artesano_id))) {
        return (
            <main className="page-container flex flex-col items-center justify-center px-8 text-center min-h-screen bg-paper-white">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-5">
                    <Lock size={36} className="text-gray-400" />
                </div>
                <h1 className="font-heading text-2xl mb-2"><T>No tienes permisos</T></h1>
                <p className="text-gray-500 font-body text-sm mb-6 leading-relaxed">
                    <T>Solo el artesano creador de esta obra o un administrador puede editarla.</T>
                </p>
                <button onClick={() => router.back()} className="btn-primary">
                    <T>Regresar</T>
                </button>
            </main>
        );
    }

    if (loadingData || authLoading) {
        return (
            <main className="page-container flex items-center justify-center min-h-screen">
                <Loader2 size={32} className="text-mexican-pink animate-spin" />
            </main>
        );
    }

    /* ── Foto handlers ── */
    const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        const remaining = MAX_FOTOS - fotos.length;
        const toAdd = files.slice(0, remaining);

        toAdd.forEach((file) => {
            if (!file.type.startsWith("image/")) return;
            if (file.size > 15 * 1024 * 1024) {
                setError(`"${file.name}" es mayor a 15 MB.`);
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFotos((prev) => {
                    if (prev.length >= MAX_FOTOS) return prev;
                    return [...prev, { file, preview: reader.result as string, isExisting: false }];
                });
            };
            reader.readAsDataURL(file);
        });
        e.target.value = "";
    };

    const removeFoto = (i: number) => {
        const fotoToRemove = fotos[i];
        if (fotoToRemove.isExisting) {
            // Guardar url para borrarla del bucket si el usuario da click en guardar
            setFotosBorradasUrls(prev => [...prev, fotoToRemove.preview]);
        }
        setFotos((prev) => prev.filter((_, idx) => idx !== i));
    };

    /* ── Submit ── */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (fotos.length === 0) { setError("Necesitas al menos una foto."); return; }
        if (!nombre.trim()) { setError("Escribe el nombre de la mojiganga."); return; }
        if (!historia.trim()) { setError("La historia es obligatoria."); return; }
        if (!proceso.trim()) { setError("El proceso de creación es obligatorio."); return; }
        if (!año.trim() || isNaN(parseInt(año))) { setError("Ingresa un año válido."); return; }
        if (materiales.length === 0) { setError("Agrega al menos un material."); return; }
        if (!mojigangaOriginal) return;

        setGuardando(true);
        setError(null);
        setProgreso(10);

        try {
            // 1. Borrar fotos que el usuario quitó
            if (fotosBorradasUrls.length > 0) {
                await deleteMojigangaPhotos(fotosBorradasUrls);
            }
            setProgreso(30);

            // 2. Subir fotos nuevas (manteniendo el orden final)
            const finalUrls: string[] = [];
            for (let i = 0; i < fotos.length; i++) {
                const foto = fotos[i];
                if (foto.isExisting) {
                    finalUrls.push(foto.preview);
                } else if (foto.file) {
                    const url = await uploadMojigangaPhoto(foto.file, mojigangaOriginal.artesano_id, nombre, i);
                    finalUrls.push(url);
                }
                setProgreso(30 + Math.round(((i + 1) / fotos.length) * 50));
            }

            // 3. Update in table
            await updateMojiganga(id, {
                nombre: nombre.trim(),
                historia: historia.trim(),
                proceso: proceso.trim(),
                año: parseInt(año),
                categoria,
                materiales,
                imagen_url: finalUrls[0], // primary
                imagenes_urls: finalUrls, // all
            });

            setProgreso(100);
            setGuardado(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al guardar. Intenta de nuevo.");
        } finally {
            setGuardando(false);
        }
    };

    /* ── Success screen ── */
    if (guardado) {
        return (
            <main className="page-container flex flex-col items-center justify-center px-8 text-center min-h-screen bg-paper-white">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="mb-6"
                >
                    <CheckCircle size={72} className="text-green-500 mx-auto" />
                </motion.div>
                <h1 className="font-heading text-2xl mb-2"><T>¡Cambios guardados!</T></h1>
                <p className="text-gray-500 font-body text-sm mb-8">
                    <T>La mojiganga ha sido actualizada en el catálogo.</T>
                </p>
                <Link href={`/catalogo/${id}`}
                    className="w-full bg-fiesta-ink text-white font-heading py-3 rounded-2xl max-w-xs text-center">
                    <T>Ver en el catálogo</T>
                </Link>
            </main>
        );
    }

    /* ── Form ── */
    return (
        <main className="page-container bg-paper-white pb-24">
            {/* Header */}
            <header className="flex items-center gap-3 px-5 pt-5 pb-4 border-b border-gray-100 sticky top-0 bg-paper-white z-10">
                <button onClick={() => router.back()} className="p-1.5 rounded-xl hover:bg-gray-100 transition-colors">
                    <ArrowLeft size={20} />
                </button>
                <div className="flex-1">
                    <h1 className="font-heading text-base leading-tight"><T>Editar Mojiganga</T></h1>
                </div>
                <div className="text-xs font-heading text-gray-500">
                    {fotos.length}/{MAX_FOTOS} <T>fotos</T>
                </div>
            </header>

            <form onSubmit={handleSubmit} className="px-5 pt-5 space-y-6">
                {/* ── Galería de fotos ── */}
                <section>
                    <label className="flex items-center gap-2 font-heading text-xs uppercase tracking-wider mb-3">
                        <Palette size={13} className="text-mexican-pink" />
                        <T>Fotos de la mojiganga</T>
                        <span className="text-gray-400 normal-case font-body ml-auto">máx {MAX_FOTOS}</span>
                    </label>

                    <div className="grid grid-cols-3 gap-2">
                        {fotos.map((f, i) => (
                            <div key={i} className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 border-2 border-transparent">
                                <img src={f.preview} alt="" className="w-full h-full object-cover" />
                                <span className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full bg-fiesta-ink
                                                 text-white text-[10px] font-heading flex items-center justify-center">
                                    {i + 1}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => removeFoto(i)}
                                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60
                                               text-white flex items-center justify-center"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        ))}

                        {fotos.length < MAX_FOTOS && (
                            <button
                                type="button"
                                onClick={() => fileRef.current?.click()}
                                className="aspect-square rounded-2xl border-2 border-dashed border-gray-300
                                           flex flex-col items-center justify-center gap-1
                                           hover:border-mexican-pink hover:bg-pink-50 transition-colors"
                            >
                                <ImagePlus size={22} className="text-gray-400" />
                                <span className="text-xs text-gray-400 font-body"><T>Agregar</T></span>
                            </button>
                        )}
                    </div>

                    <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFotoChange} />
                </section>

                {/* ── Text Fields ── */}
                <section>
                    <label className="flex items-center gap-2 font-heading text-xs uppercase tracking-wider mb-2">
                        <Tag size={13} className="text-mexican-pink" />
                        <T>Nombre</T>
                    </label>
                    <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required maxLength={80}
                           className="w-full text-sm font-body bg-white border border-gray-200 rounded-xl px-3 py-3 outline-none focus:border-mexican-pink" />
                </section>

                <section>
                    <label className="flex items-center gap-2 font-heading text-xs uppercase tracking-wider mb-2">
                        <FileText size={13} className="text-mexican-pink" />
                        <T>Historia e inspiración</T>
                    </label>
                    <textarea value={historia} onChange={(e) => setHistoria(e.target.value)} rows={4} required maxLength={600}
                              className="w-full text-sm font-body bg-white border border-gray-200 rounded-xl px-3 py-3 outline-none focus:border-mexican-pink resize-none break-words" />
                    <p className="text-xs text-gray-400 font-body text-right mt-0.5">{historia.length}/600</p>
                </section>

                <section>
                    <label className="flex items-center gap-2 font-heading text-xs uppercase tracking-wider mb-2">
                        <Palette size={13} className="text-mexican-pink" />
                        <T>Proceso de creación</T>
                    </label>
                    <textarea value={proceso} onChange={(e) => setProceso(e.target.value)} rows={6} required maxLength={1200}
                              className="w-full text-sm font-body bg-white border border-gray-200 rounded-xl px-3 py-3 outline-none focus:border-mexican-pink resize-none break-words" />
                    <p className="text-xs text-gray-400 font-body text-right mt-0.5">{proceso.length}/1200</p>
                </section>

                <div className="grid grid-cols-2 gap-4">
                    <section>
                        <label className="flex items-center gap-2 font-heading text-xs uppercase tracking-wider mb-2">
                            <Calendar size={13} className="text-mexican-pink" />
                            <T>Año</T>
                        </label>
                        <input type="number" value={año} onChange={(e) => setAño(e.target.value)} required min="1900"
                               className="w-full text-sm font-body bg-white border border-gray-200 rounded-xl px-3 py-3 outline-none focus:border-mexican-pink" />
                    </section>
                    <section>
                        <label className="flex items-center gap-2 font-heading text-xs uppercase tracking-wider mb-2">
                            <Palette size={13} className="text-mexican-pink" />
                            <T>Categoría</T>
                        </label>
                        <select value={categoria} onChange={(e) => setCategoria(e.target.value)}
                                className="w-full text-sm font-body bg-white border border-gray-200 rounded-xl px-3 py-3 outline-none focus:border-mexican-pink">
                            {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </section>
                </div>

                <section>
                    <label className="flex items-center gap-2 font-heading text-xs uppercase tracking-wider mb-2">
                        <Tag size={13} className="text-mexican-pink" />
                        <T>Materiales</T>
                    </label>
                    <TagInput tags={materiales} onChange={setMateriales} placeholder="ej. Papel maché" />
                </section>

                {error && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                                className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-600 font-body">
                        {error}
                    </motion.div>
                )}

                {guardando && (
                    <div className="space-y-1.5">
                        <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                            <motion.div className="h-full bg-mexican-pink rounded-full"
                                        initial={{ width: "0%" }} animate={{ width: `${progreso}%` }} transition={{ duration: 0.4 }} />
                        </div>
                        <p className="text-xs text-gray-500 font-body text-center">
                            {progreso < 100 ? `Guardando cambios... ${progreso}%` : "Actualizando catálogo..."}
                        </p>
                    </div>
                )}

                <button type="submit" disabled={guardando || fotos.length === 0}
                        className="w-full bg-mexican-pink text-white font-heading text-base py-4 rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50 transition-opacity shadow-lg shadow-pink-200">
                    {guardando ? <><Loader2 size={18} className="animate-spin" /> <T>Guardando...</T></> : <T>Guardar Cambios</T>}
                </button>
            </form>
        </main>
    );
}
