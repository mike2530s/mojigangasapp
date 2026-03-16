/**
 * HamburgerDrawer — Menú lateral deslizante
 *
 * Secciones:
 * 1. Non autenticado → formulario de inicio de sesión
 * 2. Artesano autenticado → acceso a su perfil + cerrar sesión
 * 3. Admin autenticado → crear cuenta de artesano + cerrar sesión
 */

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Menu, X, LogIn, LogOut, User, UserPlus, ImagePlus,
    ChevronRight, Home, BookOpen, Map, Layers, Palette, Eye, EyeOff, Heart
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { createArtesanoAccount } from "@/lib/supabase/auth";
import T from "@/lib/i18n/T";

/* ── Sub-forms ─────────────────────────────────────────── */

function LoginForm({ onClose }: { onClose: () => void }) {
    const { signIn } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await signIn(email, password);
            onClose();
        } catch {
            setError("Credenciales incorrectas. Verifica tu correo y contraseña.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <h3 className="font-heading text-sm uppercase tracking-wider flex items-center gap-2">
                <LogIn size={14} className="text-mexican-pink" />
                <T>Iniciar Sesión</T>
            </h3>
            {error && (
                <p className="text-xs text-red-500 bg-red-50 rounded-lg p-2 font-body">{error}</p>
            )}
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
                required
                className="w-full text-sm font-body bg-white border border-gray-200 rounded-xl
                           px-3 py-2.5 outline-none focus:border-mexican-pink transition-colors"
            />
            <div className="relative">
                <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full text-sm font-body bg-white border border-gray-200 rounded-xl
                               pl-3 pr-10 py-2.5 outline-none focus:border-mexican-pink transition-colors"
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-mexican-pink transition-colors"
                >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
            </div>
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-fiesta-ink text-white font-heading text-sm py-2.5 rounded-xl
                           flex items-center justify-center gap-2 disabled:opacity-60 transition-opacity"
            >
                {loading ? (
                    <span className="animate-spin">⏳</span>
                ) : (
                    <><LogIn size={14} /> <T>Entrar</T></>
                )}
            </button>
        </form>
    );
}

function CreateArtesanoForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [nombre, setNombre] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await createArtesanoAccount({ email, password, nombre, taller: "", ciudad: "" });
            setSuccess(true);
            setEmail(""); setPassword(""); setNombre("");
        } catch (err) {
            // Supabase errors (PostgrestError / AuthApiError) may not extend native Error
            const msg =
                err instanceof Error
                    ? err.message
                    : (err as { message?: string })?.message
                    ?? JSON.stringify(err);
            setError(msg || "Error al crear la cuenta");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="bg-green-50 rounded-xl p-4 text-center">
                <span className="text-2xl block mb-1">✅</span>
                <p className="text-xs font-body text-green-700">
                    <T>Cuenta creada exitosamente. Comparte las credenciales con el artesano.</T>
                </p>
                <button onClick={() => setSuccess(false)} className="mt-2 text-xs text-green-600 underline">
                    <T>Crear otra</T>
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-2">
            <h4 className="font-heading text-xs uppercase tracking-wider text-gray-500 flex items-center gap-2">
                <UserPlus size={12} /> <T>Nueva Cuenta de Artesano</T>
            </h4>
            {error && (
                <p className="text-xs text-red-500 bg-red-50 rounded-lg p-2 font-body">{error}</p>
            )}
            {/* Nombre */}
            <input type="text" value={nombre} onChange={e => setNombre(e.target.value)}
                placeholder="Nombre del artesano" required
                className="w-full text-xs font-body bg-white border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-mexican-pink" />
            {/* Email */}
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="correo del artesano" required
                className="w-full text-xs font-body bg-white border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-mexican-pink" />
            {/* Password */}
            <div className="relative">
                <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="contraseña (min. 6 caracteres)" minLength={6} required
                    className="w-full text-xs font-body bg-white border border-gray-200 rounded-xl pl-3 pr-10 py-2 outline-none focus:border-mexican-pink"
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-mexican-pink transition-colors"
                >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
            </div>

            <button type="submit" disabled={loading}
                className="w-full bg-mexican-pink text-white font-heading text-xs py-2.5 rounded-xl
                           flex items-center justify-center gap-2 disabled:opacity-60">
                {loading ? "Creando..." : <><UserPlus size={13} /> <T>Crear Cuenta</T></>}
            </button>
        </form>
    );
}

/* ── Nav Links ─────────────────────────────────────────── */
const NAV_LINKS = [
    { href: "/home", labelEs: "Inicio", icon: Home },
    { href: "/historias", labelEs: "Historias", icon: BookOpen },
    { href: "/mapa", labelEs: "Mapa", icon: Map },
    { href: "/catalogo", labelEs: "Catálogo", icon: Layers },
    { href: "/acerca-de", labelEs: "Nuestra Cultura", icon: Heart },
    { href: "/artesanos", labelEs: "Artesanos", icon: Palette },
];

/* ── Main Drawer ───────────────────────────────────────── */
export default function HamburgerDrawer() {
    const [open, setOpen] = useState(false);
    const { user, isAdmin, isArtesano, signOut } = useAuth();
    const [showCreateForm, setShowCreateForm] = useState(false);

    const close = () => setOpen(false);

    return (
        <>
            {/* Trigger button */}
            <button
                onClick={() => setOpen(true)}
                className="p-1 text-fiesta-ink hover:text-mexican-pink transition-colors"
                aria-label="Abrir menú"
            >
                <Menu size={24} />
            </button>

            {/* Overlay */}
            <AnimatePresence>
                {open && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={close}
                            className="fixed inset-0 bg-black/50 z-40"
                        />

                        {/* Drawer panel */}
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] z-50
                                       bg-paper-white shadow-2xl flex flex-col overflow-y-auto"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between px-5 pt-6 pb-4 border-b border-gray-100">
                                <div>
                                    <span className="font-display italic text-xl text-fiesta-ink">Mojigangas</span>
                                    <br />
                                    <span className="font-heading text-xs tracking-wider text-fiesta-yellow">
                                        <T>LA TRADICIÓN</T>
                                    </span>
                                </div>
                                <button onClick={close} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Nav links */}
                            <nav className="px-4 py-4 border-b border-gray-100">
                                {NAV_LINKS.map(({ href, labelEs, icon: Icon }) => (
                                    <Link key={href} href={href} onClick={close}
                                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl
                                                   hover:bg-gray-100 transition-colors group">
                                        <Icon size={18} className="text-gray-400 group-hover:text-mexican-pink transition-colors" />
                                        <span className="font-body text-sm text-fiesta-ink"><T>{labelEs}</T></span>
                                        <ChevronRight size={14} className="ml-auto text-gray-300" />
                                    </Link>
                                ))}
                            </nav>

                            {/* Auth section */}
                            <div className="flex-1 px-4 py-5">
                                {!user ? (
                                    /* ── Not logged in ── */
                                    <LoginForm onClose={close} />
                                ) : (
                                    /* ── Logged in ── */
                                    <div className="space-y-4">
                                        {/* User info chip */}
                                        <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-3 py-2.5">
                                            <div className="w-8 h-8 rounded-full bg-mexican-pink flex items-center justify-center flex-shrink-0">
                                                <User size={16} className="text-white" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-heading truncate">
                                                    {user.user_metadata?.nombre || user.email}
                                                </p>
                                                <p className="text-xs text-gray-500 font-body capitalize">
                                                    {isAdmin ? "🛡 Admin" : isArtesano ? "🎭 Artesano" : "Usuario"}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Artesano: go to own profile */}
                                        {isArtesano && (
                                            <div className="space-y-2">
                                                <Link href={`/artesanos/${user.id}`} onClick={close}
                                                    className="flex items-center gap-2 w-full bg-fiesta-ink text-white
                                                               font-heading text-sm py-2.5 px-4 rounded-xl">
                                                    <Palette size={16} /> <T>Mi Perfil de Artesano</T>
                                                </Link>
                                                <Link href="/subir-mojiganga" onClick={close}
                                                    className="flex items-center gap-2 w-full bg-mexican-pink text-white
                                                               font-heading text-sm py-2.5 px-4 rounded-xl">
                                                    <ImagePlus size={16} /> <T>Subir Mojiganga</T>
                                                </Link>
                                            </div>
                                        )}

                                        {/* Admin: create artisan accounts */}
                                        {isAdmin && (
                                            <div className="space-y-3">
                                                <button
                                                    onClick={() => setShowCreateForm(!showCreateForm)}
                                                    className="flex items-center gap-2 w-full bg-fiesta-purple text-white
                                                               font-heading text-sm py-2.5 px-4 rounded-xl"
                                                >
                                                    <UserPlus size={16} />
                                                    <T>Crear Cuenta de Artesano</T>
                                                </button>
                                                {showCreateForm && <CreateArtesanoForm />}
                                            </div>
                                        )}

                                        {/* Sign out */}
                                        <button
                                            onClick={async () => { await signOut(); close(); }}
                                            className="flex items-center gap-2 w-full text-gray-500
                                                       font-body text-sm py-2 px-4 rounded-xl
                                                       hover:bg-red-50 hover:text-red-500 transition-colors"
                                        >
                                            <LogOut size={16} /> <T>Cerrar Sesión</T>
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="px-5 py-4 border-t border-gray-100 space-y-2">
                                <div className="flex justify-center gap-3">
                                    <Link href="/terminos" onClick={close}
                                        className="text-xs text-gray-400 font-body hover:text-mexican-pink transition-colors">
                                        <T>Términos</T>
                                    </Link>
                                    <span className="text-xs text-gray-300">·</span>
                                    <Link href="/privacidad" onClick={close}
                                        className="text-xs text-gray-400 font-body hover:text-mexican-pink transition-colors">
                                        <T>Privacidad</T>
                                    </Link>
                                </div>
                                <p className="text-xs text-gray-400 font-body text-center">
                                    Mojigangas App v1.0
                                </p>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
