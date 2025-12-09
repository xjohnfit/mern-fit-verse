import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Modal, useColorScheme, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import WorkoutDetailModal from './WorkoutDetailModal';
import { useDeleteWorkoutMutation } from '@/slices/workoutApiSlice';

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
    const [showAllModal, setShowAllModal] = useState(false);
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const [deleteWorkout, { isLoading: isDeleting }] = useDeleteWorkoutMutation();

    const handleDeleteWorkout = (workoutId: string, workoutName: string) => {
        Alert.alert(
            'Delete Workout',
            `Are you sure you want to delete "${workoutName}"? This action cannot be undone.`,
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteWorkout(workoutId).unwrap();
                            Alert.alert('Success', 'Workout deleted successfully');
                        } catch (error: any) {
                            Alert.alert('Error', error?.data?.message || 'Failed to delete workout');
                        }
                    },
                },
            ]
        );
    };

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
                <View className="flex-row items-center gap-2">
                    <TouchableOpacity
                        onPress={() => setShowAllModal(true)}
                        className="ml-2"
                    >
                        <Text className="text-sm text-blue-600 dark:text-blue-400 font-semibold">
                            See All
                        </Text>
                    </TouchableOpacity>
                </View>
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

            {/* All Workouts Modal */}
            <Modal
                visible={showAllModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowAllModal(false)}
            >
                <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0)' }}>
                    <View style={{
                        backgroundColor: isDark ? '#111827' : '#FFFFFF',
                        borderTopLeftRadius: 24,
                        borderTopRightRadius: 24,
                        height: '92%',
                        paddingBottom: 20
                    }}>
                        {/* Modal Header */}
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: 20,
                            borderBottomWidth: 1,
                            borderBottomColor: isDark ? '#374151' : '#E5E7EB'
                        }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Ionicons name="list" size={24} color="#10B981" style={{ marginRight: 8 }} />
                                <Text style={{ fontSize: 20, fontWeight: 'bold', color: isDark ? '#FFFFFF' : '#111827' }}>
                                    All Workouts
                                </Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => setShowAllModal(false)}
                                style={{
                                    backgroundColor: isDark ? '#1F2937' : '#F3F4F6',
                                    borderRadius: 20,
                                    padding: 8
                                }}
                            >
                                <Ionicons name="close" size={24} color="#6B7280" />
                            </TouchableOpacity>
                        </View>

                        {/* Workouts List */}
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ padding: 16, flexGrow: 1 }}
                        >
                            <View style={{ gap: 12 }}>
                                {workouts && workouts.length > 0 ? (
                                    workouts.map((workout, index) => {
                                        const isTemplate = workout.workoutType === 'template' && workout.templateName;
                                        return (
                                            <View
                                                key={workout._id}
                                                style={{
                                                    backgroundColor: isDark ? '#1F2937' : '#F9FAFB',
                                                    borderRadius: 12,
                                                    borderWidth: 1,
                                                    borderColor: isDark ? '#374151' : '#E5E7EB',
                                                    marginBottom: index < workouts.length - 1 ? 12 : 0,
                                                    flexDirection: 'row',
                                                    overflow: 'hidden'
                                                }}
                                            >
                                                <TouchableOpacity
                                                    activeOpacity={0.7}
                                                    onPress={() => {
                                                        setShowAllModal(false);
                                                        setSelectedWorkout(workout);
                                                    }}
                                                    style={{
                                                        flex: 1,
                                                        padding: 16,
                                                    }}
                                                >
                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <View style={{ flex: 1 }}>
                                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                                                                <Ionicons
                                                                    name={isTemplate ? "albums" : "flash"}
                                                                    size={16}
                                                                    color={isTemplate ? "#a855f7" : "#3b82f6"}
                                                                />
                                                                <Text
                                                                    style={{
                                                                        fontSize: 16,
                                                                        fontWeight: '600',
                                                                        color: isDark ? '#FFFFFF' : '#111827',
                                                                        marginLeft: 8,
                                                                        flex: 1
                                                                    }}
                                                                    numberOfLines={1}
                                                                >
                                                                    {isTemplate ? workout.templateName : workout.name || 'Freestyle Workout'}
                                                                </Text>
                                                            </View>
                                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                <Ionicons name="calendar-outline" size={14} color="#6B7280" />
                                                                <Text style={{ fontSize: 14, color: isDark ? '#9CA3AF' : '#6B7280', marginLeft: 4 }}>
                                                                    {formatDate(workout.createdAt)}
                                                                </Text>
                                                            </View>
                                                        </View>
                                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginLeft: 12 }}>
                                                            <View style={{ alignItems: 'center' }}>
                                                                <Text style={{ fontSize: 12, color: isDark ? '#9CA3AF' : '#6B7280' }}>Exercises</Text>
                                                                <Text style={{ fontSize: 16, fontWeight: 'bold', color: isDark ? '#FFFFFF' : '#111827' }}>
                                                                    {workout.exercises?.length || 0}
                                                                </Text>
                                                            </View>
                                                            <Ionicons name="chevron-forward" size={20} color="#6B7280" />
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    onPress={() => handleDeleteWorkout(workout._id, isTemplate ? workout.templateName || 'Workout' : workout.name || 'Freestyle Workout')}
                                                    disabled={isDeleting}
                                                    style={{
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        paddingHorizontal: 16,
                                                        backgroundColor: isDark ? '#7f1d1d' : '#fee2e2',
                                                        borderLeftWidth: 1,
                                                        borderLeftColor: isDark ? '#991b1b' : '#fecaca'
                                                    }}
                                                >
                                                    <Ionicons
                                                        name="trash-outline"
                                                        size={20}
                                                        color={isDark ? '#fca5a5' : '#dc2626'}
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                        );
                                    })
                                ) : (
                                    <View style={{ alignItems: 'center', paddingVertical: 48 }}>
                                        <View style={{
                                            backgroundColor: isDark ? '#374151' : '#F3F4F6',
                                            borderRadius: 40,
                                            padding: 16,
                                            marginBottom: 12
                                        }}>
                                            <Ionicons name="barbell-outline" size={40} color="#9CA3AF" />
                                        </View>
                                        <Text style={{ color: isDark ? '#FFFFFF' : '#111827', fontWeight: '600', fontSize: 16, marginBottom: 4 }}>
                                            No workouts yet
                                        </Text>
                                        <Text style={{ color: isDark ? '#9CA3AF' : '#6B7280', textAlign: 'center', fontSize: 14 }}>
                                            Start your fitness journey today!
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
