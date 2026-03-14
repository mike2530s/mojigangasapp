/* eslint-disable @next/next/no-img-element */
/**
 * Subir Historia Page — Formulario mejorado
 *
 * - Múltiples fotos (mínimo 1, máximo 8)
 * - Toggle "Destacar historia" (aparece en los círculos Featured Today)
 * - Campo opcional de evento/día especial
 * - Labels y placeholders traducidos via useText / <T>.
 */

"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, MapPin, User, Send, ArrowLeft, ImagePlus, Loader2, X, Star, CalendarHeart } from "lucide-react";
import Link from "next/link";
import { createHistoria, uploadMultipleImages } from "@/lib/supabase/historias";
import T from "@/lib/i18n/T";
import { useText } from "@/lib/i18n/useText";
import { useAuth } from "@/lib/auth/AuthContext";
import { Lock, Menu } from "lucide-react";

const MAX_FOTOS = 8;

export default function SubirHistoriaPage() {
    const [nombre, setNombre] = useState("");
    const [relato, setRelato] = useState("");
    const [ubicacion, setUbicacion] = useState("");
    const [evento, setEvento] = useState("");
    const [destacada, setDestacada] = useState(false);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [enviando, setEnviando] = useState(false);
    const [enviado, setEnviado] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [aceptaTerminos, setAceptaTerminos] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    const namePlaceholder = useText("¿Cómo te llamas?");
    const storyPlaceholder = useText("Cuéntanos tu experiencia con las mojigangas...");
    const locationPlaceholder = useText("¿Dónde fue? (ej. San Miguel de Allende)");
    const eventPlaceholder = useText("Ej: Festival Cervantino, Día de Muertos...");

    const { isArtesano, isAdmin, loading: authLoading } = useAuth();
    const canUpload = isArtesano || isAdmin;

    // ── Auth guard ──────────────────────────────────────────
    if (!authLoading && !canUpload) {
        return (
            <main className="page-container flex flex-col items-center justify-center px-8 text-center min-h-screen bg-paper-white">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-5">
                    <Lock size={36} className="text-gray-400" />
                </div>
                <h1 className="font-heading text-2xl mb-2">
                    <T>Solo artesanos</T>
                </h1>
                <p className="text-gray-500 font-body text-sm mb-6 leading-relaxed">
                    <T>Esta sección es exclusiva para artesanos registrados. Inicia sesión con tu cuenta de artesano para compartir tu historia.</T>
                </p>
                <div className="flex items-center gap-2 bg-fiesta-ink text-white font-heading text-sm py-3 px-5 rounded-xl">
                    <Menu size={18} />
                    <T>Abre el menú ≡ para iniciar sesión</T>
                </div>
            </main>
        );
    }

    const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const remaining = MAX_FOTOS - imageFiles.length;
        const toAdd = files.slice(0, remaining);

        if (toAdd.length === 0) return;

        setImageFiles((prev) => [...prev, ...toAdd]);

        // Generate previews
        toAdd.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviews((prev) => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });

        // Reset input so same file can be re-selected
        if (fileRef.current) fileRef.current.value = "";
    };

    const removeImage = (index: number) => {
        setImageFiles((prev) => prev.filter((_, i) => i !== index));
        setPreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (imageFiles.length === 0) {
            setError("Debes agregar al menos una foto.");
            return;
        }
        setEnviando(true);
        setError(null);
        setUploadProgress(0);
        try {
            // Upload images one by one with progress
            const urls: string[] = [];
            for (let i = 0; i < imageFiles.length; i++) {
                const { uploadHistoriaImage } = await import("@/lib/supabase/historias");
                const url = await uploadHistoriaImage(imageFiles[i]);
                urls.push(url);
                setUploadProgress(Math.round(((i + 1) / imageFiles.length) * 100));
            }

            await createHistoria({
                usuario_nombre: nombre,
                foto_url: urls[0],        // Primera foto como portada
                fotos_urls: urls,          // Todas las fotos
                relato,
                ubicacion_nombre: ubicacion || undefined,
                destacada,
                evento: evento.trim() || undefined,
            });
            setEnviado(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Ocurrió un error al enviar. Intenta de nuevo.");
        } finally {
            setEnviando(false);
        }
    };

    /* Pantalla de confirmacion */
    if (enviado) {
        return (
            <main className="page-container flex flex-col items-center justify-center px-5 text-center">
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200 }}>
                    <span className="text-6xl block mb-4">🎭</span>
                    <h1 className="font-heading text-2xl mb-2"><T>¡Historia Enviada!</T></h1>
                    <p className="text-gray-600 font-body text-sm mb-2">
                        <T>Tu relato ya es parte del archivo comunitario. Gracias por mantener viva la tradición.</T>
                    </p>
                    {destacada && (
                        <p className="text-mexican-pink font-body text-xs mb-4">
                            ⭐ <T>Tu historia aparecerá en Destacados</T>
                        </p>
                    )}
                    <Link href="/historias" className="btn-primary inline-flex">
                        <T>Ver Historias</T>
                    </Link>
                </motion.div>
            </main>
        );
    }

    return (
        <main className="page-container">
            <header className="flex items-center gap-3 px-5 pt-5 pb-4">
                <Link href="/historias" className="w-10 h-10 rounded-full bg-white shadow-hard-sm flex items-center justify-center text-fiesta-ink hover:bg-gray-50 transition-colors">
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="font-heading text-lg"><T>Comparte tu Historia</T></h1>
            </header>

            {error && (
                <div className="mx-5 mb-4 p-3 bg-red-50 border border-red-200 rounded-card text-sm text-red-600 font-body">
                    {error}
                </div>
            )}

            <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                onSubmit={handleSubmit}
                className="px-5 space-y-5"
            >
                {/* ── Fotos (1-8) ── */}
                <div>
                    <label className="flex items-center justify-between text-xs font-heading uppercase tracking-wider text-gray-500 mb-3">
                        <span className="flex items-center gap-2">
                            <Camera size={14} />
                            <T>Fotos</T> ({imageFiles.length}/{MAX_FOTOS})
                        </span>
                        <span className="text-gray-400 font-body normal-case">
                            <T>Mín. 1, máx. 8</T>
                        </span>
                    </label>

                    <div className="grid grid-cols-4 gap-2">
                        {/* Previews */}
                        <AnimatePresence>
                            {previews.map((src, i) => (
                                <motion.div
                                    key={src}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="relative aspect-square rounded-xl overflow-hidden bg-gray-100"
                                >
                                    <img src={src} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(i)}
                                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-fiesta-ink/70 text-white
                                                   flex items-center justify-center hover:bg-mexican-pink transition-colors"
                                    >
                                        <X size={12} />
                                    </button>
                                    {i === 0 && (
                                        <span className="absolute bottom-1 left-1 bg-fiesta-yellow text-fiesta-ink text-[9px] font-heading
                                                         px-1.5 py-0.5 rounded uppercase">
                                            Portada
                                        </span>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* Add more button */}
                        {imageFiles.length < MAX_FOTOS && (
                            <button
                                type="button"
                                onClick={() => fileRef.current?.click()}
                                className="aspect-square rounded-xl border-2 border-dashed border-gray-300
                                           bg-white flex flex-col items-center justify-center gap-1
                                           hover:border-mexican-pink hover:bg-pink-50/30 transition-colors"
                            >
                                <ImagePlus size={20} className="text-gray-400" />
                                <span className="text-[10px] text-gray-400 font-body">
                                    <T>Agregar</T>
                                </span>
                            </button>
                        )}
                    </div>

                    <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImagesChange}
                        className="hidden"
                    />
                </div>

                {/* ── Nombre ── */}
                <div className="bg-white rounded-card p-4 shadow-hard-sm">
                    <label className="flex items-center gap-2 text-xs font-heading uppercase tracking-wider text-gray-500 mb-2">
                        <User size={14} /> <T>Tu Nombre</T>
                    </label>
                    <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)}
                        placeholder={namePlaceholder} required
                        className="w-full text-sm font-body bg-transparent outline-none placeholder:text-gray-300" />
                </div>

                {/* ── Relato ── */}
                <div className="bg-white rounded-card p-4 shadow-hard-sm">
                    <label className="flex items-center gap-2 text-xs font-heading uppercase tracking-wider text-gray-500 mb-2">
                        <Camera size={14} /> <T>Tu Historia</T>
                    </label>
                    <textarea value={relato} onChange={(e) => setRelato(e.target.value)}
                        placeholder={storyPlaceholder} rows={4} required
                        className="w-full text-sm font-body bg-transparent outline-none resize-none placeholder:text-gray-300" />
                </div>

                {/* ── Ubicación ── */}
                <div className="bg-white rounded-card p-4 shadow-hard-sm">
                    <label className="flex items-center gap-2 text-xs font-heading uppercase tracking-wider text-gray-500 mb-2">
                        <MapPin size={14} /> <T>Ubicación</T>
                    </label>
                    <input type="text" value={ubicacion} onChange={(e) => setUbicacion(e.target.value)}
                        placeholder={locationPlaceholder}
                        className="w-full text-sm font-body bg-transparent outline-none placeholder:text-gray-300" />
                </div>

                {/* ── Evento / Día Especial ── */}
                <div className="bg-white rounded-card p-4 shadow-hard-sm">
                    <label className="flex items-center gap-2 text-xs font-heading uppercase tracking-wider text-gray-500 mb-2">
                        <CalendarHeart size={14} /> <T>Evento o Día Especial</T>
                        <span className="text-gray-400 font-body normal-case text-[10px]">(<T>opcional</T>)</span>
                    </label>
                    <input type="text" value={evento} onChange={(e) => setEvento(e.target.value)}
                        placeholder={eventPlaceholder}
                        className="w-full text-sm font-body bg-transparent outline-none placeholder:text-gray-300" />
                </div>

                {/* ── Toggle Destacar ── */}
                <label className="flex items-center gap-4 bg-white rounded-card p-4 shadow-hard-sm cursor-pointer group">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 text-xs font-heading uppercase tracking-wider text-gray-500 mb-1">
                            <Star size={14} /> <T>Destacar Historia</T>
                        </div>
                        <p className="text-xs text-gray-400 font-body leading-relaxed">
                            <T>Tu historia aparecerá en los círculos de "Destacadas" para que más gente la vea.</T>
                        </p>
                    </div>
                    <div className="relative flex-shrink-0">
                        <input
                            type="checkbox"
                            checked={destacada}
                            onChange={(e) => setDestacada(e.target.checked)}
                            className="sr-only"
                        />
                        <div className={`w-12 h-7 rounded-full transition-colors ${destacada ? "bg-mexican-pink" : "bg-gray-300"}`} />
                        <div className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${destacada ? "translate-x-5" : "translate-x-0"}`} />
                    </div>
                </label>

                {/* ── Aceptar términos ── */}
                <label className="flex items-start gap-3 bg-white rounded-card p-4 shadow-hard-sm cursor-pointer">
                    <input
                        type="checkbox"
                        checked={aceptaTerminos}
                        onChange={(e) => setAceptaTerminos(e.target.checked)}
                        className="mt-0.5 w-4 h-4 accent-mexican-pink flex-shrink-0"
                    />
                    <span className="text-xs font-body text-gray-600 leading-relaxed">
                        <T>Acepto los</T>{" "}
                        <Link href="/terminos" className="text-mexican-pink underline hover:text-fiesta-purple" target="_blank">
                            <T>Términos y Condiciones</T>
                        </Link>{" "}
                        <T>y el</T>{" "}
                        <Link href="/privacidad" className="text-mexican-pink underline hover:text-fiesta-purple" target="_blank">
                            <T>Aviso de Privacidad</T>
                        </Link>
                    </span>
                </label>

                {/* ── Progress bar ── */}
                {enviando && (
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <motion.div
                            className="h-full bg-mexican-pink rounded-full"
                            initial={{ width: "0%" }}
                            animate={{ width: `${uploadProgress}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                )}

                {/* ── Enviar ── */}
                <button
                    type="submit"
                    disabled={enviando || !aceptaTerminos || imageFiles.length === 0}
                    className="btn-primary w-full text-center justify-center disabled:opacity-50"
                >
                    {enviando ? (
                        <>
                            <Loader2 size={18} className="animate-spin" />
                            <T>Subiendo fotos</T> ({uploadProgress}%)
                        </>
                    ) : (
                        <><Send size={18} /> <T>Compartir Historia</T> ({imageFiles.length} {imageFiles.length === 1 ? "foto" : "fotos"})</>
                    )}
                </button>

                {/* ── Footer links ── */}
                <div className="text-center pb-4">
                    <Link href="/terminos" className="text-xs text-gray-400 font-body hover:text-mexican-pink transition-colors">
                        <T>Términos</T>
                    </Link>
                    <span className="text-xs text-gray-300 mx-2">·</span>
                    <Link href="/privacidad" className="text-xs text-gray-400 font-body hover:text-mexican-pink transition-colors">
                        <T>Privacidad</T>
                    </Link>
                </div>
            </motion.form>
        </main>
    );
}
