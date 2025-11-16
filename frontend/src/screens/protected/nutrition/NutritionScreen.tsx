
import { useState, useEffect } from 'react';
import { UtensilsCrossed, Target, BarChart3, Calendar, CheckCircle } from 'lucide-react';
import { FoodAutoComplete } from '@/components/FoodAutoComplete';
import { useSearchFoodsQuery, useLazyGetFoodByIdQuery } from '@/slices/fatSecretApiSlice';
import ShowFoodItemModal from '../../../components/ShowFoodItemModal';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

const NutritionScreen = () => {

    const [selectedFood, setSelectedFood] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);

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
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                Today's Meals
                            </h2>
                            <div className="text-center py-12">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                                    <UtensilsCrossed className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                                </div>
                                <p className="text-gray-500 dark:text-gray-400 mb-2">No meals logged yet today</p>
                                <p className="text-sm text-gray-400 dark:text-gray-500">Search and add food items to start tracking</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default NutritionScreen;