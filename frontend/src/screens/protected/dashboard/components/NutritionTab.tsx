// Icons
import { Flame, Target, Apple, BarChart3 } from "lucide-react";

// UI Components
import { WobbleCard } from "@/components/ui/wobble-card";

// Components
import { NutritionOverview } from ".";

interface NutritionTabProps {
    nutritionTotals: {
        calories: number;
        protein: number;
        carbs: number;
        fats: number;
    };
    nutritionData: any;
    isLoadingNutrition: boolean;
    onNavigate: (path: string) => void;
}

export const NutritionTab = ({
    nutritionTotals,
    nutritionData,
    isLoadingNutrition,
    onNavigate
}: NutritionTabProps) => {
    return (
        <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6">Nutrition Tracking</h2>

            {/* Today's Macros - Always shown */}
            <WobbleCard
                containerClassName="bg-linear-to-br from-orange-600 to-red-600"
                className="py-6 sm:py-10 md:py-20"
            >
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Today's Intake</h3>
                        <Flame className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white/80" />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                        <div>
                            <p className="text-orange-200 text-xs sm:text-sm mb-2">Calories</p>
                            <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                                {nutritionTotals.calories.toFixed(0)}
                            </p>
                            <p className="text-orange-300 text-xs mt-1">kcal</p>
                        </div>
                        <div>
                            <p className="text-orange-200 text-xs sm:text-sm mb-2">Protein</p>
                            <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                                {nutritionTotals.protein.toFixed(0)}
                            </p>
                            <p className="text-orange-300 text-xs mt-1">grams</p>
                        </div>
                        <div>
                            <p className="text-orange-200 text-xs sm:text-sm mb-2">Carbs</p>
                            <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                                {nutritionTotals.carbs.toFixed(0)}
                            </p>
                            <p className="text-orange-300 text-xs mt-1">grams</p>
                        </div>
                        <div>
                            <p className="text-orange-200 text-xs sm:text-sm mb-2">Fats</p>
                            <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                                {nutritionTotals.fats.toFixed(0)}
                            </p>
                            <p className="text-orange-300 text-xs mt-1">grams</p>
                        </div>
                    </div>
                </div>
            </WobbleCard>

            {/* Detailed Nutrition Overview */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6">
                <NutritionOverview
                    nutritionData={nutritionData}
                    isLoading={isLoadingNutrition}
                    onNavigate={onNavigate}
                />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                <div onClick={() => onNavigate("/nutrition")} className="cursor-pointer">
                    <WobbleCard
                        containerClassName="bg-linear-to-br from-green-500 to-green-700"
                        className="py-4 sm:py-6 md:py-10"
                    >
                        <div className="text-center">
                            <Target className="w-8 h-8 sm:w-10 sm:h-10 text-white/80 mx-auto mb-2 sm:mb-3" />
                            <p className="text-white font-semibold text-sm sm:text-base">Set Goals</p>
                        </div>
                    </WobbleCard>
                </div>

                <div onClick={() => onNavigate("/nutrition")} className="cursor-pointer">
                    <WobbleCard
                        containerClassName="bg-linear-to-br from-blue-500 to-blue-700"
                        className="py-4 sm:py-6 md:py-10"
                    >
                        <div className="text-center">
                            <Apple className="w-8 h-8 sm:w-10 sm:h-10 text-white/80 mx-auto mb-2 sm:mb-3" />
                            <p className="text-white font-semibold text-sm sm:text-base">Log Meal</p>
                        </div>
                    </WobbleCard>
                </div>

                <div onClick={() => onNavigate("/nutrition")} className="cursor-pointer">
                    <WobbleCard
                        containerClassName="bg-linear-to-br from-purple-500 to-purple-700"
                        className="py-4 sm:py-6 md:py-10"
                    >
                        <div className="text-center">
                            <BarChart3 className="w-8 h-8 sm:w-10 sm:h-10 text-white/80 mx-auto mb-2 sm:mb-3" />
                            <p className="text-white font-semibold text-sm sm:text-base">View History</p>
                        </div>
                    </WobbleCard>
                </div>
            </div>
        </div>
    );
};
