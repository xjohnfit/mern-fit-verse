import React from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity, Dimensions, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import WorkoutDetailModalStyles from '@/styles/dashboard/WorkoutDetailModalStyles';

interface WorkoutDetailModalProps {
    visible: boolean;
    workout: any;
    onClose: () => void;
}

export default function WorkoutDetailModal({ visible, workout, onClose }: WorkoutDetailModalProps) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const styles = WorkoutDetailModalStyles(isDark);
    const { userInfo } = useSelector((state: RootState) => state.auth);
    const weightUnit = userInfo?.weightUnit || 'lbs';

    if (!workout) return null;

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
        return workout.exercises.reduce((total: number, exercise: any) => {
            return total + exercise.sets.reduce((setTotal: number, set: any) => {
                return setTotal + ((set.weight || 0) * (set.reps || 0));
            }, 0);
        }, 0);
    };

    const calculateCompletedSets = () => {
        const totalSets = workout.exercises.reduce((total: number, exercise: any) => total + exercise.sets.length, 0);
        const completedSets = workout.exercises.reduce((total: number, exercise: any) => {
            return total + exercise.sets.filter((set: any) => set.completed).length;
        }, 0);
        return { completed: completedSets, total: totalSets };
    };

    const isTemplate = workout.workoutType === 'template' && workout.templateName;
    const sets = calculateCompletedSets();
    const volume = calculateTotalVolume();

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.headerRow}>
                            <View style={[styles.headerIconContainer, isTemplate ? styles.headerIconContainerTemplate : styles.headerIconContainerFreestyle]}>
                                <Ionicons
                                    name="barbell"
                                    size={24}
                                    color={isTemplate ? '#9333ea' : '#2563eb'}
                                />
                            </View>
                            <View style={styles.headerCenter}>
                                <View style={[styles.workoutTypeBadge, isTemplate ? styles.workoutTypeBadgeTemplate : styles.workoutTypeBadgeFreestyle]}>
                                    <Text style={[styles.workoutTypeText, isTemplate ? styles.workoutTypeTextTemplate : styles.workoutTypeTextFreestyle]}>
                                        {isTemplate ? workout.templateName : 'Freestyle'}
                                    </Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                onPress={onClose}
                                style={styles.closeButton}
                            >
                                <Ionicons name="close" size={24} color="#6b7280" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.dateRow}>
                            <Ionicons name="calendar" size={14} color="#6b7280" />
                            <Text style={styles.dateText}>
                                {formatDate(workout.completedAt || workout.createdAt)}
                            </Text>
                        </View>
                    </View>

                    {/* Scrollable Content */}
                    <ScrollView style={styles.scrollView}>
                        {/* Summary Stats */}
                        <View style={styles.statsContainer}>
                            <View style={styles.statsRowTop}>
                                <View style={[styles.statCard, styles.statCardBlue]}>
                                    <View style={styles.statHeader}>
                                        <View style={[styles.statIconContainer, styles.statIconBlue]}>
                                            <Ionicons name="time" size={16} color="white" />
                                        </View>
                                        <Text style={styles.statLabel}>
                                            DURATION
                                        </Text>
                                    </View>
                                    <Text style={[styles.statValue, styles.statValueBlue]}>
                                        {formatDuration(workout.duration)}
                                    </Text>
                                </View>

                                <View style={[styles.statCard, styles.statCardGreen]}>
                                    <View style={styles.statHeader}>
                                        <View style={[styles.statIconContainer, styles.statIconGreen]}>
                                            <Ionicons name="list" size={16} color="white" />
                                        </View>
                                        <Text style={styles.statLabel}>
                                            EXERCISES
                                        </Text>
                                    </View>
                                    <Text style={[styles.statValue, styles.statValueGreen]}>
                                        {workout.exercises.length}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.statsRowBottom}>
                                <View style={[styles.statCard, styles.statCardOrange]}>
                                    <View style={styles.statHeader}>
                                        <View style={[styles.statIconContainer, styles.statIconOrange]}>
                                            <Ionicons name="checkmark-circle" size={16} color="white" />
                                        </View>
                                        <Text style={styles.statLabel}>
                                            SETS
                                        </Text>
                                    </View>
                                    <Text style={[styles.statValue, styles.statValueOrange]}>
                                        {sets.completed}/{sets.total}
                                    </Text>
                                </View>

                                <View style={[styles.statCard, styles.statCardPurple]}>
                                    <View style={styles.statHeader}>
                                        <View style={[styles.statIconContainer, styles.statIconPurple]}>
                                            <Ionicons name="trending-up" size={16} color="white" />
                                        </View>
                                        <Text style={styles.statLabel}>
                                            VOLUME
                                        </Text>
                                    </View>
                                    <Text style={[styles.statValue, styles.statValuePurple]}>
                                        {volume.toLocaleString()} {weightUnit}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Exercises List */}
                        <View style={styles.exercisesContainer}>
                            <Text style={styles.exercisesTitle}>
                                Exercises
                            </Text>
                            {workout.exercises.map((exercise: any, index: number) => (
                                <View
                                    key={exercise.exerciseId || index}
                                    style={styles.exerciseCard}
                                >
                                    <View style={styles.exerciseHeader}>
                                        <View style={styles.exerciseHeaderRow}>
                                            <View style={styles.exerciseNumber}>
                                                <Text style={styles.exerciseNumberText}>
                                                    {index + 1}
                                                </Text>
                                            </View>
                                            <Text style={styles.exerciseName}>
                                                {exercise.exerciseName || exercise.name}
                                            </Text>
                                        </View>

                                        {/* Sets Table */}
                                        <View style={styles.setsTable}>
                                            {/* Header */}
                                            <View style={styles.tableHeaderRow}>
                                                <Text style={styles.tableHeaderText}>
                                                    Set
                                                </Text>
                                                <Text style={styles.tableHeaderTextCenter}>
                                                    Weight ({weightUnit})
                                                </Text>
                                                <Text style={styles.tableHeaderTextCenter}>
                                                    Reps
                                                </Text>
                                                <Text style={styles.tableHeaderTextCenter}>
                                                    Volume
                                                </Text>
                                            </View>

                                            {/* Rows */}
                                            {exercise.sets.map((set: any) => (
                                                <View
                                                    key={set.setNumber}
                                                    style={set.completed ? styles.tableRowCompleted : styles.tableRowIncomplete}
                                                >
                                                    <Text style={styles.tableCellText}>
                                                        {set.setNumber}
                                                    </Text>
                                                    <Text style={styles.tableCellTextCenter}>
                                                        {set.weight || '-'}
                                                    </Text>
                                                    <Text style={styles.tableCellTextCenter}>
                                                        {set.reps || '-'}
                                                    </Text>
                                                    <Text style={styles.tableCellTextCenter}>
                                                        {set.weight && set.reps ? (set.weight * set.reps).toFixed(0) : '-'}
                                                    </Text>
                                                </View>
                                            ))}

                                            {/* Footer Total */}
                                            <View style={styles.tableFooterRow}>
                                                <Text style={styles.tableFooterLabel}>
                                                    Exercise Total:
                                                </Text>
                                                <Text style={styles.tableFooterValue}>
                                                    {exercise.sets.reduce((total: number, set: any) =>
                                                        total + ((set.weight || 0) * (set.reps || 0)), 0
                                                    ).toFixed(0)}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}
