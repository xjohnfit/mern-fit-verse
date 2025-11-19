// React
import { useParams, useNavigate } from "react-router";
import { useSelector } from "react-redux";

// Third-party libraries
import { ArrowLeft, Dumbbell, Clock, Calendar, Target, Zap, TrendingUp, Check, X } from "lucide-react";
import { toast } from "sonner";

// Redux slices
import { useGetWorkoutByIdQuery, useDeleteWorkoutMutation } from "@/slices/workoutApiSlice";

// UI Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Utils
import { formatWeight } from "@/lib/weightConversion";

const WorkoutDetailScreen = () => {
    const { id } = useParams<{ id: string; }>();
    const navigate = useNavigate();
    const { data: workout, isLoading, error } = useGetWorkoutByIdQuery(id);
    const [deleteWorkout, { isLoading: isDeleting }] = useDeleteWorkoutMutation();
    const { userInfo } = useSelector((state: any) => state.auth);
    const weightUnit = userInfo?.weightUnit || 'lbs';

    const formatDuration = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hrs > 0) {
            return `${hrs}h ${mins}m ${secs}s`;
        }
        if (mins > 0) {
            return `${mins}m ${secs}s`;
        }
        return `${secs}s`;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const calculateTotalVolume = () => {
        if (!workout) return 0;
        return workout.exercises.reduce((total: number, exercise: any) => {
            return total + exercise.sets.reduce((setTotal: number, set: any) => {
                return setTotal + (set.weight * set.reps);
            }, 0);
        }, 0);
    };

    const calculateCompletedSets = () => {
        if (!workout) return { completed: 0, total: 0 };
        const totalSets = workout.exercises.reduce((total: number, exercise: any) => total + exercise.sets.length, 0);
        const completedSets = workout.exercises.reduce((total: number, exercise: any) => {
            return total + exercise.sets.filter((set: any) => set.completed).length;
        }, 0);
        return { completed: completedSets, total: totalSets };
    };

    const handleDeleteWorkout = async () => {
        if (!window.confirm("Are you sure you want to delete this workout? This action cannot be undone.")) {
            return;
        }

        try {
            await deleteWorkout(id).unwrap();
            toast.success("Workout deleted successfully");
            navigate("/dashboard");
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to delete workout");
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                    <div className="animate-pulse space-y-6">
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                        <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !workout) {
        return (
            <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                    <Button
                        variant="ghost"
                        onClick={() => navigate("/dashboard")}
                        className="mb-4 -ml-2"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Button>
                    <Card className="border-red-200 dark:border-red-800">
                        <CardContent className="py-12 text-center">
                            <X className="w-12 h-12 text-red-500 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                Workout Not Found
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                The workout you're looking for doesn't exist or has been deleted.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    const sets = calculateCompletedSets();
    const volume = calculateTotalVolume();
    const isFreestyle = workout.workoutType === "freestyle";

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                {/* Header */}
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        onClick={() => navigate("/dashboard")}
                        className="mb-4 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Button>

                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex items-start gap-4">
                            <div className={`p-3 sm:p-4 rounded-lg ${isFreestyle
                                    ? 'bg-blue-100 dark:bg-blue-900/30'
                                    : 'bg-purple-100 dark:bg-purple-900/30'
                                }`}>
                                <Dumbbell className={`w-6 h-6 sm:w-8 sm:h-8 ${isFreestyle
                                        ? 'text-blue-600 dark:text-blue-400'
                                        : 'text-purple-600 dark:text-purple-400'
                                    }`} />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                                        {isFreestyle ? 'Freestyle Workout' : workout.workoutType}
                                    </h1>
                                    <span className={`text-xs px-3 py-1 rounded-full ${isFreestyle
                                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                            : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                                        }`}>
                                        {isFreestyle ? 'Freestyle' : 'Template'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                    <Calendar className="w-4 h-4" />
                                    {formatDate(workout.completedAt || workout.createdAt)}
                                </div>
                            </div>
                        </div>

                        <Button
                            variant="outline"
                            onClick={handleDeleteWorkout}
                            disabled={isDeleting}
                            className="border-red-500 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                            <X className="w-4 h-4 mr-2" />
                            {isDeleting ? "Deleting..." : "Delete Workout"}
                        </Button>
                    </div>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    <Card>
                        <CardContent className="p-4 sm:p-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                    <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">Duration</p>
                                    <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                                        {formatDuration(workout.duration)}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4 sm:p-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                    <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">Exercises</p>
                                    <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                                        {workout.exercises.length}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4 sm:p-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                                    <Zap className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">Sets Completed</p>
                                    <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                                        {sets.completed}/{sets.total}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4 sm:p-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                    <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">Total Volume</p>
                                    <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                                        {volume.toFixed(0)} kg
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Exercises */}
                <Card>
                    <CardHeader>
                        <CardTitle>Exercises</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {workout.exercises.map((exercise: any, index: number) => (
                            <Card key={exercise.exerciseId} className="border-l-4 border-l-blue-500">
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white text-sm font-semibold rounded-full">
                                            {index + 1}
                                        </span>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                            {exercise.exerciseName}
                                        </h3>
                                    </div>

                                    {/* Sets Table */}
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                                    <th className="text-left py-2 px-2 text-gray-600 dark:text-gray-400">Set</th>
                                                    <th className="text-center py-2 px-2 text-gray-600 dark:text-gray-400">Weight ({weightUnit})</th>
                                                    <th className="text-center py-2 px-2 text-gray-600 dark:text-gray-400">Reps</th>
                                                    <th className="text-center py-2 px-2 text-gray-600 dark:text-gray-400">Volume</th>
                                                    <th className="text-center py-2 px-2 text-gray-600 dark:text-gray-400">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {exercise.sets.map((set: any) => (
                                                    <tr
                                                        key={set.setNumber}
                                                        className={`border-b border-gray-100 dark:border-gray-800 ${set.completed ? 'bg-green-50 dark:bg-green-900/10' : ''
                                                            }`}
                                                    >
                                                        <td className="py-3 px-2 font-semibold text-gray-900 dark:text-white">
                                                            {set.setNumber}
                                                        </td>
                                                        <td className="text-center py-3 px-2 text-gray-900 dark:text-white">
                                                            {set.weight || '-'}
                                                        </td>
                                                        <td className="text-center py-3 px-2 text-gray-900 dark:text-white">
                                                            {set.reps || '-'}
                                                        </td>
                                                        <td className="text-center py-3 px-2 text-gray-900 dark:text-white">
                                                            {set.weight && set.reps ? formatWeight((set.weight * set.reps), weightUnit) : '-'}
                                                        </td>
                                                        <td className="text-center py-3 px-2">
                                                            {set.completed ? (
                                                                <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400">
                                                                    <Check className="w-4 h-4" />
                                                                    Completed
                                                                </span>
                                                            ) : (
                                                                <span className="text-gray-400 dark:text-gray-600">Skipped</span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            <tfoot>
                                                <tr className="bg-gray-50 dark:bg-gray-800">
                                                    <td colSpan={3} className="py-2 px-2 text-right font-semibold text-gray-900 dark:text-white">
                                                        Exercise Total:
                                                    </td>
                                                    <td className="text-center py-2 px-2 font-bold text-gray-900 dark:text-white">
                                                        {formatWeight(
                                                            exercise.sets.reduce((total: number, set: any) =>
                                                                total + (set.weight * set.reps || 0), 0
                                                            ), weightUnit
                                                        )}
                                                    </td>
                                                    <td></td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default WorkoutDetailScreen;
