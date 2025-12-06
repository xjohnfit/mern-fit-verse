import { CheckCircle, Plus } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { MealCategoryCard } from './MealCategoryCard';
import { AddCustomCategoryModal } from './AddCustomCategoryModal';

type MealCategory = 'breakfast' | 'lunch' | 'snack' | 'dinner';

interface FoodEntry {
    _id: string;
    foodItem: string;
    calories: number;
}

interface MealCategoryData {
    name: string;
    icon: LucideIcon;
    color: string;
    foods: FoodEntry[];
}

interface CustomCategory {
    id: string;
    name: string;
    icon: LucideIcon;
    color: string;
    foods: FoodEntry[];
}

interface TodaysMealsSectionProps {
    mealCategories: Record<MealCategory, MealCategoryData>;
    customCategories: CustomCategory[];
    showAddCategoryModal: boolean;
    setShowAddCategoryModal: (show: boolean) => void;
    newCategoryName: string;
    setNewCategoryName: (name: string) => void;
    onAddCustomCategory: () => void;
    onRemoveCustomCategory: (categoryId: string) => void;
    onDeleteFoodEntry: (entryId: string) => void;
    onFoodSelect: (category: string, categoryId?: string) => void;
}

export const TodaysMealsSection = ({
    mealCategories,
    customCategories,
    showAddCategoryModal,
    setShowAddCategoryModal,
    newCategoryName,
    setNewCategoryName,
    onAddCustomCategory,
    onRemoveCustomCategory,
    onDeleteFoodEntry,
    onFoodSelect
}: TodaysMealsSectionProps) => {
    return (
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-amber-500" />
                    Today's Meals
                </h2>
                {customCategories.length < 3 && (
                    <button
                        onClick={() => setShowAddCategoryModal(true)}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 hover:bg-amber-100 dark:hover:bg-amber-900/50 rounded-lg transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Add Category
                    </button>
                )}
            </div>

            {/* Add Category Modal */}
            <AddCustomCategoryModal
                showModal={showAddCategoryModal}
                newCategoryName={newCategoryName}
                setNewCategoryName={setNewCategoryName}
                onAdd={onAddCustomCategory}
                onClose={() => {
                    setShowAddCategoryModal(false);
                    setNewCategoryName('');
                }}
                currentCount={customCategories.length}
                maxCount={3}
            />

            {/* Meal Categories */}
            <div className="space-y-4">
                {/* Default Categories */}
                {(Object.entries(mealCategories) as [MealCategory, MealCategoryData][]).map(([key, category]) => (
                    <MealCategoryCard
                        key={key}
                        name={category.name}
                        icon={category.icon}
                        color={category.color}
                        foods={category.foods}
                        onDeleteFood={onDeleteFoodEntry}
                        onAddClick={() => onFoodSelect(key)}
                    />
                ))}

                {/* Custom Categories */}
                {customCategories.map((category) => (
                    <MealCategoryCard
                        key={category.id}
                        name={category.name}
                        icon={category.icon}
                        color={category.color}
                        foods={category.foods}
                        isCustom={true}
                        categoryId={category.id}
                        onDeleteFood={onDeleteFoodEntry}
                        onRemoveCategory={onRemoveCustomCategory}
                        onAddClick={() => onFoodSelect('custom', category.id)}
                    />
                ))}
            </div>
        </div>
    );
};
