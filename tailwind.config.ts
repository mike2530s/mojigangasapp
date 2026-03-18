import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      /* ──────────────────────────────────────────────
       * 🎨  Paleta de colores — Sistema de diseño Mojigangas
       * ────────────────────────────────────────────── */
      colors: {
        "mexican-pink": "#FF005C",
        "fiesta-yellow": "#FFD600",
        "fiesta-cyan": "#00E5FF",
        "fiesta-ink": "#1A1A1A",
        "paper-white": "#F8F5E6",
        "fiesta-purple": "#9C27B0",
      },

      /* ──────────────────────────────────────────────
       * 🔤  Tipografías
       * ────────────────────────────────────────────── */
      fontFamily: {
        display: ["var(--font-playfair)", "Playfair Display", "serif"],
        body: ["var(--font-space)", "Space Grotesk", "sans-serif"],
        heading: ["var(--font-archivo)", "Archivo Black", "sans-serif"],
        marker: ["var(--font-marker)", "Permanent Marker", "cursive"],
      },

      /* ──────────────────────────────────────────────
       * 🌑  Sombras — Estilo "recorte de papel"
       * ────────────────────────────────────────────── */
      boxShadow: {
        hard: "6px 6px 0px #1A1A1A",
        "hard-sm": "4px 4px 0px #1A1A1A",
        "hard-lg": "8px 8px 0px #1A1A1A",
        "hard-pink": "6px 6px 0px #FF005C",
        "hard-yellow": "6px 6px 0px #FFD600",
      },

      /* ──────────────────────────────────────────────
       * 📐  Border radius — Tarjetas redondeadas
       * ────────────────────────────────────────────── */
      borderRadius: {
        card: "1.5rem", // rounded-3xl equivalente
      },

      /* ──────────────────────────────────────────────
       * ✨  Animaciones personalizadas
       * ────────────────────────────────────────────── */
      keyframes: {
        "slide-up": {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "polaroid-tilt": {
          "0%": { transform: "rotate(0deg)", opacity: "0" },
          "100%": { transform: "rotate(-2deg)", opacity: "1" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "slide-up": "slide-up 0.4s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "scale-in": "scale-in 0.3s ease-out",
        "polaroid-tilt": "polaroid-tilt 0.5s ease-out forwards",
        shimmer: "shimmer 1.6s infinite",
      },
    },
  },
  plugins: [],
};

export default config;
