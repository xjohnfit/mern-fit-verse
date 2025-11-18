import { Coffee, Sun, Cookie, Moon } from 'lucide-react';
import { type MealCategory, type MealCategoryConfig } from './types';

/**
 * Base configuration for meal categories
 */
export const mealCategoriesConfig: Record<MealCategory, MealCategoryConfig> = {
    breakfast: {
        name: 'Breakfast',
        icon: Coffee,
        color: 'from-amber-500 to-orange-500',
    },
    lunch: {
        name: 'Lunch',
        icon: Sun,
        color: 'from-yellow-500 to-amber-500',
    },
    snack: {
        name: 'Snack',
        icon: Cookie,
        color: 'from-pink-500 to-rose-500',
    },
    dinner: {
        name: 'Dinner',
        icon: Moon,
        color: 'from-indigo-500 to-purple-500',
    },
};

/**
 * Available colors for custom meal categories
 */
export const availableColors = [
    'from-cyan-500 to-blue-500',
    'from-lime-500 to-green-500',
    'from-red-500 to-pink-500',
    'from-violet-500 to-purple-500',
    'from-fuchsia-500 to-pink-500',
    'from-emerald-500 to-teal-500',
];