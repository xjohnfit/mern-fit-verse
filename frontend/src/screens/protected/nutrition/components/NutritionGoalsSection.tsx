// React
import { type FC } from "react";

// Components
import { NutritionGoalsCard } from "./NutritionGoalsCard";

// Types
import { type GoalValues, type DailyNutritionData } from "@/screens/protected/nutrition/types";

interface NutritionGoalsSectionProps {
    isEditingGoals: boolean;
    setIsEditingGoals: (value: boolean) => void;
    goalValues: GoalValues;
    handleGoalChange: (field: string, value: string) => void;
    handleSaveGoals: () => void;
    dailyNutritionData: DailyNutritionData | undefined;
}

export const NutritionGoalsSection: FC<NutritionGoalsSectionProps> = ({
    isEditingGoals,
    setIsEditingGoals,
    goalValues,
    handleGoalChange,
    handleSaveGoals,
    dailyNutritionData,
}) => {
    return (
        <div className="lg:col-span-2">
            <NutritionGoalsCard
                isEditingGoals={isEditingGoals}
                setIsEditingGoals={setIsEditingGoals}
                goalValues={goalValues}
                handleGoalChange={handleGoalChange}
                handleSaveGoals={handleSaveGoals}
                dailyNutritionData={dailyNutritionData}
            />
        </div>
    );
};
