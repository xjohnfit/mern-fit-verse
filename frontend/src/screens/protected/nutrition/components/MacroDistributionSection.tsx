// React
import { type FC } from "react";

// Components
import { MacroDistributionChart } from "./MacroDistributionChart";

// Types
import { type DailyNutritionData } from "../types";

interface MacroDistributionSectionProps {
    dailyNutritionData: DailyNutritionData | undefined;
}

export const MacroDistributionSection: FC<MacroDistributionSectionProps> = ({
    dailyNutritionData,
}) => {
    return (
        <div className="lg:col-span-1">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl h-full flex flex-col">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
                    Macro Distribution
                </h3>
                <MacroDistributionChart
                    protein={dailyNutritionData?.data?.totals?.protein || 0}
                    carbs={dailyNutritionData?.data?.totals?.carbs || 0}
                    fats={dailyNutritionData?.data?.totals?.fats || 0}
                />
            </div>
        </div>
    );
};
