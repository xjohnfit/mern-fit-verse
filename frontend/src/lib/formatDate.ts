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
            console.warn('Invalid date provided:', dateString);
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

/**
 * Formats a date from MongoDB format to YYYY-MM-DD (for HTML date inputs)
 * @param dateString - The date string from MongoDB (e.g., "2023-10-27T10:30:00.000Z")
 * @returns Formatted date string in YYYY-MM-DD format
 */
export const formatDateToInputValue = (dateString: string | Date): string => {
    if (!dateString) return '';

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';

    // Instead of shifting by timezone, just get the UTC year, month, day
    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = date.getUTCDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`; // pure "YYYY-MM-DD"
};

// Parses a date string from an HTML date input (YYYY-MM-DD) to a Date object in UTC
export const parseInputDateToUTC = (inputValue: string): Date | null => {
    try {
        if (!inputValue) return null; // empty field

        // Split YYYY-MM-DD
        const [year, month, day] = inputValue.split('-').map(Number);

        // Create a Date at midnight UTC (not local!)
        const utcDate = new Date(Date.UTC(year, month - 1, day));

        return utcDate;
    } catch (error) {
        console.error('Error parsing input date to UTC:', error);
        return null;
    }
};

/**
 * Formats a date to a human-readable string
 * @param dateString - The date string from MongoDB
 * @returns Formatted date string (e.g., "October 27, 2023")
 */
export const formatDateToLongFormat = (dateString: string | Date): string => {
    try {
        const date = new Date(dateString);

        // Check if the date is valid
        if (isNaN(date.getTime())) {
            console.warn('Invalid date provided:', dateString);
            return '';
        }

        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    } catch (error) {
        console.error('Error formatting date to long format:', error);
        return '';
    }
};

/**
 * Calculates age from a date of birth
 * @param dobString - The date of birth string from MongoDB
 * @returns Age in years
 */
export const calculateAge = (dobString: string | Date): number => {
    try {
        const dob = new Date(dobString);

        // Check if the date is valid
        if (isNaN(dob.getTime())) {
            console.warn(
                'Invalid date provided for age calculation:',
                dobString
            );
            return 0;
        }

        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();

        if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < dob.getDate())
        ) {
            age--;
        }

        return age;
    } catch (error) {
        console.error('Error calculating age:', error);
        return 0;
    }
};

/**
 * Checks if a date string is valid
 * @param dateString - The date string to validate
 * @returns boolean indicating if the date is valid
 */
export const isValidDate = (dateString: string | Date): boolean => {
    try {
        const date = new Date(dateString);
        return !isNaN(date.getTime());
    } catch (error) {
        return false;
    }
};
