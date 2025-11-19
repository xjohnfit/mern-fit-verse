// React
import { type FC } from "react";

// Icons
import { Calendar, TrendingUp, FileText, Dumbbell } from "lucide-react";

interface WorkoutStatsProps {
    workoutsThisWeek: number;
    totalWorkouts: number;
    totalTemplates: number;
    isLoading: boolean;
}

export const WorkoutStats: FC<WorkoutStatsProps> = ({
    workoutsThisWeek,
    totalWorkouts,
    totalTemplates,
    isLoading,
}) => {
    const stats = [
        {
            title: "Workouts This Week",
            value: workoutsThisWeek,
            icon: Calendar,
            color: "from-blue-500 to-blue-600",
        },
        {
            title: "Total Workouts",
            value: totalWorkouts,
            icon: TrendingUp,
            color: "from-purple-500 to-purple-600",
        },
        {
            title: "Templates",
            value: totalTemplates,
            icon: FileText,
            color: "from-indigo-500 to-indigo-600",
        },
    ];

    return (
        <div className="hidden xl:block bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mt-4">
            <div className="flex items-center space-x-2 mb-4">
                <Dumbbell className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    Workout Stats
                </h2>
            </div>

            {isLoading ? (
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse">
                            <div className="h-20 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="space-y-3">
                    {stats.map((stat) => (
                        <div
                            key={stat.title}
                            className={`p-4 bg-linear-to-r ${stat.color} rounded-lg shadow-md`}
                        >
                            <div className="flex items-center justify-between text-white">
                                <div>
                                    <p className="text-xs opacity-90 mb-1">{stat.title}</p>
                                    <p className="text-xl font-bold">{stat.value}</p>
                                </div>
                                <stat.icon className="h-6 w-6 opacity-80" />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
