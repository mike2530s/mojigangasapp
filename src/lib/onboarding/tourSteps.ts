/**
 * tourSteps — Pasos del tour de onboarding (ES/EN)
 *
 * GUEST_STEPS: 7 pasos para visitantes sin cuenta
 * USER_STEPS:  9 pasos para artesanos/admins (incluye FAB + Taller)
 */

import type { DriveStep } from "driver.js";

export type Lang = "es" | "en";

interface BilingualStep {
    element: string;
    titleEs: string;
    titleEn: string;
    descEs: string;
    descEn: string;
    side?: "top" | "bottom" | "left" | "right";
    align?: "start" | "center" | "end";
}

// ──────────────────────────────────────────────────────────────────────
// Pasos compartidos (1–7) — secciones públicas
// ──────────────────────────────────────────────────────────────────────
const SHARED_STEPS: BilingualStep[] = [
    {
        element: "#nav-home",
        titleEs: "🏠 Inicio",
        titleEn: "🏠 Home",
        descEs: "Tu punto de partida. Aquí encontrarás las mojigangas más recientes y destacadas de la colección.",
        descEn: "Your starting point. Here you'll find the latest and most featured mojigangas from the collection.",
        side: "top",
        align: "center",
    },
    {
        element: "#nav-catalogo",
        titleEs: "🎭 Catálogo",
        titleEn: "🎭 Catalog",
        descEs: "Explora toda la colección de mojigangas. Filtra por artesano, año o región y descubre cada historia.",
        descEn: "Browse the full collection of mojigangas. Filter by artisan, year, or region and discover each story.",
        side: "top",
        align: "center",
    },
    {
        element: "#nav-artesanos",
        titleEs: "🎨 Artesanos",
        titleEn: "🎨 Artisans",
        descEs: "Conoce a los maestros que dan vida a estas figuras. Sus talleres, técnicas y la pasión que hay detrás de cada pieza.",
        descEn: "Meet the masters who bring these figures to life. Their workshops, techniques and the passion behind each piece.",
        side: "top",
        align: "center",
    },
    {
        element: "#nav-mapa",
        titleEs: "📍 Mapa",
        titleEn: "📍 Map",
        descEs: "Descubre en el mapa dónde encontrar mojigangas y eventos culturales cerca de ti.",
        descEn: "Discover on the map where to find mojigangas and cultural events near you.",
        side: "top",
        align: "center",
    },
    {
        element: "#nav-historias",
        titleEs: "📖 Historias",
        titleEn: "📖 Stories",
        descEs: "Relatos reales de la comunidad. Lee y comparte experiencias de quienes aman las mojigangas.",
        descEn: "Real stories from the community. Read and share experiences from people who love mojigangas.",
        side: "top",
        align: "center",
    },
    {
        element: "#nav-cultura",
        titleEs: "❤️ Cultura",
        titleEn: "❤️ Culture",
        descEs: "Aprende sobre el origen, significado y tradición de las mojigangas. Conoce las colaboraciones y patrocinadores del proyecto.",
        descEn: "Learn about the origin, meaning and tradition of mojigangas. Meet the collaborations and sponsors of the project.",
        side: "top",
        align: "center",
    },
    {
        element: "#btn-search",
        titleEs: "🔍 Búsqueda Global",
        titleEn: "🔍 Global Search",
        descEs: "Encuentra rápidamente cualquier artesano, mojiganga o historia usando el buscador. ¡Todo el archivo en un clic!",
        descEn: "Quickly find any artisan, mojiganga or story using the search. The entire archive in one click!",
        side: "bottom",
        align: "end",
    },
];

// ──────────────────────────────────────────────────────────────────────
// Pasos exclusivos para cuentas (8–9)
// ──────────────────────────────────────────────────────────────────────
const ACCOUNT_STEPS: BilingualStep[] = [
    {
        element: "#fab-btn",
        titleEs: "➕ Subir Contenido",
        titleEn: "➕ Upload Content",
        descEs: "Con este botón puedes subir nuevas mojigangas e historias al archivo cultural. Esta función es exclusiva de tu cuenta.",
        descEn: "Use this button to upload new mojigangas and stories to the cultural archive. This feature is exclusive to your account.",
        side: "left",
        align: "end",
    },
    {
        element: "#link-taller",
        titleEs: "🛠️ El Taller",
        titleEn: "🛠️ The Workshop",
        descEs: "Accede al proceso de creación del taller. Aquí puedes documentar y compartir cada etapa de tu trabajo artesanal.",
        descEn: "Access the workshop creation process. Here you can document and share each stage of your artisan work.",
        side: "bottom",
        align: "center",
    },
];

// ──────────────────────────────────────────────────────────────────────
// Convertidor: BilingualStep → DriveStep según idioma
// ──────────────────────────────────────────────────────────────────────
function toDriverStep(step: BilingualStep, lang: Lang): DriveStep {
    return {
        element: step.element,
        popover: {
            title: lang === "es" ? step.titleEs : step.titleEn,
            description: lang === "es" ? step.descEs : step.descEn,
            side: step.side ?? "top",
            align: step.align ?? "center",
        },
    };
}

export function getGuestSteps(lang: Lang): DriveStep[] {
    return SHARED_STEPS.map((s) => toDriverStep(s, lang));
}

export function getUserSteps(lang: Lang): DriveStep[] {
    return [...SHARED_STEPS, ...ACCOUNT_STEPS].map((s) => toDriverStep(s, lang));
}
