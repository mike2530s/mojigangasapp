/**
 * MyMemory Translation Client
 *
 * Free REST API — no API key required.
 * Docs: https://mymemory.translated.net/doc/spec.php
 *
 * Limits (anonymous): ~100 req/day per IP
 * With email param: ~1000 req/day
 * All results are cached in localStorage so each phrase is only fetched once.
 */

const CACHE_PREFIX = "mmt_";
const API_BASE = "https://api.mymemory.translated.net/get";
const SOURCE_LANG = "es";
const TARGET_LANG = "en";

/** In-memory map to avoid duplicate concurrent fetches for the same key */
const inflight = new Map<string, Promise<string>>();

/**
 * Translate a Spanish string to English.
 * Returns the Spanish original on error.
 */
export async function translate(text: string): Promise<string> {
    if (!text || !text.trim()) return text;

    const cacheKey = CACHE_PREFIX + text;

    // 1. Check localStorage cache
    try {
        const cached = localStorage.getItem(cacheKey);
        if (cached) return cached;
    } catch {
        // localStorage not available (SSR), continue
    }

    // 2. Deduplicate concurrent requests for the same text
    if (inflight.has(text)) {
        return inflight.get(text)!;
    }

    // 3. Fetch from MyMemory API
    const promise = (async () => {
        try {
            const url = `${API_BASE}?q=${encodeURIComponent(text)}&langpair=${SOURCE_LANG}|${TARGET_LANG}`;
            const res = await fetch(url);
            const json = await res.json();

            const translated: string = json?.responseData?.translatedText ?? text;

            // Fallback if response is bad
            const result = translated && translated !== "QUERY LENGTH LIMIT EXCEDEED"
                ? translated
                : text;

            // Store in localStorage so we never fetch this string again
            try {
                localStorage.setItem(cacheKey, result);
            } catch {
                // Ignore storage quota errors
            }

            return result;
        } catch {
            // Network error — fall back to original Spanish
            return text;
        } finally {
            inflight.delete(text);
        }
    })();

    inflight.set(text, promise);
    return promise;
}
