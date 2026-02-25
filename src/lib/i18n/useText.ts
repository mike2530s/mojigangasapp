/**
 * useText — Auto-translation hook
 *
 * Usage:
 *   const title = useText("El Taller")
 *   // → "El Taller"   when lang === "es"
 *   // → "The Workshop" when lang === "en"  (fetched via MyMemory API + cached)
 *
 * For JSX content prefer the <T> component in T.tsx.
 * For string attributes (placeholder, aria-label) use this hook directly.
 */

"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "./LangContext";
import { translate } from "./myMemory";

export function useText(spanishText: string): string {
    const { lang } = useTranslation();
    const [text, setText] = useState(spanishText);

    useEffect(() => {
        if (lang === "es") {
            setText(spanishText);
            return;
        }

        // EN — try to get translation
        translate(spanishText).then(setText);
    }, [lang, spanishText]);

    return text;
}
