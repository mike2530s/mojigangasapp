"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

/**
 * PageTransition — Wraps any page content with a fade animation.
 * Use in individual page files: wrap your main JSX with <PageTransition>.
 * 
 * Respects prefers-reduced-motion automatically via Framer Motion.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
        >
            {children}
        </motion.div>
    );
}
