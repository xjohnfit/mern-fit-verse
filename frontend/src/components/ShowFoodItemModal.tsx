import { useState } from "react";
import { Loader2, PlusCircle, X, Scale, UtensilsCrossed } from "lucide-react";

interface ShowFoodItemModalProps {
    selectedFood: string;
    handleCancel: () => void;
    handleAddFood: () => void;
    isSearching: boolean;
    isLoadingDetails: boolean;
    foodDetails: any;
}

const ShowFoodItemModal = ({ selectedFood, handleCancel, handleAddFood, isSearching, isLoadingDetails, foodDetails }: ShowFoodItemModalProps) => {
    const [grams, setGrams] = useState<string>('100');
    const [mealType, setMealType] = useState<string>('Breakfast');

    // Calculate adjusted nutrition values based on grams
    const calculateAdjustedValue = (baseValue: string | number, baseGrams: number) => {
        const gramsNum = parseFloat(grams) || 100;
        const base = parseFloat(String(baseValue)) || 0;
        return ((base / baseGrams) * gramsNum).toFixed(1);
    };

    const handleGramsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Allow only numbers and decimal point
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            setGrams(value);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md relative animate-fade-in border border-gray-200 dark:border-gray-700">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-linear-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                            <PlusCircle className="w-4 h-4 text-white" />
                        </div>
                        <h2 className="text-base font-bold text-gray-900 dark:text-white">Add to Tracker</h2>
                    </div>
                    <button
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                        onClick={handleCancel}
                        aria-label="Close"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                    {/* Food Name */}
                    <div className="text-center pb-2">
                        <p className="text-gray-600 dark:text-gray-400 text-xs mb-1">Selected food</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedFood}</p>
                    </div>

                    {/* Loading or Nutrition Info */}
                    {isSearching || isLoadingDetails ? (
                        <div className="flex flex-col items-center justify-center py-6 space-y-2">
                            <Loader2 className="w-6 h-6 text-green-500 animate-spin" />
                            <p className="text-gray-500 dark:text-gray-400 text-xs">Loading nutrition info...</p>
                        </div>
                    ) : (foodDetails && foodDetails.success && foodDetails.data?.food) ? (
                        (() => {
                            const food = foodDetails.data.food;
                            let serving = food?.servings?.serving;
                            if (Array.isArray(serving)) serving = serving[0];

                            if (serving) {
                                // Extract base serving size in grams (if available)
                                const metricServingUnit = serving.metric_serving_unit || '';
                                const metricServingAmount = parseFloat(serving.metric_serving_amount) || 100;
                                const isPerGram = metricServingUnit.toLowerCase() === 'g';
                                const baseGrams = isPerGram ? metricServingAmount : 100;

                                return (
                                    <div className="space-y-3">
                                        {/* Meal Type Dropdown */}
                                        <div className="space-y-1.5">
                                            <label className="flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-gray-300">
                                                <UtensilsCrossed className="w-3.5 h-3.5 text-green-500" />
                                                Meal Type
                                            </label>
                                            <select
                                                value={mealType}
                                                onChange={(e) => setMealType(e.target.value)}
                                                className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all cursor-pointer"
                                            >
                                                <option value="Breakfast">Breakfast</option>
                                                <option value="Lunch">Lunch</option>
                                                <option value="Dinner">Dinner</option>
                                                <option value="Snack">Snack</option>
                                            </select>
                                        </div>

                                        {/* Gram Input */}
                                        <div className="space-y-1.5">
                                            <label className="flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-gray-300">
                                                <Scale className="w-3.5 h-3.5 text-green-500" />
                                                Amount (grams)
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={grams}
                                                    onChange={handleGramsChange}
                                                    placeholder="100"
                                                    className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                                />
                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-xs font-medium">g</span>
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                Base serving: {serving.serving_description}
                                            </p>
                                        </div>

                                        {/* Nutrition Info Card */}
                                        <div className="bg-linear-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-xl p-3 space-y-2.5">
                                            <h3 className="font-semibold text-green-800 dark:text-green-200 text-sm">Nutrition Facts</h3>

                                            {/* Calories - Prominent Display */}
                                            <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-2.5 border border-green-200/50 dark:border-green-700/50">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-700 dark:text-gray-300 font-medium text-xs">Calories</span>
                                                    <span className="text-xl font-bold text-green-600 dark:text-green-400">
                                                        {calculateAdjustedValue(serving.calories, baseGrams)}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Macros Grid */}
                                            <div className="grid grid-cols-3 gap-2">
                                                <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-2 border border-green-200/50 dark:border-green-700/50">
                                                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-0.5">Protein</div>
                                                    <div className="text-base font-bold text-gray-900 dark:text-white">
                                                        {calculateAdjustedValue(serving.protein, baseGrams)}<span className="text-xs font-normal text-gray-500 dark:text-gray-400 ml-0.5">g</span>
                                                    </div>
                                                </div>
                                                <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-2 border border-green-200/50 dark:border-green-700/50">
                                                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-0.5">Carbs</div>
                                                    <div className="text-base font-bold text-gray-900 dark:text-white">
                                                        {calculateAdjustedValue(serving.carbohydrate, baseGrams)}<span className="text-xs font-normal text-gray-500 dark:text-gray-400 ml-0.5">g</span>
                                                    </div>
                                                </div>
                                                <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-2 border border-green-200/50 dark:border-green-700/50">
                                                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-0.5">Fat</div>
                                                    <div className="text-base font-bold text-gray-900 dark:text-white">
                                                        {calculateAdjustedValue(serving.fat, baseGrams)}<span className="text-xs font-normal text-gray-500 dark:text-gray-400 ml-0.5">g</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            } else {
                                return (
                                    <div className="text-center py-4 px-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                                        <p className="text-xs text-yellow-700 dark:text-yellow-400">No serving information found for this item.</p>
                                    </div>
                                );
                            }
                        })()
                    ) : (
                        <div className="text-center py-4 px-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <p className="text-xs text-red-600 dark:text-red-400">Unable to load nutrition information.</p>
                        </div>
                    )}
                </div>

                {/* Footer Buttons */}
                <div className="flex gap-2 p-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                        className="flex-1 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold transition-colors"
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>
                    <button
                        className="flex-1 px-3 py-2 text-sm bg-linear-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg font-semibold shadow-lg shadow-green-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleAddFood}
                        disabled={isSearching || isLoadingDetails || !foodDetails?.success || !grams || parseFloat(grams) <= 0}
                    >
                        Add to Tracker
                    </button>
                </div>
            </div>
        </div>
    );
};
export default ShowFoodItemModal;