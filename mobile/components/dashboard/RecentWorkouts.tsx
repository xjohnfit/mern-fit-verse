import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Exercise {
    name: string;
    sets: number;
    reps: number;
    weight?: number;
}

interface Workout {
    _id: string;
    name: string;
    exercises: Exercise[];
    date: string;
    duration?: number;
    createdAt: string;
}

interface RecentWorkoutsProps {
    workouts: Workout[];
    isLoading: boolean;
}

export default function RecentWorkouts({ workouts, isLoading }: RecentWorkoutsProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    if (isLoading) {
        return (
            <View>
                <View className="flex-row items-center mb-4">
                    <Ionicons name="time" size={22} color="#10B981" style={{ marginRight: 8 }} />
                    <Text className="text-xl font-bold text-gray-900 dark:text-white">
                        Recent Workouts
                    </Text>
                </View>
                <View className="bg-white dark:bg-gray-800 rounded-2xl p-8 items-center justify-center">
                    <ActivityIndicator size="large" color="#10B981" />
                    <Text className="text-gray-500 dark:text-gray-400 mt-3">
                        Loading workouts...
                    </Text>
                </View>
            </View>
        );
    }

    const recentWorkouts = workouts?.slice(0, 3) || [];

    if (recentWorkouts.length === 0) {
        return (
            <View>
                <View className="flex-row items-center mb-4">
                    <Ionicons name="time" size={22} color="#10B981" style={{ marginRight: 8 }} />
                    <Text className="text-xl font-bold text-gray-900 dark:text-white">
                        Recent Workouts
                    </Text>
                </View>
                <View className="bg-white dark:bg-gray-800 rounded-2xl p-8 items-center">
                    <View className="bg-gray-100 dark:bg-gray-700 rounded-full p-4 mb-3">
                        <Ionicons name="barbell-outline" size={40} color="#9CA3AF" />
                    </View>
                    <Text className="text-gray-900 dark:text-white font-semibold text-base mb-1">
                        No workouts yet
                    </Text>
                    <Text className="text-gray-500 dark:text-gray-400 text-center text-sm">
                        Start your fitness journey today!
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View>
            <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center">
                    <Ionicons name="time" size={22} color="#10B981" style={{ marginRight: 8 }} />
                    <Text className="text-xl font-bold text-gray-900 dark:text-white">
                        Recent Workouts
                    </Text>
                </View>
                <Text className="text-sm text-gray-500 dark:text-gray-400">
                    Last 3
                </Text>
            </View>
            <View className="gap-4">
                {recentWorkouts.map((workout, index) => (
                    <View
                        key={workout._id}
                        className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm"
                        style={{
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 8,
                            elevation: 3,
                        }}
                    >
                        <View className="flex-row items-start justify-between mb-3">
                            <View className="flex-1 mr-3">
                                <Text className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                                    {workout.name}
                                </Text>
                                <View className="flex-row items-center">
                                    <View className="bg-green-100 dark:bg-green-900/30 rounded-full px-3 py-1">
                                        <Text className="text-xs font-semibold text-green-700 dark:text-green-400">
                                            {workout.exercises?.length || 0} exercises
                                        </Text>
                                    </View>
                                    {workout.duration && (
                                        <View className="bg-blue-100 dark:bg-blue-900/30 rounded-full px-3 py-1 ml-2">
                                            <Text className="text-xs font-semibold text-blue-700 dark:text-blue-400">
                                                {workout.duration} min
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                            <View className="items-end">
                                <View className="bg-gray-100 dark:bg-gray-700 rounded-xl px-3 py-2">
                                    <Text className="text-xs font-bold text-gray-900 dark:text-white">
                                        {formatDate(workout.createdAt).split(' ')[0]}
                                    </Text>
                                    <Text className="text-lg font-bold text-gray-900 dark:text-white text-center">
                                        {formatDate(workout.createdAt).split(' ')[1]}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Exercise Preview */}
                        {workout.exercises && workout.exercises.length > 0 && (
                            <View className="border-t border-gray-200 dark:border-gray-700 pt-3">
                                <View className="flex-row items-center mb-2">
                                    <Ionicons name="list" size={14} color="#6B7280" />
                                    <Text className="text-xs text-gray-500 dark:text-gray-400 ml-1 font-semibold">
                                        Top Exercises
                                    </Text>
                                </View>
                                <View className="flex-row flex-wrap gap-2">
                                    {workout.exercises.slice(0, 3).map((exercise, idx) => (
                                        <View
                                            key={idx}
                                            className="bg-gray-50 dark:bg-gray-700/50 rounded-lg px-2 py-1"
                                        >
                                            <Text className="text-xs text-gray-600 dark:text-gray-300">
                                                {exercise.name}
                                            </Text>
                                        </View>
                                    ))}
                                    {workout.exercises.length > 3 && (
                                        <View className="bg-gray-50 dark:bg-gray-700/50 rounded-lg px-2 py-1">
                                            <Text className="text-xs text-gray-500 dark:text-gray-400">
                                                +{workout.exercises.length - 3} more
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                        )}
                    </View>
                ))}
            </View>
        </View>
    );
}
