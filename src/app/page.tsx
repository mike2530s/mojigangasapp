/**
 * 🔀 Página raíz — Redirige a /home
 *
 * La landing de "/" no tiene contenido propio;
 * simplemente envía al usuario a la pantalla principal.
 */

import { redirect } from "next/navigation";

export default function RootPage() {
  redirect("/home");
}
