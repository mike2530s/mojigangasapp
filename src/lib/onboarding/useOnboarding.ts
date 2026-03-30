/**
 * useOnboarding — Hook central del sistema de onboarding
 *
 * - Detecta si el tour ya fue visto (localStorage)
 * - Diferencia tour de visitante (guest) vs. usuario con cuenta
 * - Exporta startGuestTour(), startUserTour(userId), resetTour()
 * - Driver.js se importa dinámicamente (SSR-safe en Next.js 14)
 */

"use client";

import { useCallback } from "react";
import { getGuestSteps, getUserSteps, type Lang } from "./tourSteps";

const GUEST_KEY = "onboarding_guest_done";

function userKey(userId: string) {
    return `onboarding_user_${userId}_done`;
}

/** Detecta si el onboarding de visitante ya fue completado */
export function isGuestDone(): boolean {
    if (typeof window === "undefined") return true;
    return localStorage.getItem(GUEST_KEY) === "true";
}

/** Detecta si el onboarding de usuario fue completado */
export function isUserDone(userId: string): boolean {
    if (typeof window === "undefined") return true;
    return localStorage.getItem(userKey(userId)) === "true";
}

/** Lanza Driver.js con los pasos dados */
async function launchDriver(steps: ReturnType<typeof getGuestSteps>, lang: Lang) {
    // Importación dinámica → evita SSR crash
    const { driver } = await import("driver.js");

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
    });

    d.drive();
    return d;
}

export function useOnboarding() {
    /** Tour A — Visitantes (7 pasos) */
    const startGuestTour = useCallback(async (lang: Lang) => {
        if (typeof window === "undefined") return;
        const steps = getGuestSteps(lang);
        await launchDriver(steps, lang);
        localStorage.setItem(GUEST_KEY, "true");
    }, []);

    /** Tour B — Cuentas (9 pasos) */
    const startUserTour = useCallback(async (userId: string, lang: Lang) => {
        if (typeof window === "undefined") return;
        const steps = getUserSteps(lang);
        await launchDriver(steps, lang);
        localStorage.setItem(userKey(userId), "true");
    }, []);

    /** Reinicia ambos tours (usado desde Acerca De) */
    const resetTour = useCallback(() => {
        if (typeof window === "undefined") return;
        // Eliminar todas las keys de onboarding
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && (key === GUEST_KEY || key.startsWith("onboarding_user_"))) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach((k) => localStorage.removeItem(k));
    }, []);

    return { startGuestTour, startUserTour, resetTour, isGuestDone, isUserDone };
}
