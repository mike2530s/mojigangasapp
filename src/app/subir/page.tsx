/**
 * 📤 Subir Historia Page — Formulario conectado a Supabase
 *
 * Pantalla con formulario que:
 * - Sube imagen al bucket "imagenes-tradicion" de Supabase Storage
 * - Crea un registro en la tabla "historias_comunidad"
 * - Muestra preview de imagen, estado de envío y confirmación
 */

"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Camera, MapPin, User, Send, ArrowLeft, ImagePlus, Loader2 } from "lucide-react";
import Link from "next/link";
import { createHistoria, uploadHistoriaImage } from "@/lib/supabase/historias";

export default function SubirHistoriaPage() {
    const [nombre, setNombre] = useState("");
    const [relato, setRelato] = useState("");
    const [ubicacion, setUbicacion] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [enviando, setEnviando] = useState(false);
    const [enviado, setEnviado] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    /* Maneja la selección de imagen y genera preview */
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    /* Envío a Supabase */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setEnviando(true);
        setError(null);

        try {
            /* 1. Subir imagen si hay una */
            let fotoUrl: string | undefined;
            if (imageFile) {
                fotoUrl = await uploadHistoriaImage(imageFile);
            }

            /* 2. Crear registro en la tabla */
            await createHistoria({
                usuario_nombre: nombre,
                foto_url: fotoUrl,
                relato,
                ubicacion_nombre: ubicacion || undefined,
            });

            setEnviado(true);
        } catch (err) {
            console.error("Error al subir historia:", err);
            setError(err instanceof Error ? err.message : "Ocurrió un error al enviar. Intenta de nuevo.");
        } finally {
            setEnviando(false);
        }
    };

    /* Pantalla de confirmación */
    if (enviado) {
        return (
            <main className="page-container flex flex-col items-center justify-center px-5 text-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                >
                    <span className="text-6xl block mb-4">🎭</span>
                    <h1 className="font-heading text-2xl mb-2">¡Historia Enviada!</h1>
                    <p className="text-gray-600 font-body text-sm mb-6">
                        Tu relato ya es parte del archivo comunitario. Gracias por mantener viva la tradición.
                    </p>
                    <Link href="/historias" className="btn-primary inline-flex">
                        Ver Historias
                    </Link>
                </motion.div>
            </main>
        );
    }

    return (
        <main className="page-container">
            {/* Header con botón atrás */}
            <header className="flex items-center gap-3 px-5 pt-5 pb-4">
                <Link
                    href="/historias"
                    className="w-10 h-10 rounded-full bg-white shadow-hard-sm flex items-center justify-center
                     text-fiesta-ink hover:bg-gray-50 transition-colors"
                >
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="font-heading text-lg">Comparte tu Historia</h1>
            </header>

            {/* Error banner */}
            {error && (
                <div className="mx-5 mb-4 p-3 bg-red-50 border border-red-200 rounded-card text-sm text-red-600 font-body">
                    {error}
                </div>
            )}

            {/* Formulario */}
            <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                onSubmit={handleSubmit}
                className="px-5 space-y-5"
            >
                {/* Subir foto */}
                <div>
                    <input
                        ref={fileRef} type="file" accept="image/*" capture="environment"
                        onChange={handleImageChange} className="hidden"
                    />
                    <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        className="w-full aspect-[16/9] rounded-card border-2 border-dashed border-gray-300
                       bg-white flex flex-col items-center justify-center gap-2
                       hover:border-mexican-pink hover:bg-pink-50/30 transition-colors overflow-hidden"
                    >
                        {preview ? (
                            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <>
                                <ImagePlus size={32} className="text-gray-400" />
                                <span className="text-sm text-gray-400 font-body">Toca para agregar foto</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Campo: Nombre */}
                <div className="bg-white rounded-card p-4 shadow-hard-sm">
                    <label className="flex items-center gap-2 text-xs font-heading uppercase tracking-wider text-gray-500 mb-2">
                        <User size={14} /> Tu Nombre
                    </label>
                    <input
                        type="text" value={nombre} onChange={(e) => setNombre(e.target.value)}
                        placeholder="¿Cómo te llamas?" required
                        className="w-full text-sm font-body bg-transparent outline-none placeholder:text-gray-300"
                    />
                </div>

                {/* Campo: Relato */}
                <div className="bg-white rounded-card p-4 shadow-hard-sm">
                    <label className="flex items-center gap-2 text-xs font-heading uppercase tracking-wider text-gray-500 mb-2">
                        <Camera size={14} /> Tu Historia
                    </label>
                    <textarea
                        value={relato} onChange={(e) => setRelato(e.target.value)}
                        placeholder="Cuéntanos tu experiencia con las mojigangas..." rows={4} required
                        className="w-full text-sm font-body bg-transparent outline-none resize-none placeholder:text-gray-300"
                    />
                </div>

                {/* Campo: Ubicación */}
                <div className="bg-white rounded-card p-4 shadow-hard-sm">
                    <label className="flex items-center gap-2 text-xs font-heading uppercase tracking-wider text-gray-500 mb-2">
                        <MapPin size={14} /> Ubicación
                    </label>
                    <input
                        type="text" value={ubicacion} onChange={(e) => setUbicacion(e.target.value)}
                        placeholder="¿Dónde fue? (ej. San Miguel de Allende)"
                        className="w-full text-sm font-body bg-transparent outline-none placeholder:text-gray-300"
                    />
                </div>

                {/* Botón enviar */}
                <button
                    type="submit"
                    disabled={enviando}
                    className="btn-primary w-full text-center justify-center disabled:opacity-50"
                >
                    {enviando ? (
                        <><Loader2 size={18} className="animate-spin" /> Enviando...</>
                    ) : (
                        <><Send size={18} /> Compartir Historia</>
                    )}
                </button>
            </motion.form>
        </main>
    );
}
