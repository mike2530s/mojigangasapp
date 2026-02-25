/**
 * Supabase Storage — Utilidades para subir imágenes de mojigangas
 *
 * Flujo:
 * 1. Comprimir imagen client-side → WebP, máx 1200px, calidad 80%
 * 2. Subir a bucket `mojigangas-fotos` en Supabase Storage
 * 3. Retornar URL pública
 *
 * Requisitos para el bucket (crear en Supabase Dashboard):
 *   - Nombre: mojigangas-fotos
 *   - Public: true
 *   - Allowed MIME types: image/webp, image/jpeg, image/png
 *   - Max file size: 5MB (después de comprimir queda ~200-400KB)
 */

import { supabase } from "./client";

const BUCKET = "mojigangas-fotos";
const MAX_PX = 1200;   // máx dimensión
const QUALITY = 0.82;  // calidad WebP (0-1)

/**
 * Comprime una imagen a WebP y sube a Supabase Storage.
 * Retorna la URL pública del archivo.
 */
export async function uploadMojigangaPhoto(
    file: File,
    artesanoId: string,
    mojigangaNombre: string,
    index: number
): Promise<string> {
    // 1. Comprimir con Canvas
    const compressed = await compressToWebP(file);

    // 2. Generar nombre de archivo único
    const slug = mojigangaNombre
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
    const fileName = `${artesanoId}/${slug}-${Date.now()}-${index}.webp`;

    // 3. Subir a Supabase Storage
    const { error } = await supabase.storage
        .from(BUCKET)
        .upload(fileName, compressed, {
            contentType: "image/webp",
            upsert: false,
        });
    if (error) throw error;

    // 4. Obtener URL pública
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
    return data.publicUrl;
}

/**
 * Comprime un File de imagen a WebP usando Canvas.
 * Reescala si excede MAX_PX en cualquier dimensión.
 */
function compressToWebP(file: File): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(url);

            // Calcular dimensiones de salida
            let { width, height } = img;
            if (width > MAX_PX || height > MAX_PX) {
                if (width > height) {
                    height = Math.round((height * MAX_PX) / width);
                    width = MAX_PX;
                } else {
                    width = Math.round((width * MAX_PX) / height);
                    height = MAX_PX;
                }
            }

            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            if (!ctx) return reject(new Error("Canvas no disponible"));

            ctx.drawImage(img, 0, 0, width, height);
            canvas.toBlob(
                (blob) => {
                    if (blob) resolve(blob);
                    else reject(new Error("Error al comprimir imagen"));
                },
                "image/webp",
                QUALITY
            );
        };

        img.onerror = () => reject(new Error("Error al cargar imagen"));
        img.src = url;
    });
}
