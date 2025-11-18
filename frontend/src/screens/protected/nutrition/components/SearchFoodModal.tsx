import { useState, useEffect } from "react";
import { Loader2, PlusCircle, X, Scale, UtensilsCrossed, Search } from "lucide-react";
import { useGetFoodAutocompleteQuery } from '@/slices/fatSecretApiSlice';

interface CustomCategory {
    id: string;
    name: string;
}

interface SearchFoodModalProps {
    handleCancel: () => void;
    handleAddFood: (nutritionData: {
        foodItem: string;
        mealCategory: string;
        customCategoryId?: string;
        calories: number;
        protein: number;
        carbs: number;
        fats: number;
    }) => void;
    isSearching: boolean;
    isLoadingDetails: boolean;
    foodDetails: any;
    customCategories?: CustomCategory[];
    onFoodSelect: (food: string) => void;
}

export const SearchFoodModal = ({
    handleCancel,
    handleAddFood,
    isSearching,
    isLoadingDetails,
    foodDetails,
    customCategories = [],
    onFoodSelect
}: SearchFoodModalProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedFood, setSelectedFood] = useState<string>('');
    const [amount, setAmount] = useState<string>('1');
    const [servingUnit, setServingUnit] = useState<string>('');
    const [mealType, setMealType] = useState<string>('breakfast');

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Only make API call if we have a search term with at least 2 characters
    const shouldFetch = debouncedSearch.length >= 2;

    const {
        data: autocompleteResponse,
        isLoading: isAutoCompleteLoading,
        isFetching
    } = useGetFoodAutocompleteQuery(
        {
            expression: debouncedSearch,
            max_results: 8,
        },
        {
            skip: !shouldFetch
        }
    );

    const suggestions = autocompleteResponse?.success
        ? autocompleteResponse.data.suggestions?.suggestion || []
        : [];

    const handleSuggestionClick = (suggestion: string) => {
        setSelectedFood(suggestion);
        setSearchTerm(suggestion);
        setShowSuggestions(false);
        setAmount('1');
        onFoodSelect(suggestion);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        setShowSuggestions(value.length >= 2);

        // Reset selected food if user starts typing again
        if (selectedFood && value !== selectedFood) {
            setSelectedFood('');
            setServingUnit('');
        }
    };

    // Calculate adjusted nutrition values based on amount and serving size
    const calculateAdjustedValue = (baseValue: string | number, servingAmount: number) => {
        const amountNum = parseFloat(amount) || 1;
        const base = parseFloat(String(baseValue)) || 0;
        return ((base / servingAmount) * amountNum).toFixed(1);
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Allow only numbers and decimal point
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            setAmount(value);
        }
    };

    const handleAddClick = () => {
        if (!foodDetails?.success || !foodDetails.data?.food) return;

        const food = foodDetails.data.food;
        let serving = food?.servings?.serving;
        if (Array.isArray(serving)) serving = serving[0];

        if (!serving) return;

        // Get serving amount for calculations
        const servingAmount = parseFloat(serving.number_of_units) || 1;

        // Calculate adjusted nutrition values based on the amount entered
        const amountNum = parseFloat(amount) || 1;
        const adjustedCalories = parseFloat(calculateAdjustedValue(serving.calories, servingAmount));
        const adjustedProtein = parseFloat(calculateAdjustedValue(serving.protein, servingAmount));
        const adjustedCarbs = parseFloat(calculateAdjustedValue(serving.carbohydrate, servingAmount));
        const adjustedFats = parseFloat(calculateAdjustedValue(serving.fat, servingAmount));

        // Check if custom category is selected
        const isCustomCategory = mealType.startsWith('custom-');
        const customCategoryId = isCustomCategory ? mealType.replace('custom-', '') : undefined;
        const actualMealCategory = isCustomCategory ? 'custom' : mealType.toLowerCase();

        // Pass data to parent with serving description
        handleAddFood({
            foodItem: `${selectedFood} (${amountNum} ${servingUnit})`,
            mealCategory: actualMealCategory,
            customCategoryId,
            calories: adjustedCalories,
            protein: adjustedProtein,
            carbs: adjustedCarbs,
            fats: adjustedFats,
        });
    };

    // Get current nutrition values (0 if no food selected)
    const getNutritionValues = () => {
        if (!selectedFood || !foodDetails?.success || !foodDetails.data?.food) {
            return {
                calories: '0',
                protein: '0.0',
                carbs: '0.0',
                fats: '0.0',
                servingDescription: 'Select a food item'
            };
        }

        const food = foodDetails.data.food;
        let serving = food?.servings?.serving;
        if (Array.isArray(serving)) serving = serving[0];

        if (!serving) {
            return {
                calories: '0',
                protein: '0.0',
                carbs: '0.0',
                fats: '0.0',
                servingDescription: 'No serving info available'
            };
        }

        // Extract serving size information
        const servingDesc = serving.serving_description || '';
        const servingAmount = parseFloat(serving.number_of_units) || 1;
        const measurementUnit = serving.measurement_description || '';

        // Set the serving unit for the UI
        if (servingUnit === '') {
            setServingUnit(measurementUnit);
        }

        return {
            calories: calculateAdjustedValue(serving.calories, servingAmount),
            protein: calculateAdjustedValue(serving.protein, servingAmount),
            carbs: calculateAdjustedValue(serving.carbohydrate, servingAmount),
            fats: calculateAdjustedValue(serving.fat, servingAmount),
            servingDescription: servingDesc
        };
    };

    const nutrition = getNutritionValues();
    const isLoading = isSearching || isLoadingDetails;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-3xl relative animate-fade-in border border-gray-200 dark:border-gray-700 max-h-[85vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-900 z-10">
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
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Search Section */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 relative">
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <Search className="w-4 h-4" />
                        </div>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleInputChange}
                            onFocus={() => searchTerm.length >= 2 && setShowSuggestions(true)}
                            placeholder="Search for foods..."
                            className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        />
                        {(isAutoCompleteLoading || isFetching) && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <Loader2 className="w-4 h-4 text-green-500 animate-spin" />
                            </div>
                        )}
                    </div>

                    {/* Autocomplete Dropdown */}
                    {showSuggestions && suggestions.length > 0 && (
                        <div className="absolute left-4 right-4 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto z-20">
                            {suggestions.map((suggestion, index) => {
                                const suggestionText = typeof suggestion === 'string' ? suggestion : suggestion.suggestion;
                                return (
                                    <button
                                        key={index}
                                        onClick={() => handleSuggestionClick(suggestionText)}
                                        className="w-full px-4 py-2.5 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors first:rounded-t-lg last:rounded-b-lg border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                                    >
                                        {suggestionText}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                    {/* Food Name */}
                    <div className="text-center pb-2">
                        <p className="text-gray-600 dark:text-gray-400 text-xs mb-1">Selected food</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {selectedFood || 'No food selected'}
                        </p>
                    </div>

                    {/* Loading State */}
                    {isLoading && selectedFood ? (
                        <div className="flex flex-col items-center justify-center py-6 space-y-2">
                            <Loader2 className="w-6 h-6 text-green-500 animate-spin" />
                            <p className="text-gray-500 dark:text-gray-400 text-xs">Loading nutrition info...</p>
                        </div>
                    ) : (
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
                                    <option value="breakfast">Breakfast</option>
                                    <option value="lunch">Lunch</option>
                                    <option value="dinner">Dinner</option>
                                    <option value="snack">Snack</option>
                                    {customCategories.length > 0 && (
                                        <optgroup label="Custom Categories">
                                            {customCategories.map((cat) => (
                                                <option key={cat.id} value={`custom-${cat.id}`}>
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </optgroup>
                                    )}
                                </select>
                            </div>

                            {/* Amount Input */}
                            <div className="space-y-1.5">
                                <label className="flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-gray-300">
                                    <Scale className="w-3.5 h-3.5 text-green-500" />
                                    Amount {servingUnit && `(${servingUnit})`}
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={amount}
                                        onChange={handleAmountChange}
                                        placeholder="1"
                                        className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                    />
                                    {servingUnit && (
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-xs font-medium">{servingUnit}</span>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {nutrition.servingDescription}
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
                                            {nutrition.calories}
                                        </span>
                                    </div>
                                </div>

                                {/* Macros Grid */}
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-2 border border-green-200/50 dark:border-green-700/50">
                                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-0.5">Protein</div>
                                        <div className="text-base font-bold text-gray-900 dark:text-white">
                                            {nutrition.protein}<span className="text-xs font-normal text-gray-500 dark:text-gray-400 ml-0.5">g</span>
                                        </div>
                                    </div>
                                    <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-2 border border-green-200/50 dark:border-green-700/50">
                                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-0.5">Carbs</div>
                                        <div className="text-base font-bold text-gray-900 dark:text-white">
                                            {nutrition.carbs}<span className="text-xs font-normal text-gray-500 dark:text-gray-400 ml-0.5">g</span>
                                        </div>
                                    </div>
                                    <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-2 border border-green-200/50 dark:border-green-700/50">
                                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-0.5">Fat</div>
                                        <div className="text-base font-bold text-gray-900 dark:text-white">
                                            {nutrition.fats}<span className="text-xs font-normal text-gray-500 dark:text-gray-400 ml-0.5">g</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Footer Buttons */}
                    <div className="flex gap-2 pt-2">
                        <button
                            className="flex-1 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold transition-colors"
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                        <button
                            className="flex-1 px-3 py-2 text-sm bg-linear-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg font-semibold shadow-lg shadow-green-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={handleAddClick}
                            disabled={!selectedFood || isLoading || !foodDetails?.success || !amount || parseFloat(amount) <= 0}
                        >
                            Add to Tracker
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
