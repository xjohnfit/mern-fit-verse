/**
 * Formats a date from MongoDB format to MM/DD/YYYY
 * @param dateString - The date string from MongoDB (e.g., "2023-10-27T10:30:00.000Z")
 * @returns Formatted date string in MM/DD/YYYY format
 */
export const formatDateToMMDDYYYY = (dateString: string | Date): string => {
    try {
        const date = new Date(dateString);

        // Check if the date is valid
        if (isNaN(date.getTime())) {
            return '';
        }

        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const year = date.getFullYear();

        return `${month}/${day}/${year}`;
    } catch (error) {
        console.error('Error formatting date:', error);
        return '';
    }
};

export const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
        return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
        return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString();
};

/**
 * Formats a date to YYYY-MM-DD format for API calls
 * @param date - The date object to format
 * @returns Formatted date string in YYYY-MM-DD format
 */
export const formatDateForAPI = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};
