import { X, Plus } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface FoodEntry {
    _id: string;
    foodItem: string;
    calories: number;
}

interface MealCategoryCardProps {
    name: string;
    icon: LucideIcon;
    color: string;
    foods: FoodEntry[];
    isCustom?: boolean;
    categoryId?: string;
    onDeleteFood: (entryId: string) => void;
    onRemoveCategory?: (categoryId: string) => void;
    onAddClick?: () => void;
}

export const MealCategoryCard = ({
    name,
    icon: Icon,
    color,
    foods,
    isCustom = false,
    categoryId,
    onDeleteFood,
    onRemoveCategory,
    onAddClick
}: MealCategoryCardProps) => {
    return (
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-md transition-all duration-200 relative">
            {/* Category Header */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div className={`inline-flex items-center justify-center w-8 h-8 bg-linear-to-r ${color} rounded-lg`}>
                        <Icon className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                        {name}
                    </h3>
                    {isCustom && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                            Custom
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {onAddClick && (
                        <button
                            onClick={onAddClick}
                            className="p-1.5 rounded-lg bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                            title={`Add food to ${name}`}
                        >
                            <Plus className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </button>
                    )}
                    {isCustom && categoryId && onRemoveCategory && (
                        <button
                            onClick={() => onRemoveCategory(categoryId)}
                            className="p-1.5 rounded-lg bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                            title={`Remove ${name}`}
                        >
                            <X className="w-4 h-4 text-red-600 dark:text-red-400" />
                        </button>
                    )}
                </div>
            </div>

            {/* Foods List */}
            {foods.length > 0 ? (
                <div className="space-y-2">
                    {foods.map((food, idx) => (
                        <div
                            key={food._id || idx}
                            className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg group"
                        >
                            <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{food.foodItem}</span>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500 dark:text-gray-400">{food.calories.toFixed(0)} cal</span>
                                <button
                                    onClick={() => onDeleteFood(food._id)}
                                    className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 transition-all"
                                    title="Delete food entry"
                                >
                                    <X className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-2">
                    No items added
                </p>
            )}
        </div>
    );
};
