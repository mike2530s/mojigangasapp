/**
 * 🔌 Service Worker Initializer
 * 
 * Registra el SW en el navegador y maneja actualizaciones
 */

"use client";

import { useEffect } from "react";

export function ServiceWorkerInit() {
  useEffect(() => {
    /* Solo funciona en navegadores modernos */
    if (!("serviceWorker" in navigator)) {
      console.log("[SW] Service Workers no soportados en este navegador");
      return;
    }

    /* Registrar Service Worker */
    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then((registration) => {
        console.log("[SW] ✅ Service Worker registrado:", registration);

        /* Escuchar actualizaciones */
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                console.log("[SW] 🔄 Nueva versión disponible");
                /* Aquí podrías mostrar un toast: "Actualización disponible" */
              }
            });
          }
        });

        /* Verificar actualizaciones cada hora */
        setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000);
      })
      .catch((err) => {
        console.warn("[SW] ⚠️ Error registrando Service Worker:", err);
      });

    /* Manejar mensajes del SW */
    const handleSWMessage = (event: MessageEvent) => {
      if (event.data?.type === "CLEARED") {
        console.log("[SW] Caché limpiado desde el SW");
      }
    };

    navigator.serviceWorker.addEventListener("message", handleSWMessage);

    return () => {
      navigator.serviceWorker.removeEventListener("message", handleSWMessage);
    };
  }, []);

  return null;
}
