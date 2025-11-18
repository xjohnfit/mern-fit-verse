import { Target } from 'lucide-react';
import { FoodAutoComplete } from './FoodAutoComplete';

interface SearchFoodSectionProps {
    onFoodSelect: (food: string) => void;
}

export const SearchFoodSection = ({ onFoodSelect }: SearchFoodSectionProps) => {
    return (
        <div className="max-w-2xl mx-auto mb-12 relative z-20">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-200/50 dark:border-gray-700/50">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-green-500" />
                    Search Food Items
                </h2>
                <FoodAutoComplete onFoodSelect={onFoodSelect} />
            </div>
        </div>
    );
};
