/**
 * 🎭 Layout Global — Mojigangas: Tradición Viva
 *
 * Este layout envuelve todas las páginas de la app.
 * - Carga las 4 fuentes del sistema de diseño vía next/font/google
 *   (optimizadas automáticamente por Next.js, sin CLS).
 * - Define metadata SEO + PWA.
 * - Inyecta globals.css con Tailwind y el sistema visual.
 */

import type { Metadata, Viewport } from "next";
import { Playfair_Display, Space_Grotesk, Archivo_Black, Permanent_Marker } from "next/font/google";
import BottomNav from "@/components/navigation/BottomNav";
import "./globals.css";

/* ── Fuentes optimizadas por Next.js ─────────────────── */

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "700", "900"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const archivoBlack = Archivo_Black({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
  weight: "400",
});

const permanentMarker = Permanent_Marker({
  subsets: ["latin"],
  variable: "--font-marker",
  display: "swap",
  weight: "400",
});

/* ── Metadata SEO y PWA ──────────────────────────────── */

export const metadata: Metadata = {
  title: "Mojigangas: Tradición Viva",
  description:
    "Plataforma cultural para preservar la tradición de las Mojigangas mexicanas. Archivo cultural, historias comunitarias y red de artesanos.",
  keywords: ["mojigangas", "tradición", "México", "arte popular", "artesanos", "cultura"],
  authors: [{ name: "Almas de Cartón" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Mojigangas",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#FF005C",
};

/* ── Root Layout ─────────────────────────────────────── */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`
        ${playfair.variable}
        ${spaceGrotesk.variable}
        ${archivoBlack.variable}
        ${permanentMarker.variable}
      `}
    >
      <body className="font-body antialiased bg-paper-white text-fiesta-ink">
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
