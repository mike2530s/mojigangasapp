/* eslint-disable @next/next/no-img-element */
/**
 * ArtesanoCard — Tarjeta de perfil de artesano para la lista
 */

"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import type { Artesano } from "@/lib/supabase/artesanos";
import T from "@/lib/i18n/T";

interface ArtesanoCardProps {
    artesano: Artesano;
}

export default function ArtesanoCard({ artesano }: ArtesanoCardProps) {
    return (
        <Link href={`/artesanos/${artesano.id}`}>
            <div className="bg-white rounded-card shadow-hard-sm overflow-hidden hover:shadow-hard group transition-shadow">
                {/* Foto de portada */}
                <div className="relative h-40 overflow-hidden bg-gray-100">
                    {artesano.foto_url ? (
                        <img
                            src={artesano.foto_url}
                            alt={artesano.nombre}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-fiesta-ink to-fiesta-purple flex items-center justify-center">
                            <span className="text-5xl">🎭</span>
                        </div>
                    )}
                    {/* Badge taller */}
                    {artesano.taller && (
                        <span className="absolute top-3 left-3 badge-tape text-xs">
                            {artesano.taller}
                        </span>
                    )}
                </div>

                {/* Info */}
                <div className="p-4">
                    <h3 className="font-heading text-base leading-tight mb-1">{artesano.nombre}</h3>
                    {artesano.ciudad && (
                        <p className="flex items-center gap-1 text-xs text-gray-500 font-body">
                            <MapPin size={11} />
                            {artesano.ciudad}
                        </p>
                    )}
                    {artesano.descripcion && (
                        <p className="text-xs text-gray-600 font-body mt-2 line-clamp-2 leading-relaxed">
                            {artesano.descripcion}
                        </p>
                    )}
                    <span className="inline-block mt-3 text-xs font-heading text-mexican-pink uppercase tracking-wider">
                        <T>Ver perfil →</T>
                    </span>
                </div>
            </div>
        </Link>
    );
}
