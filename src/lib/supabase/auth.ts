/**
 * Auth Functions — Supabase Auth helpers
 *
 * signIn / signOut / createArtesanoAccount (admin only)
 * Admin is identified by user_metadata.role === "admin"
 */

import { supabase } from "./client";

/** Sign in with email + password */
export async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data.user;
}

/** Sign out */
export async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}

/** Get current session */
export async function getSession() {
    const { data } = await supabase.auth.getSession();
    return data.session;
}

/**
 * Create a new artesano account (admin only).
 * Uses signUp — the admin is responsible for sharing credentials.
 * Also creates the artesano profile row.
 */
export async function createArtesanoAccount(params: {
    email: string;
    password: string;
    nombre: string;
    taller: string;
    ciudad: string;
}) {
    // 1. Create auth user
    const { data, error } = await supabase.auth.signUp({
        email: params.email,
        password: params.password,
        options: {
            data: { role: "artesano", nombre: params.nombre },
        },
    });
    if (error) throw error;

    // 2. Insert artesano profile row
    if (data.user) {
        const { error: profError } = await supabase.from("artesanos").insert({
            id: data.user.id,        // same ID as auth user
            nombre: params.nombre,
            taller: params.taller,
            ciudad: params.ciudad,
        });
        if (profError) throw profError;
    }

    return data.user;
}
