import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Modal, useColorScheme, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import WorkoutDetailModal from './WorkoutDetailModal';
import { useDeleteWorkoutMutation } from '@/slices/workoutApiSlice';
import recentWorkoutsStyles from '../../styles/dashboard/RecentWorkouts';

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
                <View style={recentWorkoutsStyles.headerLeft}>
                    <Ionicons name="time" size={22} color="#10B981" style={{ marginRight: 8 }} />
                    <Text style={isDark ? recentWorkoutsStyles.headerTitleDark : recentWorkoutsStyles.headerTitle}>
                        Recent Workouts
                    </Text>
                </View>
                <View style={isDark ? recentWorkoutsStyles.loadingContainerDark : recentWorkoutsStyles.loadingContainer}>
                    <ActivityIndicator size="large" color="#10B981" />
                    <Text style={isDark ? recentWorkoutsStyles.loadingTextDark : recentWorkoutsStyles.loadingText}>
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
                <View style={recentWorkoutsStyles.headerLeft}>
                    <Ionicons name="time" size={22} color="#10B981" style={{ marginRight: 8 }} />
                    <Text style={isDark ? recentWorkoutsStyles.headerTitleDark : recentWorkoutsStyles.headerTitle}>
                        Recent Workouts
                    </Text>
                </View>
                <View style={isDark ? recentWorkoutsStyles.emptyContainerDark : recentWorkoutsStyles.emptyContainer}>
                    <View style={isDark ? recentWorkoutsStyles.emptyIconWrapperDark : recentWorkoutsStyles.emptyIconWrapper}>
                        <Ionicons name="barbell-outline" size={40} color="#9CA3AF" />
                    </View>
                    <Text style={isDark ? recentWorkoutsStyles.emptyTitleDark : recentWorkoutsStyles.emptyTitle}>
                        No workouts yet
                    </Text>
                    <Text style={isDark ? recentWorkoutsStyles.emptySubtitleDark : recentWorkoutsStyles.emptySubtitle}>
                        Start your fitness journey today!
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View>
            <View style={recentWorkoutsStyles.headerRow}>
                <View style={recentWorkoutsStyles.headerLeft}>
                    <Ionicons name="time" size={22} color="#10B981" style={{ marginRight: 8 }} />
                    <Text style={isDark ? recentWorkoutsStyles.headerTitleDark : recentWorkoutsStyles.headerTitle}>
                        Recent Workouts
                    </Text>
                </View>
                <View style={recentWorkoutsStyles.headerRight}>
                    <TouchableOpacity
                        onPress={() => setShowAllModal(true)}
                        style={recentWorkoutsStyles.seeAllButton}
                    >
                        <Text style={isDark ? recentWorkoutsStyles.seeAllTextDark : recentWorkoutsStyles.seeAllText}>
                            See All
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={recentWorkoutsStyles.workoutsContainer}>
                {recentWorkouts.map((workout) => {
                    const isTemplate = workout.workoutType === 'template' && workout.templateName;
                    const stats = calculateStats(workout);

                    return (
                        <TouchableOpacity
                            key={workout._id}
                            activeOpacity={0.7}
                            onPress={() => setSelectedWorkout(workout)}
                            style={isDark ? recentWorkoutsStyles.workoutCardDark : recentWorkoutsStyles.workoutCard}
                        >
                            {/* Header */}
                            <View style={isDark ? recentWorkoutsStyles.workoutHeaderDark : recentWorkoutsStyles.workoutHeader}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <View>
                                        <View style={recentWorkoutsStyles.workoutTypeRow}>
                                            <Ionicons name={isTemplate ? "albums" : "flash"} size={14} color={isTemplate ? "#a855f7" : "#3b82f6"} />
                                            <Text style={isDark ? recentWorkoutsStyles.workoutTypeNameDark : recentWorkoutsStyles.workoutTypeName}>
                                                {isTemplate ? workout.templateName : 'Freestyle Workout'}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={isDark ? recentWorkoutsStyles.dateBadgeDark : recentWorkoutsStyles.dateBadge}>
                                        <Text style={isDark ? recentWorkoutsStyles.dateTextDark : recentWorkoutsStyles.dateText}>
                                            {formatDate(workout.createdAt)}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            {/* Stats Grid */}
                            <View style={recentWorkoutsStyles.statsSection}>
                                <View style={recentWorkoutsStyles.statsRow}>
                                    {/* Duration */}
                                    <View style={recentWorkoutsStyles.statItem}>
                                        <View style={recentWorkoutsStyles.statLabel}>
                                            <Ionicons name="time-outline" size={16} color="#3b82f6" />
                                            <Text style={isDark ? recentWorkoutsStyles.statLabelTextDark : recentWorkoutsStyles.statLabelText}>
                                                DURATION
                                            </Text>
                                        </View>
                                        <Text style={isDark ? recentWorkoutsStyles.statValueDark : recentWorkoutsStyles.statValue}>
                                            {workout.duration ? formatDuration(workout.duration) : 'N/A'}
                                        </Text>
                                    </View>

                                    {/* Exercises */}
                                    <View style={recentWorkoutsStyles.statItemLeft}>
                                        <View style={recentWorkoutsStyles.statLabel}>
                                            <Ionicons name="barbell-outline" size={16} color="#10b981" />
                                            <Text style={isDark ? recentWorkoutsStyles.statLabelTextDark : recentWorkoutsStyles.statLabelText}>
                                                EXERCISES
                                            </Text>
                                        </View>
                                        <Text style={isDark ? recentWorkoutsStyles.statValueDark : recentWorkoutsStyles.statValue}>
                                            {workout.exercises?.length || 0}
                                        </Text>
                                    </View>
                                </View>

                                <View style={recentWorkoutsStyles.statsRow}>
                                    {/* Sets */}
                                    <View style={recentWorkoutsStyles.statItem}>
                                        <View style={recentWorkoutsStyles.statLabel}>
                                            <Ionicons name="checkmark-circle-outline" size={16} color="#f59e0b" />
                                            <Text style={isDark ? recentWorkoutsStyles.statLabelTextDark : recentWorkoutsStyles.statLabelText}>
                                                SETS
                                            </Text>
                                        </View>
                                        <Text style={isDark ? recentWorkoutsStyles.statValueDark : recentWorkoutsStyles.statValue}>
                                            {stats.completedSets}/{stats.totalSets}
                                        </Text>
                                    </View>

                                    {/* Volume */}
                                    <View style={recentWorkoutsStyles.statItemLeft}>
                                        <View style={recentWorkoutsStyles.statLabel}>
                                            <Ionicons name="analytics-outline" size={16} color="#8b5cf6" />
                                            <Text style={isDark ? recentWorkoutsStyles.statLabelTextDark : recentWorkoutsStyles.statLabelText}>
                                                VOLUME
                                            </Text>
                                        </View>
                                        <Text style={isDark ? recentWorkoutsStyles.statValueDark : recentWorkoutsStyles.statValue}>
                                            {stats.totalVolume.toLocaleString()} lbs
                                        </Text>
                                    </View>
                                </View>

                                {/* Progress Bar */}
                                <View style={isDark ? recentWorkoutsStyles.progressBarDark : recentWorkoutsStyles.progressBar}>
                                    <View
                                        style={{
                                            backgroundColor: '#10b981',
                                            height: '100%',
                                            width: `${stats.totalSets > 0 ? (stats.completedSets / stats.totalSets) * 100 : 0}%`
                                        }}
                                    />
                                </View>
                                <Text style={isDark ? recentWorkoutsStyles.progressTextDark : recentWorkoutsStyles.progressText}>
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
