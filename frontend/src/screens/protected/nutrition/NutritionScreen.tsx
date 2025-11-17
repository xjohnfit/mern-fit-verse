
import { useState, useEffect } from 'react';
import { UtensilsCrossed, Target, BarChart3, Calendar, CheckCircle, Coffee, Sun, Cookie, Moon, Plus, X, Apple } from 'lucide-react';
import { FoodAutoComplete } from '@/components/FoodAutoComplete';
import { useSearchFoodsQuery, useLazyGetFoodByIdQuery } from '@/slices/fatSecretApiSlice';
import ShowFoodItemModal from '../../../components/ShowFoodItemModal';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

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

    // Meal categories with their associated foods
    const [mealCategories, setMealCategories] = useState<Record<MealCategory, MealCategoryData>>({
        breakfast: {
            name: 'Breakfast',
            icon: Coffee,
            color: 'from-amber-500 to-orange-500',
            foods: []
        },
        lunch: {
            name: 'Lunch',
            icon: Sun,
            color: 'from-yellow-500 to-amber-500',
            foods: []
        },
        snack: {
            name: 'Snack',
            icon: Cookie,
            color: 'from-pink-500 to-rose-500',
            foods: []
        },
        dinner: {
            name: 'Dinner',
            icon: Moon,
            color: 'from-indigo-500 to-purple-500',
            foods: []
        }
    });

    // Custom meal categories (max 3)
    const [customCategories, setCustomCategories] = useState<CustomCategory[]>([]);

    // Available colors for custom categories
    const availableColors = [
        'from-cyan-500 to-blue-500',
        'from-lime-500 to-green-500',
        'from-red-500 to-pink-500',
        'from-violet-500 to-purple-500',
        'from-fuchsia-500 to-pink-500',
        'from-emerald-500 to-teal-500'
    ];

    const handleAddCustomCategory = () => {
        if (newCategoryName.trim() && customCategories.length < 3) {
            const newCategory: CustomCategory = {
                id: `custom-${Date.now()}`,
                name: newCategoryName.trim(),
                icon: Apple,
                color: availableColors[customCategories.length % availableColors.length],
                foods: []
            };
            setCustomCategories([...customCategories, newCategory]);
            setNewCategoryName('');
            setShowAddCategoryModal(false);
        }
    };

    const handleRemoveCustomCategory = (categoryId: string) => {
        setCustomCategories(customCategories.filter(cat => cat.id !== categoryId));
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

    const handleAddFood = () => {
        // TODO: Implement add to daily nutrition tracker logic
        setShowModal(false);
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
                                                    data: [0, 0, 0],
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
                                        value: "0",
                                        unit: "kcal",
                                        color: "from-blue-500 to-blue-600"
                                    },
                                    {
                                        icon: BarChart3,
                                        title: "Protein",
                                        value: "0",
                                        unit: "g",
                                        color: "from-green-500 to-green-600"
                                    },
                                    {
                                        icon: UtensilsCrossed,
                                        title: "Carbs",
                                        value: "0",
                                        unit: "g",
                                        color: "from-orange-500 to-orange-600"
                                    },
                                    {
                                        icon: Calendar,
                                        title: "Fat",
                                        value: "0",
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
                                                {category.foods.map((food, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                                                    >
                                                        <span className="text-sm text-gray-700 dark:text-gray-300">{food.name}</span>
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">{food.calories} cal</span>
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
                                                {category.foods.map((food, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                                                    >
                                                        <span className="text-sm text-gray-700 dark:text-gray-300">{food.name}</span>
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">{food.calories} cal</span>
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