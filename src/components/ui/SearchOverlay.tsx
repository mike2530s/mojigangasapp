/**
 * SearchOverlay — Búsqueda global animada
 *
 * Busca en tiempo real en artesanos, historias y mojigangas.
 * Se abre desde el Header con el ícono de lupa.
 */

"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Palette, BookOpen, Layers } from "lucide-react";
import Link from "next/link";
import { useArtesanos } from "@/hooks/useArtesanos";
import { useHistorias } from "@/hooks/useHistorias";
import { useMojigangas } from "@/hooks/useMojigangas";

interface SearchOverlayProps {
    open: boolean;
    onClose: () => void;
}

export default function SearchOverlay({ open, onClose }: SearchOverlayProps) {
    const [query, setQuery] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const { artesanos } = useArtesanos();
    const { historias } = useHistorias();
    const { mojigangas } = useMojigangas();

    // Focus al abrir
    useEffect(() => {
        if (open) {
            setTimeout(() => inputRef.current?.focus(), 100);
        } else {
            setQuery("");
        }
    }, [open]);

    // Cerrar con Escape
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);

    const q = query.toLowerCase().trim();

    const filteredArtesanos = q.length > 1
        ? artesanos.filter(a => a.nombre.toLowerCase().includes(q) || a.taller?.toLowerCase().includes(q))
        : [];

    const filteredHistorias = q.length > 1
        ? historias.filter(h => h.relato?.toLowerCase().includes(q) || h.evento?.toLowerCase().includes(q) || h.usuario_nombre?.toLowerCase().includes(q))
        : [];

    const filteredMojigangas = q.length > 1
        ? mojigangas.filter(m => m.nombre.toLowerCase().includes(q) || m.artesano?.toLowerCase().includes(q))
        : [];

    const hasResults = filteredArtesanos.length > 0 || filteredHistorias.length > 0 || filteredMojigangas.length > 0;

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-fiesta-ink/80 backdrop-blur-sm z-[200]"
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.97 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className="fixed top-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:max-w-lg
                                   z-[201] bg-paper-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.4)]
                                   overflow-hidden"
                    >
                        {/* Input row */}
                        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
                            <Search size={18} className="text-gray-400 flex-shrink-0" />
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                placeholder="Buscar artesanos, historias, mojigangas…"
                                className="flex-1 bg-transparent text-sm font-body text-fiesta-ink
                                           placeholder:text-gray-400 outline-none"
                            />
                            {query && (
                                <button onClick={() => setQuery("")} className="text-gray-400 hover:text-fiesta-ink transition-colors">
                                    <X size={16} />
                                </button>
                            )}
                        </div>

                        {/* Resultados */}
                        <div className="max-h-[60vh] overflow-y-auto">
                            {q.length < 2 ? (
                                <p className="text-center text-sm text-gray-400 font-body py-8">
                                    Escribe al menos 2 letras...
                                </p>
                            ) : !hasResults ? (
                                <p className="text-center text-sm text-gray-400 font-body py-8">
                                    Sin resultados para &ldquo;{query}&rdquo;
                                </p>
                            ) : (
                                <div className="py-2">
                                    {/* Artesanos */}
                                    {filteredArtesanos.length > 0 && (
                                        <section>
                                            <p className="px-4 py-1.5 text-[10px] font-heading uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                                                <Palette size={10} /> Artesanos
                                            </p>
                                            {filteredArtesanos.slice(0, 3).map(a => (
                                                <Link key={a.id} href={`/artesanos/${a.id}`} onClick={onClose}
                                                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors">
                                                    <div className="w-8 h-8 rounded-full bg-fiesta-purple/20 flex items-center justify-center flex-shrink-0">
                                                        <Palette size={14} className="text-fiesta-purple" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-heading text-fiesta-ink leading-tight">{a.nombre}</p>
                                                        {a.taller && <p className="text-xs text-gray-400 font-body">{a.taller}</p>}
                                                    </div>
                                                </Link>
                                            ))}
                                        </section>
                                    )}

                                    {/* Mojigangas */}
                                    {filteredMojigangas.length > 0 && (
                                        <section>
                                            <p className="px-4 py-1.5 text-[10px] font-heading uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                                                <Layers size={10} /> Mojigangas
                                            </p>
                                            {filteredMojigangas.slice(0, 3).map(m => (
                                                <Link key={m.id} href={`/catalogo/${m.id}`} onClick={onClose}
                                                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors">
                                                    <div className="w-8 h-8 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                                                        {m.imagen_url
                                                            ? <img src={m.imagen_url} alt="" className="w-full h-full object-cover" />
                                                            : <Layers size={14} className="text-gray-400 m-auto" />}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-heading text-fiesta-ink leading-tight">{m.nombre}</p>
                                                        <p className="text-xs text-gray-400 font-body">{m.artesano} · {m.año}</p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </section>
                                    )}

                                    {/* Historias */}
                                    {filteredHistorias.length > 0 && (
                                        <section>
                                            <p className="px-4 py-1.5 text-[10px] font-heading uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                                                <BookOpen size={10} /> Historias
                                            </p>
                                            {filteredHistorias.slice(0, 3).map(h => (
                                                <Link key={h.id} href="/historias" onClick={onClose}
                                                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors">
                                                    <div className="w-8 h-8 rounded-full bg-mexican-pink/10 font-heading text-mexican-pink text-xs flex items-center justify-center flex-shrink-0">
                                                        {h.usuario_nombre?.[0]?.toUpperCase() ?? "H"}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-heading text-fiesta-ink leading-tight truncate">{h.usuario_nombre}</p>
                                                        <p className="text-xs text-gray-400 font-body line-clamp-1">{h.relato}</p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </section>
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
