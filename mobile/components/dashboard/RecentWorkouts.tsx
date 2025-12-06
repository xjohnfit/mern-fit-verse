import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import WorkoutDetailModal from './WorkoutDetailModal';

interface Exercise {
    name: string;
    sets: number;
    reps: number;
    weight?: number;
}

interface Workout {
    _id: string;
    name: string;
    exercises: {
        name: string;
        sets: {
            setNumber: number;
            weight: number;
            reps: number;
            completed: boolean;
        }[];
    }[];
    date: string;
    duration?: number;
    createdAt: string;
    workoutType?: 'freestyle' | 'template';
    templateName?: string;
}

interface RecentWorkoutsProps {
    workouts: Workout[];
    isLoading: boolean;
}

export default function RecentWorkouts({ workouts, isLoading }: RecentWorkoutsProps) {
    const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const formatDuration = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);

        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${minutes}m`;
    };

    const calculateStats = (workout: Workout) => {
        let totalSets = 0;
        let completedSets = 0;
        let totalVolume = 0;

        workout.exercises?.forEach(exercise => {
            exercise.sets?.forEach(set => {
                totalSets++;
                if (set.completed) {
                    completedSets++;
                    totalVolume += (set.weight || 0) * (set.reps || 0);
                }
            });
        });

        return { totalSets, completedSets, totalVolume };
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
                {recentWorkouts.map((workout) => {
                    const isTemplate = workout.workoutType === 'template' && workout.templateName;
                    const stats = calculateStats(workout);

                    return (
                        <TouchableOpacity
                            key={workout._id}
                            activeOpacity={0.7}
                            onPress={() => setSelectedWorkout(workout)}
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-md"
                        >
                            {/* Header */}
                            <View className="p-4 border-b border-gray-200 dark:border-gray-700">
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Ionicons name={isTemplate ? "albums" : "flash"} size={14} color={isTemplate ? "#a855f7" : "#3b82f6"} />
                                            <Text className="text-xl text-gray-600 dark:text-gray-400 ml-1 font-medium">
                                                {isTemplate ? workout.templateName : 'Freestyle Workout'}
                                            </Text>
                                        </View>
                                    </View>
                                    <View className="bg-gray-100 dark:bg-gray-700 px-2.5 py-1.5 rounded-lg">
                                        <Text className="text-xs text-gray-600 dark:text-gray-400 font-semibold">
                                            {formatDate(workout.createdAt)}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            {/* Stats Grid */}
                            <View className="p-4">
                                <View style={{ flexDirection: 'row', marginBottom: 12 }}>
                                    {/* Duration */}
                                    <View style={{ flex: 1, marginRight: 8 }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                                            <Ionicons name="time-outline" size={16} color="#3b82f6" />
                                            <Text className="text-xs text-gray-600 dark:text-gray-400 ml-1 font-semibold">
                                                DURATION
                                            </Text>
                                        </View>
                                        <Text className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {workout.duration ? formatDuration(workout.duration) : 'N/A'}
                                        </Text>
                                    </View>

                                    {/* Exercises */}
                                    <View style={{ flex: 1, marginLeft: 8 }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                                            <Ionicons name="barbell-outline" size={16} color="#10b981" />
                                            <Text className="text-xs text-gray-600 dark:text-gray-400 ml-1 font-semibold">
                                                EXERCISES
                                            </Text>
                                        </View>
                                        <Text className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {workout.exercises?.length || 0}
                                        </Text>
                                    </View>
                                </View>

                                <View style={{ flexDirection: 'row', marginBottom: 12 }}>
                                    {/* Sets */}
                                    <View style={{ flex: 1, marginRight: 8 }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                                            <Ionicons name="checkmark-circle-outline" size={16} color="#f59e0b" />
                                            <Text className="text-xs text-gray-600 dark:text-gray-400 ml-1 font-semibold">
                                                SETS
                                            </Text>
                                        </View>
                                        <Text className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {stats.completedSets}/{stats.totalSets}
                                        </Text>
                                    </View>

                                    {/* Volume */}
                                    <View style={{ flex: 1, marginLeft: 8 }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                                            <Ionicons name="analytics-outline" size={16} color="#8b5cf6" />
                                            <Text className="text-xs text-gray-600 dark:text-gray-400 ml-1 font-semibold">
                                                VOLUME
                                            </Text>
                                        </View>
                                        <Text className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {stats.totalVolume.toLocaleString()} lbs
                                        </Text>
                                    </View>
                                </View>

                                {/* Progress Bar */}
                                <View className="bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                                    <View
                                        style={{
                                            backgroundColor: '#10b981',
                                            height: '100%',
                                            width: `${stats.totalSets > 0 ? (stats.completedSets / stats.totalSets) * 100 : 0}%`
                                        }}
                                    />
                                </View>
                                <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
                                    {stats.totalSets > 0 ? Math.round((stats.completedSets / stats.totalSets) * 100) : 0}% Complete
                                </Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
            <WorkoutDetailModal
                visible={selectedWorkout !== null}
                workout={selectedWorkout}
                onClose={() => setSelectedWorkout(null)}
            />
        </View>
    );
}
