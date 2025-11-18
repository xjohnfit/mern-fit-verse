// React
import { type FC } from "react";

// Components
import { DayNavigator } from "@/screens/protected/nutrition/components/DayNavigator";
import { SearchFoodSection } from "./SearchFoodSection";
import { NutritionHeader } from "./NutritionHeader";

interface NutritionTopSectionProps {
    selectedDate: Date;
    onDateChange: (date: Date) => void;
    onFoodSelect: (food: string) => void;
}

export const NutritionTopSection: FC<NutritionTopSectionProps> = ({
    selectedDate,
    onDateChange,
    onFoodSelect,
}) => {
    return (
        <>
            {/* Header Section */}
            <NutritionHeader />

            {/* Day Navigator */}
            <div className="max-w-2xl mx-auto mb-8">
                <DayNavigator currentDate={selectedDate} onDateChange={onDateChange} />
            </div>

            {/* Search Section */}
            <SearchFoodSection onFoodSelect={onFoodSelect} />
        </>
    );
};
