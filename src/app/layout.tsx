/**
 * Layout Global — Mojigangas: Tradicion Viva
 *
 * Envuelve todas las paginas. Provee:
 * - 4 Google Fonts optimizadas
 * - Metadata SEO + PWA
 * - LangProvider para soporte ES/EN
 */

import type { Metadata, Viewport } from "next";
import { Playfair_Display, Space_Grotesk, Archivo_Black, Permanent_Marker } from "next/font/google";
import BottomNav from "@/components/navigation/BottomNav";
import ConsentBanner from "@/components/ConsentBanner";
import SplashScreen from "@/components/ui/SplashScreen";
import ScrollToTop from "@/components/ui/ScrollToTop";
import FAB from "@/components/ui/FAB";
import { LangProvider } from "@/lib/i18n/LangContext";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { Toaster } from "sonner";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "Mojigangas: Tradicion Viva",
  description:
    "Plataforma cultural para preservar la tradicion de las Mojigangas mexicanas. Archivo cultural, historias comunitarias y red de artesanos.",
  keywords: ["mojigangas", "tradicion", "Mexico", "arte popular", "artesanos", "cultura"],
  authors: [{ name: "Almas de Carton" }],
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
        <LangProvider>
          <AuthProvider>
            <Toaster position="top-center" richColors />
            <SplashScreen />
            {children}
            <FAB />
            <ScrollToTop />
            <BottomNav />
            <ConsentBanner />
          </AuthProvider>
        </LangProvider>
      </body>
    </html>
  );
}
