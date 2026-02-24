/**
 * ➕ FloatingButton — Botón flotante de acción (FAB)
 *
 * Botón rosa mexicano fijo en la esquina inferior derecha,
 * sobre el BottomNav. Usado para "Subir Historia" en la
 * pantalla de Historias.
 */

"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import Link from "next/link";

interface FloatingButtonProps {
    href?: string;
    onClick?: () => void;
}

export default function FloatingButton({ href = "/subir", onClick }: FloatingButtonProps) {
    const button = (
        <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-14 h-14 rounded-full bg-mexican-pink text-white
                 flex items-center justify-center shadow-hard
                 cursor-pointer"
            onClick={onClick}
        >
            <Plus size={28} strokeWidth={2.5} />
        </motion.div>
    );

    if (href) {
        return (
            <div className="fixed bottom-24 right-5 z-40">
                <Link href={href}>{button}</Link>
            </div>
        );
    }

    return <div className="fixed bottom-24 right-5 z-40">{button}</div>;
}
