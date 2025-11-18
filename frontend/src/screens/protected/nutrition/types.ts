import { type LucideIcon } from 'lucide-react';

export type MealCategory = 'breakfast' | 'lunch' | 'snack' | 'dinner';

export interface MealCategoryConfig {
    name: string;
    icon: LucideIcon;
    color: string;
}

export interface MealCategoryData extends MealCategoryConfig {
    foods: NutritionEntry[];
    isCustom?: boolean;
}

export interface CustomCategory {
    id: string;
    name: string;
    icon: LucideIcon;
    color: string;
    foods: NutritionEntry[];
}

export interface NutritionEntry {
    _id: string;
    foodItem: string;
    mealCategory: string;
    customCategoryId?: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    date: string;
    createdAt: string;
    updatedAt: string;
}

export interface NutritionTotals {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
}

export interface DailyNutritionData {
    success: boolean;
    data: {
        entries: NutritionEntry[];
        totals: NutritionTotals;
        date: string;
    };
}

export interface GoalValues {
    calories: string;
    protein: string;
    carbs: string;
    fats: string;
}

export interface NutritionGoals {
    calories?: number;
    protein?: number;
    carbs?: number;
    fats?: number;
}

export interface FoodSearchResult {
    food_id: string;
    food_name: string;
    food_description: string;
    food_type: string;
    brand_name?: string;
}

export interface AddFoodData {
    foodItem: string;
    mealCategory: string;
    customCategoryId?: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
}
