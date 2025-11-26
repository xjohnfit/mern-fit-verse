// Icons
import { Dumbbell } from "lucide-react";

// Components
import { WorkoutsHistory } from ".";

interface WorkoutTabProps {
    workouts: any;
    isLoadingWorkouts: boolean;
    onNavigate: (path: string) => void;
}

export const WorkoutTab = ({
    workouts,
    isLoadingWorkouts,
    onNavigate
}: WorkoutTabProps) => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Workout History</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {workouts?.length || 0} workout{(workouts?.length || 0) !== 1 ? 's' : ''} completed
                    </p>
                </div>
                <button
                    onClick={() => onNavigate("/workout")}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                >
                    <Dumbbell className="w-4 h-4" />
                    <span className="hidden sm:inline">New Workout</span>
                </button>
            </div>

            <WorkoutsHistory workouts={workouts} isLoading={isLoadingWorkouts} />
        </div>
    );
};
