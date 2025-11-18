// React
import { type FC } from "react";

// Types
import { type NutritionData } from "../types";

// UI components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Custom components
import { MacroDistributionChart } from "../../nutrition/components/MacroDistributionChart";
import { EmptyNutrition } from "./EmptyStates/EmptyNutrition";

// Icons
import { Apple, Flame } from "lucide-react";

interface NutritionOverviewProps {
    nutritionData: NutritionData | undefined;
    isLoading: boolean;
    onNavigate: (path: string) => void;
}

export const NutritionOverview: FC<NutritionOverviewProps> = ({
    nutritionData,
    isLoading,
    onNavigate,
}) => {
    const hasNutritionData =
        nutritionData?.data?.totals &&
        (nutritionData.data.totals.calories > 0 ||
            nutritionData.data.totals.protein > 0 ||
            nutritionData.data.totals.carbs > 0 ||
            nutritionData.data.totals.fats > 0);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-2 mb-4">
                <Apple className="w-5 h-5 text-purple-600" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    Today's Nutrition
                </h2>
            </div>

            {isLoading ? (
                <div className="space-y-3">
                    <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                    <div className="space-y-2">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                            ></div>
                        ))}
                    </div>
                </div>
            ) : hasNutritionData ? (
                <div className="space-y-4">
                    {/* Macro Distribution Chart */}
                    <Card className="border-none shadow-none">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Macro Distribution
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pb-2">
                            <div className="h-48">
                                <MacroDistributionChart
                                    protein={nutritionData!.data.totals.protein}
                                    carbs={nutritionData!.data.totals.carbs}
                                    fats={nutritionData!.data.totals.fats}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Macro Breakdown */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 rounded-full bg-green-600"></div>
                                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                    Protein
                                </span>
                            </div>
                            <span className="text-sm font-bold text-green-600 dark:text-green-400">
                                {nutritionData!.data.totals.protein}g
                            </span>
                        </div>

                        <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                    Carbs
                                </span>
                            </div>
                            <span className="text-sm font-bold text-red-500 dark:text-red-400">
                                {nutritionData!.data.totals.carbs}g
                            </span>
                        </div>

                        <div className="flex justify-between items-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                    Fats
                                </span>
                            </div>
                            <span className="text-sm font-bold text-yellow-600 dark:text-yellow-400">
                                {nutritionData!.data.totals.fats}g
                            </span>
                        </div>

                        <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg mt-2 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center space-x-2">
                                <Flame className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                    Total Calories
                                </span>
                            </div>
                            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                {Math.round(nutritionData!.data.totals.calories)}
                            </span>
                        </div>
                    </div>

                    {/* View More Button */}
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:text-purple-400 dark:hover:text-purple-300 dark:hover:bg-purple-900/20"
                        onClick={() => onNavigate("/nutrition")}
                    >
                        View Full Nutrition Log →
                    </Button>
                </div>
            ) : (
                <EmptyNutrition onAddFood={() => onNavigate("/nutrition")} />
            )}
        </div>
    );
};
