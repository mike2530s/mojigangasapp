"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps {
    className?: string;
}

/** Bloque base de skeleton — pulso suave con gradiente shimmer */
export function Skeleton({ className }: SkeletonProps) {
    return (
        <div
            className={cn(
                "relative overflow-hidden bg-gray-100 rounded-lg",
                "before:absolute before:inset-0",
                "before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent",
                "before:animate-shimmer",
                className
            )}
        />
    );
}

/** Skeleton para una tarjeta Polaroid del catálogo */
export function PolaroidSkeleton() {
    return (
        <div className="flex flex-col gap-2">
            <div className="bg-white p-3 pb-6 shadow-hard rounded-lg">
                <Skeleton className="aspect-[3/4] w-full rounded" />
            </div>
            <Skeleton className="h-4 w-3/4 mx-auto" />
        </div>
    );
}

/** Skeleton para un PostCard de historias */
export function PostCardSkeleton() {
    return (
        <div className="bg-white rounded-card shadow-hard-sm overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-3 p-4">
                <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                <div className="flex-1 flex flex-col gap-2">
                    <Skeleton className="h-3 w-32" />
                    <Skeleton className="h-3 w-20" />
                </div>
            </div>
            {/* Image */}
            <Skeleton className="w-full aspect-square rounded-none" />
            {/* Caption */}
            <div className="p-4 flex flex-col gap-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-4/5" />
                <Skeleton className="h-3 w-2/3" />
            </div>
        </div>
    );
}

/** Skeleton para una tarjeta de evento/desfile en el mapa */
export function EventCardSkeleton() {
    return (
        <div className="bg-white rounded-xl p-4 shadow-hard-sm flex gap-3 items-start">
            <Skeleton className="w-10 h-10 rounded-full shrink-0" />
            <div className="flex-1 flex flex-col gap-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-2/3 mt-1" />
            </div>
        </div>
    );
}

/** Skeleton para la tarjeta Hero del Home */
export function HeroSkeleton() {
    return (
        <div className="mx-5 rounded-2xl overflow-hidden shadow-hard">
            <Skeleton className="w-full aspect-[4/5]" />
        </div>
    );
}

/** Skeleton para el StoriesRow */
export function StoriesRowSkeleton() {
    return (
        <div className="flex gap-5 px-5 py-2">
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex flex-col items-center gap-1.5 flex-shrink-0">
                    <Skeleton className="w-16 h-16 rounded-full" />
                    <Skeleton className="h-3 w-12" />
                </div>
            ))}
        </div>
    );
}
