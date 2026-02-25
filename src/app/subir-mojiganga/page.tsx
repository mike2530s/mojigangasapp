/* eslint-disable @next/next/no-img-element */
/**
 * Subir Mojiganga — Formulario para que artesanos agreguen su obra
 *
 * Solo accesible para artesanos y admins autenticados.
 * Permite:
 * - Hasta 5 fotos (comprimidas a WebP antes de subir)
 * - Nombre, historia, año, categoría, materiales
 * - Las fotos se suben a Supabase Storage → `mojigangas-fotos`
 * - El registro se inserta en la tabla `mojigangas`
 */

"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft, ImagePlus, X, Loader2, CheckCircle,
    Palette, Calendar, Tag, FileText, Lock, Menu, Plus
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { supabase } from "@/lib/supabase/client";
import { uploadMojigangaPhoto } from "@/lib/supabase/storage";
import T from "@/lib/i18n/T";
import { useText } from "@/lib/i18n/useText";

/* ── Categorías disponibles ────────────────────────────── */
const CATEGORIAS = [
    "Literario", "Histórico", "Fantástico", "Religioso",
    "Regional", "Político", "Animal", "Otro",
];

const MAX_FOTOS = 5;

/* ── Foto preview item ──────────────────────────────────── */
interface FotoItem { file: File; preview: string }

/* ── Tag input ──────────────────────────────────────────── */
function TagInput({
    tags, onChange, placeholder
}: { tags: string[]; onChange: (t: string[]) => void; placeholder: string }) {
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
                    className="flex-1 text-sm font-body bg-white border border-gray-200 rounded-xl
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
                            className="flex items-center gap-1 bg-fiesta-ink/10 text-fiesta-ink
                                       text-xs font-body rounded-full px-2.5 py-1">
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

/* ── Main Page ──────────────────────────────────────────── */
export default function SubirMojigangaPage() {
    const { user, isArtesano, isAdmin, loading: authLoading } = useAuth();
    const router = useRouter();
    const canUpload = isArtesano || isAdmin;

    /* ── Form state ── */
    const [nombre, setNombre] = useState("");
    const [historia, setHistoria] = useState("");
    const [año, setAño] = useState(new Date().getFullYear().toString());
    const [categoria, setCategoria] = useState(CATEGORIAS[0]);
    const [materiales, setMateriales] = useState<string[]>([]);
    const [fotos, setFotos] = useState<FotoItem[]>([]);
    const [enviando, setEnviando] = useState(false);
    const [enviado, setEnviado] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [progreso, setProgreso] = useState(0);
    const fileRef = useRef<HTMLInputElement>(null);

    const nombrePh = useText("ej. La Catrina Gigante");
    const historiaPh = useText("Cuéntanos la historia e inspiración de esta mojiganga...");

    /* ── Auth guard ── */
    if (!authLoading && !canUpload) {
        return (
            <main className="page-container flex flex-col items-center justify-center px-8 text-center min-h-screen bg-paper-white">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-5">
                    <Lock size={36} className="text-gray-400" />
                </div>
                <h1 className="font-heading text-2xl mb-2"><T>Solo artesanos</T></h1>
                <p className="text-gray-500 font-body text-sm mb-6 leading-relaxed">
                    <T>Esta sección es exclusiva para artesanos registrados.</T>
                </p>
                <div className="flex items-center gap-2 bg-fiesta-ink text-white font-heading text-sm py-3 px-5 rounded-xl">
                    <Menu size={18} />
                    <T>Abre el menú ≡ para iniciar sesión</T>
                </div>
            </main>
        );
    }

    /* ── Foto handlers ── */
    const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        const remaining = MAX_FOTOS - fotos.length;
        const toAdd = files.slice(0, remaining);

        toAdd.forEach((file) => {
            // Validar tipo
            if (!file.type.startsWith("image/")) return;
            // Validar tamaño: máx 15MB antes de comprimir
            if (file.size > 15 * 1024 * 1024) {
                setError(`"${file.name}" es mayor a 15 MB. Elige una foto más pequeña.`);
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFotos((prev) => {
                    if (prev.length >= MAX_FOTOS) return prev;
                    return [...prev, { file, preview: reader.result as string }];
                });
            };
            reader.readAsDataURL(file);
        });
        // Reset input para permitir re-seleccionar
        e.target.value = "";
    };

    const removeFoto = (i: number) =>
        setFotos((prev) => prev.filter((_, idx) => idx !== i));

    /* ── Submit ── */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (fotos.length === 0) { setError("Agrega al menos una foto."); return; }
        if (!nombre.trim()) { setError("Escribe el nombre de la mojiganga."); return; }

        setEnviando(true);
        setError(null);
        setProgreso(0);

        try {
            const artesanoId = user!.id;

            // 1. Subir fotos una por una (comprimidas a WebP)
            const urls: string[] = [];
            for (let i = 0; i < fotos.length; i++) {
                const url = await uploadMojigangaPhoto(fotos[i].file, artesanoId, nombre, i);
                urls.push(url);
                setProgreso(Math.round(((i + 1) / fotos.length) * 80));
            }

            // 2. Insertar en tabla mojigangas
            const { error: dbErr } = await supabase.from("mojigangas").insert({
                nombre: nombre.trim(),
                historia: historia.trim() || null,
                artesano_id: artesanoId,
                año: parseInt(año) || new Date().getFullYear(),
                categoria,
                materiales,
                imagen_url: urls[0],          // foto principal
                imagenes_urls: urls,          // todas las fotos
            });
            if (dbErr) throw dbErr;

            setProgreso(100);
            setEnviado(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al subir. Intenta de nuevo.");
        } finally {
            setEnviando(false);
        }
    };

    /* ── Success screen ── */
    if (enviado) {
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
                <h1 className="font-heading text-2xl mb-2">¡Mojiganga publicada!</h1>
                <p className="text-gray-500 font-body text-sm mb-8">
                    Tu obra ya aparece en el catálogo para que todos la puedan ver.
                </p>
                <div className="flex flex-col gap-3 w-full max-w-xs">
                    <button
                        onClick={() => { setEnviado(false); setNombre(""); setHistoria(""); setFotos([]); setMateriales([]); }}
                        className="w-full bg-fiesta-ink text-white font-heading py-3 rounded-2xl"
                    >
                        <T>Subir otra mojiganga</T>
                    </button>
                    <Link href="/catalogo"
                        className="w-full border-2 border-fiesta-ink text-fiesta-ink font-heading py-3 rounded-2xl text-center">
                        <T>Ver catálogo</T>
                    </Link>
                </div>
            </main>
        );
    }

    /* ── Form ── */
    return (
        <main className="page-container bg-paper-white pb-24">
            {/* Header */}
            <header className="flex items-center gap-3 px-5 pt-5 pb-4 border-b border-gray-100 sticky top-0 bg-paper-white z-10">
                <Link href="/catalogo" className="p-1.5 rounded-xl hover:bg-gray-100 transition-colors">
                    <ArrowLeft size={20} />
                </Link>
                <div className="flex-1">
                    <h1 className="font-heading text-base leading-tight"><T>Subir Mojiganga</T></h1>
                    <p className="text-xs text-gray-400 font-body"><T>Comparte tu obra con el mundo</T></p>
                </div>
                {/* Foto counter */}
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
                        {/* Miniaturas subidas */}
                        {fotos.map((f, i) => (
                            <div key={i} className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 border-2 border-transparent">
                                <img src={f.preview} alt="" className="w-full h-full object-cover" />
                                {/* Badge de orden */}
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

                        {/* Botón agregar */}
                        {fotos.length < MAX_FOTOS && (
                            <button
                                type="button"
                                onClick={() => fileRef.current?.click()}
                                className="aspect-square rounded-2xl border-2 border-dashed border-gray-300
                                           flex flex-col items-center justify-center gap-1
                                           hover:border-mexican-pink hover:bg-pink-50 transition-colors"
                            >
                                <ImagePlus size={22} className="text-gray-400" />
                                <span className="text-xs text-gray-400 font-body">Agregar</span>
                            </button>
                        )}
                    </div>

                    <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleFotoChange}
                    />
                    <p className="text-xs text-gray-400 font-body mt-2">
                        JPG, PNG o WebP · máx 15 MB por foto · se comprimen automáticamente
                    </p>
                </section>

                {/* ── Nombre ── */}
                <section>
                    <label className="flex items-center gap-2 font-heading text-xs uppercase tracking-wider mb-2">
                        <Tag size={13} className="text-mexican-pink" />
                        <T>Nombre de la mojiganga</T>
                    </label>
                    <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder={nombrePh}
                        required
                        maxLength={80}
                        className="w-full text-sm font-body bg-white border border-gray-200 rounded-xl
                                   px-3 py-3 outline-none focus:border-mexican-pink transition-colors"
                    />
                </section>

                {/* ── Historia ── */}
                <section>
                    <label className="flex items-center gap-2 font-heading text-xs uppercase tracking-wider mb-2">
                        <FileText size={13} className="text-mexican-pink" />
                        <T>Historia e inspiración</T>
                    </label>
                    <textarea
                        value={historia}
                        onChange={(e) => setHistoria(e.target.value)}
                        placeholder={historiaPh}
                        rows={4}
                        maxLength={600}
                        className="w-full text-sm font-body bg-white border border-gray-200 rounded-xl
                                   px-3 py-3 outline-none focus:border-mexican-pink transition-colors resize-none"
                    />
                    <p className="text-xs text-gray-400 font-body text-right mt-0.5">{historia.length}/600</p>
                </section>

                {/* ── Año + Categoría (grid) ── */}
                <div className="grid grid-cols-2 gap-4">
                    <section>
                        <label className="flex items-center gap-2 font-heading text-xs uppercase tracking-wider mb-2">
                            <Calendar size={13} className="text-mexican-pink" />
                            <T>Año</T>
                        </label>
                        <input
                            type="number"
                            value={año}
                            onChange={(e) => setAño(e.target.value)}
                            min="1900"
                            max={new Date().getFullYear()}
                            className="w-full text-sm font-body bg-white border border-gray-200 rounded-xl
                                       px-3 py-3 outline-none focus:border-mexican-pink transition-colors"
                        />
                    </section>

                    <section>
                        <label className="flex items-center gap-2 font-heading text-xs uppercase tracking-wider mb-2">
                            <Palette size={13} className="text-mexican-pink" />
                            <T>Categoría</T>
                        </label>
                        <select
                            value={categoria}
                            onChange={(e) => setCategoria(e.target.value)}
                            className="w-full text-sm font-body bg-white border border-gray-200 rounded-xl
                                       px-3 py-3 outline-none focus:border-mexican-pink transition-colors"
                        >
                            {CATEGORIAS.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </section>
                </div>

                {/* ── Materiales ── */}
                <section>
                    <label className="flex items-center gap-2 font-heading text-xs uppercase tracking-wider mb-2">
                        <Tag size={13} className="text-mexican-pink" />
                        <T>Materiales utilizados</T>
                        <span className="text-gray-400 normal-case font-body ml-auto"><T>(escribe y presiona Enter o +)</T></span>
                    </label>
                    <TagInput
                        tags={materiales}
                        onChange={setMateriales}
                        placeholder="ej. Papel maché"
                    />
                </section>

                {/* ── Error ── */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-600 font-body"
                        >
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── Barra de progreso ── */}
                {enviando && (
                    <div className="space-y-1.5">
                        <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                            <motion.div
                                className="h-full bg-mexican-pink rounded-full"
                                initial={{ width: "0%" }}
                                animate={{ width: `${progreso}%` }}
                                transition={{ duration: 0.4 }}
                            />
                        </div>
                        <p className="text-xs text-gray-500 font-body text-center">
                            {progreso < 80 ? `Subiendo fotos... ${progreso}%` : "Guardando en catálogo..."}
                        </p>
                    </div>
                )}

                {/* ── Submit ── */}
                <button
                    type="submit"
                    disabled={enviando || fotos.length === 0}
                    className="w-full bg-mexican-pink text-white font-heading text-base py-4
                               rounded-2xl flex items-center justify-center gap-2
                               disabled:opacity-50 transition-opacity shadow-lg shadow-pink-200"
                >
                    {enviando ? (
                        <><Loader2 size={18} className="animate-spin" /> <T>Subiendo...</T></>
                    ) : (
                        <><Palette size={18} /> <T>Publicar en el catálogo</T></>
                    )}
                </button>
            </form>
        </main>
    );
}
