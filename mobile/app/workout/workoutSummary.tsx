import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    useColorScheme,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import createStyles from '../../styles/workout/workoutSummaryStyles';

const WorkoutSummary = () => {
    const insets = useSafeAreaInsets();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const styles = createStyles(isDark);
    const params = useLocalSearchParams();

    const { userInfo } = useSelector((state: any) => state.auth);
    const weightUnit = userInfo?.weightUnit || 'lbs';

    // Parse workout data from params
    const workoutData = params.workoutData ? JSON.parse(params.workoutData as string) : null;
    const duration = parseInt((params.duration as string) || '0');
    const templateName = params.templateName as string | undefined;
    const workoutType = (params.workoutType as string) || 'freestyle';

    if (!workoutData) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={styles.errorText}>No workout data available</Text>
                <TouchableOpacity
                    style={styles.doneButton}
                    onPress={() => router.replace('/workout')}
                    activeOpacity={0.8}
                >
                    <Text style={styles.doneButtonText}>Back to Workouts</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const formatTime = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hrs > 0) {
            return `${hrs}h ${mins}m ${secs}s`;
        }
        return `${mins}m ${secs}s`;
    };

    // Calculate workout stats
    const totalSets = workoutData.exercises.reduce(
        (sum: number, ex: any) => sum + ex.sets.length,
        0
    );
    const completedSets = workoutData.exercises.reduce(
        (sum: number, ex: any) => sum + ex.sets.filter((s: any) => s.completed).length,
        0
    );
    const totalReps = workoutData.exercises.reduce(
        (sum: number, ex: any) =>
            sum + ex.sets.reduce((reps: number, set: any) => reps + (set.reps || 0), 0),
        0
    );
    const totalVolume = workoutData.exercises.reduce(
        (sum: number, ex: any) =>
            sum +
            ex.sets.reduce(
                (vol: number, set: any) => vol + (set.weight || 0) * (set.reps || 0),
                0
            ),
        0
    );

    return (
        <View style={styles.container}>
            {/* Success Header */}
            <LinearGradient
                colors={['#10b981', '#059669']}
                style={[styles.header, { paddingTop: insets.top + 20 }]}
            >
                <View style={styles.successIconContainer}>
                    <View style={styles.successIconCircle}>
                        <Ionicons name="checkmark" size={48} color="#fff" />
                    </View>
                </View>
                <Text style={styles.headerTitle}>Workout Complete! 🎉</Text>
                <Text style={styles.headerSubtitle}>Great job finishing your workout</Text>
            </LinearGradient>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    {/* Workout Type Badge */}
                    {workoutType === 'template' && templateName && (
                        <View style={styles.templateBadgeContainer}>
                            <View style={styles.templateBadge}>
                                <Ionicons name="document-text" size={16} color="#3b82f6" />
                                <Text style={styles.templateBadgeText}>{templateName}</Text>
                            </View>
                        </View>
                    )}

                    {/* Stats Overview */}
                    <View style={styles.statsContainer}>
                        <View style={styles.statsGrid}>
                            <View style={styles.statCard}>
                                <LinearGradient
                                    colors={isDark ? ['#1e293b', '#0f172a'] : ['#fff', '#f9fafb']}
                                    style={styles.statCardGradient}
                                >
                                    <View style={styles.statIconContainer}>
                                        <Ionicons name="timer-outline" size={24} color="#3b82f6" />
                                    </View>
                                    <Text style={styles.statValue}>{formatTime(duration)}</Text>
                                    <Text style={styles.statLabel}>Duration</Text>
                                </LinearGradient>
                            </View>

                            <View style={styles.statCard}>
                                <LinearGradient
                                    colors={isDark ? ['#1e293b', '#0f172a'] : ['#fff', '#f9fafb']}
                                    style={styles.statCardGradient}
                                >
                                    <View style={styles.statIconContainer}>
                                        <Ionicons name="barbell-outline" size={24} color="#10b981" />
                                    </View>
                                    <Text style={styles.statValue}>{workoutData.exercises.length}</Text>
                                    <Text style={styles.statLabel}>Exercises</Text>
                                </LinearGradient>
                            </View>

                            <View style={styles.statCard}>
                                <LinearGradient
                                    colors={isDark ? ['#1e293b', '#0f172a'] : ['#fff', '#f9fafb']}
                                    style={styles.statCardGradient}
                                >
                                    <View style={styles.statIconContainer}>
                                        <Ionicons name="checkmark-circle-outline" size={24} color="#f59e0b" />
                                    </View>
                                    <Text style={styles.statValue}>{completedSets}/{totalSets}</Text>
                                    <Text style={styles.statLabel}>Sets</Text>
                                </LinearGradient>
                            </View>

                            <View style={styles.statCard}>
                                <LinearGradient
                                    colors={isDark ? ['#1e293b', '#0f172a'] : ['#fff', '#f9fafb']}
                                    style={styles.statCardGradient}
                                >
                                    <View style={styles.statIconContainer}>
                                        <Ionicons name="refresh-outline" size={24} color="#ef4444" />
                                    </View>
                                    <Text style={styles.statValue}>{totalReps}</Text>
                                    <Text style={styles.statLabel}>Total Reps</Text>
                                </LinearGradient>
                            </View>

                            <View style={styles.statCard}>
                                <LinearGradient
                                    colors={isDark ? ['#1e293b', '#0f172a'] : ['#fff', '#f9fafb']}
                                    style={styles.statCardGradient}
                                >
                                    <View style={styles.statIconContainer}>
                                        <Ionicons name="analytics-outline" size={24} color="#8b5cf6" />
                                    </View>
                                    <Text style={styles.statValue}>{totalVolume.toLocaleString()}</Text>
                                    <Text style={styles.statLabel}>Volume ({weightUnit})</Text>
                                </LinearGradient>
                            </View>
                        </View>
                    </View>

                    {/* Exercise Details */}
                    <View style={styles.exercisesSection}>
                        <Text style={styles.sectionTitle}>Exercise Details</Text>
                        {workoutData.exercises.map((exercise: any, index: number) => {
                            const exerciseSets = exercise.sets.filter((s: any) => s.completed);
                            const exerciseReps = exerciseSets.reduce(
                                (sum: number, set: any) => sum + (set.reps || 0),
                                0
                            );
                            const exerciseVolume = exerciseSets.reduce(
                                (sum: number, set: any) => sum + (set.weight || 0) * (set.reps || 0),
                                0
                            );

                            return (
                                <View key={exercise.exerciseId || index} style={styles.exerciseCard}>
                                    <View style={styles.exerciseHeader}>
                                        <View style={styles.exerciseHeaderLeft}>
                                            <View style={styles.exerciseNumber}>
                                                <Text style={styles.exerciseNumberText}>{index + 1}</Text>
                                            </View>
                                            <View style={styles.exerciseHeaderText}>
                                                <Text style={styles.exerciseName}>
                                                    {exercise.exerciseName}
                                                </Text>
                                                <View style={styles.exerciseStats}>
                                                    <Text style={styles.exerciseStatText}>
                                                        {exerciseSets.length} sets • {exerciseReps} reps
                                                    </Text>
                                                    {exerciseVolume > 0 && (
                                                        <>
                                                            <Text style={styles.exerciseStatDot}>•</Text>
                                                            <Text style={styles.exerciseStatText}>
                                                                {exerciseVolume.toLocaleString()} {weightUnit}
                                                            </Text>
                                                        </>
                                                    )}
                                                </View>
                                            </View>
                                        </View>
                                    </View>

                                    {/* Sets Table */}
                                    <View style={styles.setsTable}>
                                        <View style={styles.tableHeader}>
                                            <Text style={[styles.tableHeaderText, styles.setColumn]}>Set</Text>
                                            <Text style={[styles.tableHeaderText, styles.weightColumn]}>
                                                Weight ({weightUnit})
                                            </Text>
                                            <Text style={[styles.tableHeaderText, styles.repsColumn]}>Reps</Text>
                                            <Text style={[styles.tableHeaderText, styles.statusColumn]}>✓</Text>
                                        </View>
                                        {exercise.sets.map((set: any) => (
                                            <View
                                                key={set.setNumber}
                                                style={[
                                                    styles.tableRow,
                                                    !set.completed && styles.tableRowIncomplete,
                                                ]}
                                            >
                                                <Text style={[styles.tableCellText, styles.setColumn]}>
                                                    {set.setNumber}
                                                </Text>
                                                <Text style={[styles.tableCellText, styles.weightColumn]}>
                                                    {set.weight || 0}
                                                </Text>
                                                <Text style={[styles.tableCellText, styles.repsColumn]}>
                                                    {set.reps || 0}
                                                </Text>
                                                <View style={[styles.statusColumn, { alignItems: 'center' }]}>
                                                    {set.completed ? (
                                                        <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                                                    ) : (
                                                        <Ionicons name="close-circle" size={20} color="#94a3b8" />
                                                    )}
                                                </View>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Action Button */}
            <View style={[styles.bottomContainer, { paddingBottom: insets.bottom + 16 }]}>
                <TouchableOpacity
                    style={styles.doneButton}
                    onPress={() => router.replace('/workout')}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={['#3b82f6', '#2563eb']}
                        style={styles.doneButtonGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    >
                        <Text style={styles.doneButtonText}>Done</Text>
                        <Ionicons name="arrow-forward" size={20} color="#fff" />
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default WorkoutSummary;

