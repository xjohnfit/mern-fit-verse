// React
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

// Third-party libraries
import { Dumbbell, Clock, Calendar, Target, Zap, TrendingUp } from "lucide-react";

// UI Components
import { Card, CardContent } from "@/components/ui/card";

// Utils
import { formatWeight } from "@/lib/weightConversion";

interface WorkoutExercise {
    exerciseId: string;
    exerciseName: string;
    sets: {
        setNumber: number;
        weight: number;
        reps: number;
        completed: boolean;
    }[];
}

interface Workout {
    _id: string;
    workoutType: string;
    duration: number;
    exercises: WorkoutExercise[];
    completedAt: string;
    createdAt: string;
}

interface WorkoutsHistoryProps {
    workouts?: Workout[];
    isLoading: boolean;
}

const WorkoutsHistory = ({ workouts, isLoading }: WorkoutsHistoryProps) => {
    const navigate = useNavigate();
    const { userInfo } = useSelector((state: any) => state.auth);
    const weightUnit = userInfo?.weightUnit || 'lbs';

    const formatDuration = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        if (hrs > 0) {
            return `${hrs}h ${mins}m`;
        }
        return `${mins}m`;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMs = now.getTime() - date.getTime();
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        // Format time
        const timeStr = date.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        });

        // Format date based on recency
        let dateStr = '';
        if (diffInDays === 0) {
            dateStr = "Today";
        } else if (diffInDays === 1) {
            dateStr = "Yesterday";
        } else if (diffInDays < 7) {
            dateStr = `${diffInDays} days ago`;
        } else {
            dateStr = date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
            });
        }

        return `${dateStr} at ${timeStr}`;
    };

    const calculateTotalVolume = (workout: Workout) => {
        return workout.exercises.reduce((total, exercise) => {
            return total + exercise.sets.reduce((setTotal, set) => {
                return setTotal + (set.weight * set.reps);
            }, 0);
        }, 0);
    };

    const calculateCompletedSets = (workout: Workout) => {
        const totalSets = workout.exercises.reduce((total, exercise) => total + exercise.sets.length, 0);
        const completedSets = workout.exercises.reduce((total, exercise) => {
            return total + exercise.sets.filter(set => set.completed).length;
        }, 0);
        return { completed: completedSets, total: totalSets };
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="animate-pulse">
                        <CardContent className="p-6">
                            <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (!workouts || workouts.length === 0) {
        return (
            <Card className="border-dashed border-2">
                <CardContent className="py-12 text-center">
                    <Dumbbell className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        No Workouts Yet
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6">
                        Start your fitness journey by completing your first workout
                    </p>
                    <button
                        onClick={() => navigate("/workout")}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                    >
                        <Dumbbell className="w-4 h-4" />
                        Start Workout
                    </button>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {workouts.map((workout) => {
                const sets = calculateCompletedSets(workout);
                const volume = calculateTotalVolume(workout);
                const isFreestyle = workout.workoutType === "freestyle";

                return (
                    <Card
                        key={workout._id}
                        className="hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-blue-500"
                        onClick={() => navigate(`/workout/${workout._id}`)}
                    >
                        <CardContent className="p-4 sm:p-6">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-start gap-3">
                                    <div className={`p-2 sm:p-3 rounded-lg ${isFreestyle
                                        ? 'bg-blue-100 dark:bg-blue-900/30'
                                        : 'bg-purple-100 dark:bg-purple-900/30'
                                        }`}>
                                        <Dumbbell className={`w-5 h-5 sm:w-6 sm:h-6 ${isFreestyle
                                            ? 'text-blue-600 dark:text-blue-400'
                                            : 'text-purple-600 dark:text-purple-400'
                                            }`} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                                                {isFreestyle ? 'Freestyle Workout' : workout.workoutType}
                                            </h3>
                                            <span className={`text-xs px-2 py-1 rounded-full ${isFreestyle
                                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                                : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                                                }`}>
                                                {isFreestyle ? 'Freestyle' : 'Template'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                                            {formatDate(workout.completedAt || workout.createdAt)}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4">
                                <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 rounded-lg p-2 sm:p-3">
                                    <Clock className="w-4 h-4 text-blue-500" />
                                    <div>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">Duration</p>
                                        <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                                            {formatDuration(workout.duration)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 rounded-lg p-2 sm:p-3">
                                    <Target className="w-4 h-4 text-green-500" />
                                    <div>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">Exercises</p>
                                        <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                                            {workout.exercises.length}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 rounded-lg p-2 sm:p-3">
                                    <Zap className="w-4 h-4 text-orange-500" />
                                    <div>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">Sets</p>
                                        <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                                            {sets.completed}/{sets.total}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 rounded-lg p-2 sm:p-3">
                                    <TrendingUp className="w-4 h-4 text-purple-500" />
                                    <div>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">Volume</p>
                                        <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                                            {formatWeight(volume, weightUnit)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Exercise List Preview */}
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Exercises:</p>
                                <div className="flex flex-wrap gap-2">
                                    {workout.exercises.slice(0, 3).map((exercise) => (
                                        <span
                                            key={exercise.exerciseId}
                                            className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full"
                                        >
                                            {exercise.exerciseName}
                                        </span>
                                    ))}
                                    {workout.exercises.length > 3 && (
                                        <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-full">
                                            +{workout.exercises.length - 3} more
                                        </span>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
};

export { WorkoutsHistory };
