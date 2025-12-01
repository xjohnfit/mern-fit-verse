/**
 * Utility function to add cache-busting query parameter to image URLs
 * This forces browsers (especially mobile) to reload updated images
 * instead of showing cached versions
 *
 * @param photoUrl - The original photo URL
 * @param bustCache - Whether to add timestamp (default: true)
 * @returns Photo URL with cache-busting timestamp
 */
export function addCacheBuster(
    photoUrl: string | undefined,
    bustCache: boolean = true
): string {
    if (!photoUrl) return '';
    if (!bustCache) return photoUrl;

    // Check if URL already has a timestamp parameter
    if (photoUrl.includes('?t=') || photoUrl.includes('&t=')) {
        return photoUrl;
    }

    const separator = photoUrl.includes('?') ? '&' : '?';
    return `${photoUrl}${separator}t=${Date.now()}`;
}

/**
 * Get a photo URL with cache-busting
 * Alias for addCacheBuster for better semantic meaning
 */
export const getPhotoUrl = addCacheBuster;
