import { UtensilsCrossed } from 'lucide-react';

export const NutritionHeader = () => {
    return (
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
    );
};
