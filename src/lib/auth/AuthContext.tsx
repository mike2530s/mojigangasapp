/**
 * AuthContext — Session state shared across the app
 *
 * Provides:
 *   user       — Supabase User | null
 *   isAdmin    — true if user_metadata.role === "admin"
 *   isArtesano — true if user_metadata.role === "artesano"
 *   signIn / signOut helpers
 *
 * Onboarding:
 *   Al primer login (SIGNED_IN), verifica si onboarding_user_{id}_done existe.
 *   Si no existe, dispara el Tour B (9 pasos) con Driver.js.
 */

"use client";

import {
    createContext,
    useContext,
    useState,
    useEffect,
    useRef,
    type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";
import { signIn as _signIn, signOut as _signOut } from "@/lib/supabase/auth";
import { isUserDone } from "@/lib/onboarding/useOnboarding";

interface AuthContextValue {
    user: User | null;
    loading: boolean;
    isAdmin: boolean;
    isArtesano: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
    user: null,
    loading: true,
    isAdmin: false,
    isArtesano: false,
    signIn: async () => { },
    signOut: async () => { },
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    // Flag para no relanzar el tour si el componente ya procesó el evento
    const tourTriggered = useRef(false);

    useEffect(() => {
        // Restore session on mount
        supabase.auth.getSession().then(({ data }) => {
            setUser(data.session?.user ?? null);
            setLoading(false);
        });

        // Listen for auth changes (login / logout)
        const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
            const sessionUser = session?.user ?? null;
            setUser(sessionUser);

            // Disparar Tour B solo en el primer login real
            if (event === "SIGNED_IN" && sessionUser && !tourTriggered.current) {
                tourTriggered.current = true;

                if (!isUserDone(sessionUser.id)) {
                    // Detectar idioma guardado o del sistema
                    const savedLang = (localStorage.getItem("lang") as "es" | "en") ?? null;
                    let lang: "es" | "en" = "es";
                    if (savedLang === "es" || savedLang === "en") {
                        lang = savedLang;
                    } else {
                        const browserLang = navigator.language || "es";
                        lang = browserLang.toLowerCase().startsWith("es") ? "es" : "en";
                    }

                    // Delay para dejar que el UI se monte antes del tour
                    setTimeout(async () => {
                        const { driver } = await import("driver.js");
                        const { getUserSteps } = await import("@/lib/onboarding/tourSteps");

                        const steps = getUserSteps(lang);
                        const d = driver({
                            animate: true,
                            smoothScroll: true,
                            allowClose: true,
                            overlayColor: "rgba(26, 26, 26, 0.75)",
                            popoverClass: "mojiganga-tour-popover",
                            nextBtnText: lang === "es" ? "Siguiente →" : "Next →",
                            prevBtnText: lang === "es" ? "← Anterior" : "← Back",
                            doneBtnText: lang === "es" ? "¡Listo! 🎉" : "Done! 🎉",
                            progressText: lang === "es" ? "{{current}} de {{total}}" : "{{current}} of {{total}}",
                            showProgress: true,
                            steps,
                            onDestroyStarted: () => {
                                localStorage.setItem(`onboarding_user_${sessionUser.id}_done`, "true");
                                d.destroy();
                            },
                        });
                        d.drive();
                    }, 800);
                }
            }

            if (event === "SIGNED_OUT") {
                tourTriggered.current = false;
            }
        });

        return () => listener.subscription.unsubscribe();
    }, []);

    const role = user?.user_metadata?.role as string | undefined;
    const isAdmin = role === "admin";
    const isArtesano = role === "artesano";

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                isAdmin,
                isArtesano,
                signIn: async (email, password) => {
                    await _signIn(email, password);
                },
                signOut: async () => {
                    await _signOut();
                    setUser(null);
                },
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
