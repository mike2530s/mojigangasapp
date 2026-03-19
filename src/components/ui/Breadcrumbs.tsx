/**
 * Breadcrumbs — Miga de pan para páginas profundas
 *
 * Recibe un array de { label, href? }.
 * El último item es la página actual (sin enlace, en negrita).
 */

"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    className?: string;
}

export default function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
    if (items.length < 2) return null;

    return (
        <nav
            aria-label="Ruta de navegación"
            className={`flex items-center flex-wrap gap-1 text-xs font-body ${className}`}
        >
            {items.map((item, i) => {
                const isLast = i === items.length - 1;
                return (
                    <span key={i} className="flex items-center gap-1">
                        {isLast ? (
                            <span className="text-fiesta-ink font-heading truncate max-w-[160px]" aria-current="page">
                                {item.label}
                            </span>
                        ) : (
                            <Link
                                href={item.href ?? "#"}
                                className="text-gray-400 hover:text-mexican-pink transition-colors truncate max-w-[120px]"
                            >
                                {item.label}
                            </Link>
                        )}
                        {!isLast && (
                            <ChevronRight size={12} className="text-gray-300 flex-shrink-0" />
                        )}
                    </span>
                );
            })}
        </nav>
    );
}
