/**
 * LangContext — Language state manager
 *
 * Simplified: only stores lang + setLang.
 * Translation is handled automatically by useText() / <T> via MyMemory API.
 *
 * Usage:
 *   const { lang, setLang } = useTranslation();
 */

"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type Lang = "es" | "en";

interface LangContextValue {
    lang: Lang;
    setLang: (lang: Lang) => void;
}

const LangContext = createContext<LangContextValue>({
    lang: "es",
    setLang: () => { },
});

export function LangProvider({ children }: { children: ReactNode }) {
    const [lang, setLangState] = useState<Lang>("es");

    /* Restore language on mount */
    useEffect(() => {
        const saved = localStorage.getItem("lang") as Lang | null;
        if (saved === "es" || saved === "en") setLangState(saved);
    }, []);

    const setLang = (newLang: Lang) => {
        setLangState(newLang);
        localStorage.setItem("lang", newLang);
    };

    return (
        <LangContext.Provider value={{ lang, setLang }}>
            {children}
        </LangContext.Provider>
    );
}

/** Hook to access lang and setLang */
export function useTranslation() {
    return useContext(LangContext);
}
