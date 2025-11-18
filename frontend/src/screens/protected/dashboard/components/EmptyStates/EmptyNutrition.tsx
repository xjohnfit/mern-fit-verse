// React
import { type FC } from "react";

// UI components
import { Button } from "@/components/ui/button";

// Icons
import { Apple } from "lucide-react";

interface EmptyNutritionProps {
    onAddFood: () => void;
}

export const EmptyNutrition: FC<EmptyNutritionProps> = ({ onAddFood }) => {
    return (
        <div className="text-center py-8">
            <Apple className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                No nutrition data today
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                Start tracking your meals to see your nutrition stats
            </p>
            <Button
                size="sm"
                onClick={onAddFood}
                className="bg-purple-600 hover:bg-purple-700 text-white"
            >
                <Apple className="w-4 h-4 mr-2" />
                Add Food
            </Button>
        </div>
    );
};
