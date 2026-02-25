/**
 * AuthContext — Session state shared across the app
 *
 * Provides:
 *   user       — Supabase User | null
 *   isAdmin    — true if user_metadata.role === "admin"
 *   isArtesano — true if user_metadata.role === "artesano"
 *   signIn / signOut helpers
 */

"use client";

import {
    createContext,
    useContext,
    useState,
    useEffect,
    type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";
import { signIn as _signIn, signOut as _signOut } from "@/lib/supabase/auth";

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

    useEffect(() => {
        // Restore session on mount
        supabase.auth.getSession().then(({ data }) => {
            setUser(data.session?.user ?? null);
            setLoading(false);
        });

        // Listen for auth changes (login / logout)
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
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
