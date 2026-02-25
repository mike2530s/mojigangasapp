/**
 * <T> — Auto-translation component
 *
 * Convenience wrapper around useText for inline JSX text.
 *
 * Usage:
 *   <h1><T>El Taller</T></h1>
 *   <span><T>Proceso Artesanal</T></span>
 *
 * The component renders the Spanish text immediately, then
 * swaps to the translated string once it is available.
 */

"use client";

import { useText } from "./useText";

interface TProps {
    children: string;
}

export default function T({ children }: TProps) {
    const text = useText(children);
    return <>{text}</>;
}
