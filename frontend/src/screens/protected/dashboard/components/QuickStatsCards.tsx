// React
import { type FC } from "react";

// Icons
import { Activity, Apple, TrendingUp } from "lucide-react";

interface QuickStatsCardsProps {
    onNavigate: (path: string) => void;
}

export const QuickStatsCards: FC<QuickStatsCardsProps> = ({ onNavigate }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
                className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg cursor-pointer hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                onClick={() => onNavigate("/workout")}
            >
                <div className="flex items-center space-x-2 mb-2">
                    <Activity className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <h3 className="font-semibold text-green-900 dark:text-green-100 text-sm">
                        Workout Tracking
                    </h3>
                </div>
                <p className="text-green-700 dark:text-green-300 text-xs">
                    Track and log your workouts →
                </p>
            </div>

            <div
                className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                onClick={() => onNavigate("/nutrition")}
            >
                <div className="flex items-center space-x-2 mb-2">
                    <Apple className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <h3 className="font-semibold text-purple-900 dark:text-purple-100 text-sm">
                        Nutrition Tracker
                    </h3>
                </div>
                <p className="text-purple-700 dark:text-purple-300 text-xs">
                    View detailed nutrition logs →
                </p>
            </div>

            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    <h3 className="font-semibold text-orange-900 dark:text-orange-100 text-sm">
                        Progress Analytics
                    </h3>
                </div>
                <p className="text-orange-700 dark:text-orange-300 text-xs">
                    Coming soon - Visualize your progress
                </p>
            </div>
        </div>
    );
};
