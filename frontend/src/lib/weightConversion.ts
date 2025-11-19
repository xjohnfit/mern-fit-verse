/**
 * Convert weight from pounds to kilograms
 * @param lbs - Weight in pounds
 * @returns Weight in kilograms (rounded to 2 decimal places)
 */
export const lbsToKg = (lbs: number): number => {
    return Math.round(lbs * 0.453592 * 100) / 100;
};

/**
 * Convert weight from kilograms to pounds
 * @param kg - Weight in kilograms
 * @returns Weight in pounds (rounded to 2 decimal places)
 */
export const kgToLbs = (kg: number): number => {
    return Math.round(kg * 2.20462 * 100) / 100;
};

/**
 * Format weight value with unit label
 * @param weight - Weight value
 * @param unit - Weight unit ('kg' or 'lbs')
 * @returns Formatted string with weight and unit (rounded to 1 decimal place)
 */
export const formatWeight = (weight: number, unit: string): string => {
    return `${weight.toFixed(1)} ${unit}`;
};
