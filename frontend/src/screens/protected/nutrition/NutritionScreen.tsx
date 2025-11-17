
import { useState, useEffect } from 'react';
import { UtensilsCrossed, Target, BarChart3, Calendar, CheckCircle, Coffee, Sun, Cookie, Moon, Plus, X, Apple, Edit2, Save } from 'lucide-react';
import { FoodAutoComplete } from '@/components/FoodAutoComplete';
import { useSearchFoodsQuery, useLazyGetFoodByIdQuery } from '@/slices/fatSecretApiSlice';
import { useAddNutritionEntryMutation, useGetDailyNutritionQuery } from '@/slices/nutritionApiSlice';
import { useGetCustomCategoriesQuery, useAddCustomCategoryMutation, useDeleteCustomCategoryMutation } from '@/slices/customCategoryApiSlice';
import { useGetUserProfileQuery, useUpdateNutritionGoalsMutation } from '@/slices/usersApiSlice';
import ShowFoodItemModal from '../../../components/ShowFoodItemModal';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { toast } from 'sonner';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

type MealCategory = 'breakfast' | 'lunch' | 'snack' | 'dinner';

interface MealCategoryData {
    name: string;
    icon: typeof Coffee;
    color: string;
    foods: any[];
    isCustom?: boolean;
}

interface CustomCategory {
    id: string;
    name: string;
    icon: typeof Coffee;
    color: string;
    foods: any[];
}

const NutritionScreen = () => {

    const [selectedFood, setSelectedFood] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<MealCategory | string | null>(null);
    const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [isEditingGoals, setIsEditingGoals] = useState(false);
    const [goalValues, setGoalValues] = useState({
        calories: '',
        protein: '',
        carbs: '',
        fats: ''
    });

    // API hooks
    const { data: dailyNutritionData, isLoading: isLoadingNutrition } = useGetDailyNutritionQuery();
    const [addNutritionEntry, { isLoading: isAddingEntry }] = useAddNutritionEntryMutation();
    const { data: customCategoriesData } = useGetCustomCategoriesQuery();
    const [addCustomCategory] = useAddCustomCategoryMutation();
    const [deleteCustomCategory] = useDeleteCustomCategoryMutation();
    const { data: userProfile } = useGetUserProfileQuery(undefined);
    const [updateNutritionGoals] = useUpdateNutritionGoalsMutation();

    // Initialize goal values from user profile
    useEffect(() => {
        if (userProfile?.nutritionGoals) {
            setGoalValues({
                calories: userProfile.nutritionGoals.calories?.toString() || '',
                protein: userProfile.nutritionGoals.protein?.toString() || '',
                carbs: userProfile.nutritionGoals.carbs?.toString() || '',
                fats: userProfile.nutritionGoals.fats?.toString() || ''
            });
        }
    }, [userProfile]);

    // Meal categories base configuration
    const mealCategoriesConfig: Record<MealCategory, { name: string; icon: typeof Coffee; color: string; }> = {
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
        }
    };

    // Build meal categories with foods from API data
    const mealCategories: Record<MealCategory, MealCategoryData> = {
        breakfast: {
            ...mealCategoriesConfig.breakfast,
            foods: dailyNutritionData?.data?.entries?.filter((entry: any) => entry.mealCategory === 'breakfast') || []
        },
        lunch: {
            ...mealCategoriesConfig.lunch,
            foods: dailyNutritionData?.data?.entries?.filter((entry: any) => entry.mealCategory === 'lunch') || []
        },
        snack: {
            ...mealCategoriesConfig.snack,
            foods: dailyNutritionData?.data?.entries?.filter((entry: any) => entry.mealCategory === 'snack') || []
        },
        dinner: {
            ...mealCategoriesConfig.dinner,
            foods: dailyNutritionData?.data?.entries?.filter((entry: any) => entry.mealCategory === 'dinner') || []
        }
    };

    // Custom meal categories (max 3) - now from API
    const customCategories: CustomCategory[] = (customCategoriesData?.data || []).map((cat) => ({
        id: cat._id,
        name: cat.name,
        icon: Apple,
        color: cat.color,
        foods: dailyNutritionData?.data?.entries?.filter((entry: any) =>
            entry.mealCategory === 'custom' && entry.customCategoryId === cat._id
        ) || []
    }));

    // Available colors for custom categories
    const availableColors = [
        'from-cyan-500 to-blue-500',
        'from-lime-500 to-green-500',
        'from-red-500 to-pink-500',
        'from-violet-500 to-purple-500',
        'from-fuchsia-500 to-pink-500',
        'from-emerald-500 to-teal-500'
    ];

    const handleAddCustomCategory = async () => {
        if (newCategoryName.trim() && customCategories.length < 3) {
            try {
                const color = availableColors[customCategories.length % availableColors.length];
                await addCustomCategory({
                    name: newCategoryName.trim(),
                    color
                }).unwrap();
                toast.success('Custom category created!');
                setNewCategoryName('');
                setShowAddCategoryModal(false);
            } catch (error: any) {
                console.error('Error adding custom category:', error);
                toast.error(error?.data?.message || 'Failed to create category');
            }
        }
    };

    const handleRemoveCustomCategory = async (categoryId: string) => {
        try {
            await deleteCustomCategory(categoryId).unwrap();
            toast.success('Category deleted successfully');
        } catch (error: any) {
            console.error('Error deleting custom category:', error);
            toast.error(error?.data?.message || 'Failed to delete category');
        }
    };

    // For searching food to get ID
    const { data: searchData, isFetching: isSearching } = useSearchFoodsQuery(
        selectedFood
            ? { search_expression: selectedFood, max_results: 1 }
            : { search_expression: '', max_results: 1 },
        { skip: !selectedFood }
    );

    // For fetching food details
    const [triggerGetFoodById, { data: foodDetails, isFetching: isLoadingDetails }] = useLazyGetFoodByIdQuery();

    useEffect(() => {
        console.log('searchData:', searchData);
        // Updated to match actual API response structure
        const foodsArr = searchData?.data?.foods_search?.results?.food;
        if (searchData?.success && foodsArr && Array.isArray(foodsArr) && foodsArr.length > 0) {
            const foundId = foodsArr[0]?.food_id;
            console.log('foundId:', foundId);
            if (foundId) {
                console.log('Calling triggerGetFoodById with:', foundId);
                triggerGetFoodById(foundId);
            }
        }
    }, [searchData, triggerGetFoodById]);

    const handleFoodSelect = (food: string) => {
        setSelectedFood(food);
        setShowModal(true);
    };



    const handleCancel = () => {
        setShowModal(false);
        setSelectedFood(null);
    };

    const handleAddFood = async (nutritionData: {
        foodItem: string;
        mealCategory: string;
        customCategoryId?: string;
        calories: number;
        protein: number;
        carbs: number;
        fats: number;
    }) => {
        try {
            await addNutritionEntry(nutritionData).unwrap();
            toast.success('Food added successfully!');
            setShowModal(false);
            setSelectedFood(null);
        } catch (error: any) {
            console.error('Error adding nutrition entry:', error);
            toast.error(error?.data?.message || 'Failed to add food item');
        }
    };

    const handleSaveGoals = async () => {
        try {
            const goals = {
                calories: goalValues.calories ? Number(goalValues.calories) : undefined,
                protein: goalValues.protein ? Number(goalValues.protein) : undefined,
                carbs: goalValues.carbs ? Number(goalValues.carbs) : undefined,
                fats: goalValues.fats ? Number(goalValues.fats) : undefined,
            };

            await updateNutritionGoals(goals).unwrap();
            toast.success('Nutrition goals updated successfully!');
            setIsEditingGoals(false);
        } catch (error: any) {
            console.error('Error updating nutrition goals:', error);
            toast.error(error?.data?.message || 'Failed to update goals');
        }
    };

    const handleGoalChange = (field: string, value: string) => {
        // Allow only numbers and decimal point
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            setGoalValues(prev => {
                const newValues = { ...prev, [field]: value };

                // Auto-calculate calories when protein, carbs, or fats change
                // 1g protein = 4 calories, 1g carb = 4 calories, 1g fat = 9 calories
                if (field === 'protein' || field === 'carbs' || field === 'fats') {
                    const protein = field === 'protein' ? Number(value) : Number(newValues.protein);
                    const carbs = field === 'carbs' ? Number(value) : Number(newValues.carbs);
                    const fats = field === 'fats' ? Number(value) : Number(newValues.fats);

                    const calculatedCalories = (protein * 4) + (carbs * 4) + (fats * 9);
                    newValues.calories = calculatedCalories > 0 ? calculatedCalories.toFixed(0) : '';
                }

                return newValues;
            });
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-green-900/20 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-green-400/10 dark:bg-green-600/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-emerald-400/10 dark:bg-emerald-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="max-w-6xl mx-auto">
                    {/* Header Section */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-r from-green-500 to-emerald-500 rounded-2xl mb-4 shadow-lg shadow-green-500/25">
                            <UtensilsCrossed className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-linear-to-r from-green-600 via-emerald-600 to-teal-600 dark:from-green-400 dark:via-emerald-400 dark:to-teal-400 bg-clip-text text-transparent mb-3">
                            Nutrition Tracker
                        </h1>
                        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Track your meals and monitor your daily nutrition intake
                        </p>
                    </div>

                    {/* Search Section */}
                    <div className="max-w-2xl mx-auto mb-12 relative z-20">
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-200/50 dark:border-gray-700/50">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <Target className="w-5 h-5 text-green-500" />
                                Search Food Items
                            </h2>
                            <FoodAutoComplete onFoodSelect={handleFoodSelect} />
                        </div>
                    </div>

                    {/* Nutrition Goals Section */}
                    <div className="max-w-4xl mx-auto mb-8">
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
                            <div className="flex items-center justify-between mb-3 sm:mb-4">
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                    <Target className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                                    <span className="hidden sm:inline">Current Goals</span>
                                    <span className="sm:hidden">Goals</span>
                                </h3>
                                {!isEditingGoals ? (
                                    <button
                                        onClick={() => setIsEditingGoals(true)}
                                        className="flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50 rounded-lg transition-colors"
                                    >
                                        <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                                        <span className="hidden sm:inline">Edit Goals</span>
                                        <span className="sm:hidden">Edit</span>
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleSaveGoals}
                                        className="flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                                    >
                                        <Save className="w-3 h-3 sm:w-4 sm:h-4" />
                                        Save
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
                                {[
                                    { label: 'Calories', field: 'calories', unit: 'kcal', color: 'blue' },
                                    { label: 'Protein', field: 'protein', unit: 'g', color: 'green' },
                                    { label: 'Carbs', field: 'carbs', unit: 'g', color: 'orange' },
                                    { label: 'Fats', field: 'fats', unit: 'g', color: 'purple' }
                                ].map((goal) => (
                                    <div key={goal.field} className="bg-gray-50/50 dark:bg-gray-700/50 rounded-lg p-2.5 sm:p-4">
                                        <label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1 sm:mb-2">
                                            {goal.label}
                                        </label>
                                        {isEditingGoals ? (
                                            <div className="flex items-center gap-1 sm:gap-2">
                                                <input
                                                    type="text"
                                                    value={goalValues[goal.field as keyof typeof goalValues]}
                                                    onChange={(e) => handleGoalChange(goal.field, e.target.value)}
                                                    placeholder={`Enter ${goal.label.toLowerCase()}`}
                                                    disabled={goal.field === 'calories'}
                                                    className={`flex-1 px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 ${goal.field === 'calories' ? 'opacity-60 cursor-not-allowed bg-gray-100 dark:bg-gray-700' : ''}`}
                                                />
                                                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 min-w-8 sm:min-w-10">{goal.unit}</span>
                                            </div>
                                        ) : (
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-1 sm:gap-2">
                                                    <span className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">
                                                        {goalValues[goal.field as keyof typeof goalValues] || '—'}
                                                    </span>
                                                    <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{goal.unit}</span>
                                                </div>
                                                {goalValues[goal.field as keyof typeof goalValues] && dailyNutritionData?.data?.totals && (
                                                    <span
                                                        className={`inline-block text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded ${(dailyNutritionData.data.totals[goal.field as keyof typeof dailyNutritionData.data.totals] || 0) >= Number(goalValues[goal.field as keyof typeof goalValues])
                                                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                                            }`}
                                                        title="Progress toward goal"
                                                    >
                                                        {((dailyNutritionData.data.totals[goal.field as keyof typeof dailyNutritionData.data.totals] || 0) / Number(goalValues[goal.field as keyof typeof goalValues]) * 100).toFixed(0)}%
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Food Modal */}
                    {
                        showModal && selectedFood && (
                            <ShowFoodItemModal
                                selectedFood={selectedFood}
                                handleCancel={handleCancel}
                                handleAddFood={handleAddFood}
                                isSearching={isSearching}
                                isLoadingDetails={isLoadingDetails}
                                foodDetails={foodDetails}
                                customCategories={customCategories.map(cat => ({ id: cat.id, name: cat.name }))}
                            />
                        )
                    }

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column - Macro Distribution & Stats */}
                        <div className="space-y-6">
                            {/* Doughnut Chart */}
                            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">Macro Distribution</h3>
                                <div className="max-w-[250px] mx-auto">
                                    <Doughnut
                                        data={{
                                            labels: ['Protein', 'Carbs', 'Fat'],
                                            datasets: [
                                                {
                                                    data: [
                                                        dailyNutritionData?.data?.totals?.protein || 0,
                                                        dailyNutritionData?.data?.totals?.carbs || 0,
                                                        dailyNutritionData?.data?.totals?.fats || 0
                                                    ],
                                                    backgroundColor: [
                                                        'rgba(34, 197, 94, 0.8)',
                                                        'rgba(251, 146, 60, 0.8)',
                                                        'rgba(168, 85, 247, 0.8)',
                                                    ],
                                                    borderColor: [
                                                        'rgba(34, 197, 94, 1)',
                                                        'rgba(251, 146, 60, 1)',
                                                        'rgba(168, 85, 247, 1)',
                                                    ],
                                                    borderWidth: 2,
                                                },
                                            ],
                                        }}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: true,
                                            plugins: {
                                                legend: {
                                                    position: 'bottom' as const,
                                                    labels: {
                                                        padding: 15,
                                                        font: {
                                                            size: 12,
                                                        },
                                                        color: '#6b7280',
                                                    },
                                                },
                                                tooltip: {
                                                    callbacks: {
                                                        label: function (context: any) {
                                                            const label = context.label || '';
                                                            const value = context.parsed || 0;
                                                            return `${label}: ${value.toFixed(1)}g`;
                                                        }
                                                    }
                                                }
                                            },
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Quick Stats Cards */}
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    {
                                        icon: Target,
                                        title: "Calories",
                                        value: dailyNutritionData?.data?.totals?.calories?.toFixed(0) || "0",
                                        unit: "kcal",
                                        color: "from-blue-500 to-blue-600"
                                    },
                                    {
                                        icon: BarChart3,
                                        title: "Protein",
                                        value: dailyNutritionData?.data?.totals?.protein?.toFixed(1) || "0",
                                        unit: "g",
                                        color: "from-green-500 to-green-600"
                                    },
                                    {
                                        icon: UtensilsCrossed,
                                        title: "Carbs",
                                        value: dailyNutritionData?.data?.totals?.carbs?.toFixed(1) || "0",
                                        unit: "g",
                                        color: "from-orange-500 to-orange-600"
                                    },
                                    {
                                        icon: Calendar,
                                        title: "Fat",
                                        value: dailyNutritionData?.data?.totals?.fats?.toFixed(1) || "0",
                                        unit: "g",
                                        color: "from-purple-500 to-purple-600"
                                    }
                                ].map((stat, index) => (
                                    <div
                                        key={index}
                                        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300"
                                    >
                                        <div className={`inline-flex items-center justify-center w-10 h-10 bg-linear-to-r ${stat.color} rounded-lg mb-3`}>
                                            <stat.icon className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                            {stat.value}<span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-1">{stat.unit}</span>
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Column - Today's Meals */}
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                    Today's Meals
                                </h2>
                                {customCategories.length < 3 && (
                                    <button
                                        onClick={() => setShowAddCategoryModal(true)}
                                        className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50 rounded-lg transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add Category
                                    </button>
                                )}
                            </div>

                            {/* Add Category Modal */}
                            {showAddCategoryModal && (
                                <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                                            Create Custom Category ({customCategories.length}/3)
                                        </h3>
                                        <button
                                            onClick={() => {
                                                setShowAddCategoryModal(false);
                                                setNewCategoryName('');
                                            }}
                                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newCategoryName}
                                            onChange={(e) => setNewCategoryName(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleAddCustomCategory()}
                                            placeholder="e.g., Pre-Workout, Post-Workout"
                                            className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                            maxLength={20}
                                        />
                                        <button
                                            onClick={handleAddCustomCategory}
                                            disabled={!newCategoryName.trim()}
                                            className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg transition-colors"
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Meal Categories */}
                            <div className="space-y-4">
                                {/* Default Categories */}
                                {(Object.entries(mealCategories) as [MealCategory, MealCategoryData][]).map(([key, category]) => (
                                    <div
                                        key={key}
                                        className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-md transition-all duration-200"
                                    >
                                        {/* Category Header */}
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <div className={`inline-flex items-center justify-center w-8 h-8 bg-linear-to-r ${category.color} rounded-lg`}>
                                                    <category.icon className="w-4 h-4 text-white" />
                                                </div>
                                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                                    {category.name}
                                                </h3>
                                            </div>
                                            <button
                                                onClick={() => setSelectedCategory(key)}
                                                className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                                title={`Add food to ${category.name}`}
                                            >
                                                <Plus className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                                            </button>
                                        </div>

                                        {/* Foods List */}
                                        {category.foods.length > 0 ? (
                                            <div className="space-y-2">
                                                {category.foods.map((food: any, idx: number) => (
                                                    <div
                                                        key={food._id || idx}
                                                        className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                                                    >
                                                        <span className="text-sm text-gray-700 dark:text-gray-300">{food.foodItem}</span>
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">{food.calories.toFixed(0)} cal</span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-2">
                                                No items added
                                            </p>
                                        )}
                                    </div>
                                ))}

                                {/* Custom Categories */}
                                {customCategories.map((category) => (
                                    <div
                                        key={category.id}
                                        className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-md transition-all duration-200 relative"
                                    >
                                        {/* Category Header */}
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <div className={`inline-flex items-center justify-center w-8 h-8 bg-linear-to-r ${category.color} rounded-lg`}>
                                                    <category.icon className="w-4 h-4 text-white" />
                                                </div>
                                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                                    {category.name}
                                                </h3>
                                                <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                                                    Custom
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => setSelectedCategory(category.id)}
                                                    className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                                    title={`Add food to ${category.name}`}
                                                >
                                                    <Plus className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                                                </button>
                                                <button
                                                    onClick={() => handleRemoveCustomCategory(category.id)}
                                                    className="p-1.5 rounded-lg bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                                                    title={`Remove ${category.name}`}
                                                >
                                                    <X className="w-4 h-4 text-red-600 dark:text-red-400" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Foods List */}
                                        {category.foods.length > 0 ? (
                                            <div className="space-y-2">
                                                {category.foods.map((food: any, idx: number) => (
                                                    <div
                                                        key={food._id || idx}
                                                        className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                                                    >
                                                        <span className="text-sm text-gray-700 dark:text-gray-300">{food.foodItem}</span>
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">{food.calories.toFixed(0)} cal</span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-2">
                                                No items added
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default NutritionScreen;