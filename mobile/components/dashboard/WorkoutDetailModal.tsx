import React from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface WorkoutDetailModalProps {
    visible: boolean;
    workout: any;
    onClose: () => void;
}

export default function WorkoutDetailModal({ visible, workout, onClose }: WorkoutDetailModalProps) {
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
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <View className="flex-1 mt-16 bg-gray-50 dark:bg-gray-900 rounded-t-3xl">
                    {/* Header */}
                    <View className="p-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-t-3xl">
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                            <View style={{
                                backgroundColor: isTemplate ? '#f3e8ff' : '#dbeafe',
                                padding: 10,
                                borderRadius: 12,
                            }}>
                                <Ionicons
                                    name="barbell"
                                    size={24}
                                    color={isTemplate ? '#9333ea' : '#2563eb'}
                                />
                            </View>
                            <View style={{ flex: 1, alignItems: 'center', marginHorizontal: 12 }}>
                                <View className={`px-2.5 py-1 rounded-xl ${isTemplate ? 'bg-purple-100 dark:bg-purple-900/30' : 'bg-blue-100 dark:bg-blue-900/30'}`}>
                                    <Text className={`text-xl font-semibold ${isTemplate ? 'text-purple-700 dark:text-purple-300' : 'text-blue-700 dark:text-blue-300'}`}>
                                        {isTemplate ? workout.templateName : 'Freestyle'}
                                    </Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                onPress={onClose}
                                className="bg-gray-100 dark:bg-gray-700 rounded-full w-10 h-10 justify-center items-center"
                            >
                                <Ionicons name="close" size={24} className="text-gray-600 dark:text-gray-400" color="#6b7280" />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Ionicons name="calendar" size={14} color="#6b7280" />
                            <Text className="text-xs text-gray-600 dark:text-gray-400 ml-1.5">
                                {formatDate(workout.completedAt || workout.createdAt)}
                            </Text>
                        </View>
                    </View>

                    {/* Scrollable Content */}
                    <ScrollView style={{ flex: 1 }}>
                        {/* Summary Stats */}
                        <View className="bg-white dark:bg-gray-800 p-4 mb-2">
                            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
                                <View className="flex-1 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                                        <View style={{ backgroundColor: '#3b82f6', padding: 6, borderRadius: 8 }}>
                                            <Ionicons name="time" size={16} color="white" />
                                        </View>
                                        <Text className="text-xs text-gray-600 dark:text-gray-400 ml-2 font-semibold">
                                            DURATION
                                        </Text>
                                    </View>
                                    <Text className="text-xl font-bold text-blue-800 dark:text-blue-200">
                                        {formatDuration(workout.duration)}
                                    </Text>
                                </View>

                                <View className="flex-1 bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                                        <View style={{ backgroundColor: '#10b981', padding: 6, borderRadius: 8 }}>
                                            <Ionicons name="list" size={16} color="white" />
                                        </View>
                                        <Text className="text-xs text-gray-600 dark:text-gray-400 ml-2 font-semibold">
                                            EXERCISES
                                        </Text>
                                    </View>
                                    <Text className="text-xl font-bold text-green-800 dark:text-green-200">
                                        {workout.exercises.length}
                                    </Text>
                                </View>
                            </View>

                            <View style={{ flexDirection: 'row', gap: 12 }}>
                                <View className="flex-1 bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl">
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                                        <View style={{ backgroundColor: '#f59e0b', padding: 6, borderRadius: 8 }}>
                                            <Ionicons name="checkmark-circle" size={16} color="white" />
                                        </View>
                                        <Text className="text-xs text-gray-600 dark:text-gray-400 ml-2 font-semibold">
                                            SETS
                                        </Text>
                                    </View>
                                    <Text className="text-xl font-bold text-orange-800 dark:text-orange-200">
                                        {sets.completed}/{sets.total}
                                    </Text>
                                </View>

                                <View className="flex-1 bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl">
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                                        <View style={{ backgroundColor: '#8b5cf6', padding: 6, borderRadius: 8 }}>
                                            <Ionicons name="trending-up" size={16} color="white" />
                                        </View>
                                        <Text className="text-xs text-gray-600 dark:text-gray-400 ml-2 font-semibold">
                                            VOLUME
                                        </Text>
                                    </View>
                                    <Text className="text-xl font-bold text-purple-800 dark:text-purple-200">
                                        {volume.toLocaleString()} {weightUnit}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Exercises List */}
                        <View className="p-4 pt-2">
                            <Text className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                                Exercises
                            </Text>
                            {workout.exercises.map((exercise: any, index: number) => (
                                <View
                                    key={exercise.exerciseId || index}
                                    className="bg-white dark:bg-gray-800 rounded-xl mb-4 border-l-4 border-blue-500 overflow-hidden"
                                >
                                    <View style={{ padding: 16 }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                                            <View style={{
                                                width: 32,
                                                height: 32,
                                                backgroundColor: '#3b82f6',
                                                borderRadius: 16,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                marginRight: 12
                                            }}>
                                                <Text style={{ color: 'white', fontSize: 14, fontWeight: '600' }}>
                                                    {index + 1}
                                                </Text>
                                            </View>
                                            <Text className="text-base font-bold text-gray-900 dark:text-white flex-1">
                                                {exercise.exerciseName || exercise.name}
                                            </Text>
                                        </View>

                                        {/* Sets Table */}
                                        <View className="bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden">
                                            {/* Header */}
                                            <View className="flex-row py-2.5 px-2 border-b border-gray-200 dark:border-gray-700">
                                                <Text className="flex-1 text-xs font-semibold text-gray-600 dark:text-gray-400">
                                                    Set
                                                </Text>
                                                <Text className="flex-1 text-xs font-semibold text-gray-600 dark:text-gray-400 text-center">
                                                    Weight ({weightUnit})
                                                </Text>
                                                <Text className="flex-1 text-xs font-semibold text-gray-600 dark:text-gray-400 text-center">
                                                    Reps
                                                </Text>
                                                <Text className="flex-1 text-xs font-semibold text-gray-600 dark:text-gray-400 text-center">
                                                    Volume
                                                </Text>
                                            </View>

                                            {/* Rows */}
                                            {exercise.sets.map((set: any) => (
                                                <View
                                                    key={set.setNumber}
                                                    className={`flex-row py-3 px-2 border-b border-gray-100 dark:border-gray-800 ${set.completed ? 'bg-green-50 dark:bg-green-900/20' : 'bg-white dark:bg-gray-900'}`}
                                                >
                                                    <Text className="flex-1 text-sm font-semibold text-gray-900 dark:text-white">
                                                        {set.setNumber}
                                                    </Text>
                                                    <Text className="flex-1 text-sm text-gray-900 dark:text-white text-center">
                                                        {set.weight || '-'}
                                                    </Text>
                                                    <Text className="flex-1 text-sm text-gray-900 dark:text-white text-center">
                                                        {set.reps || '-'}
                                                    </Text>
                                                    <Text className="flex-1 text-sm text-gray-900 dark:text-white text-center">
                                                        {set.weight && set.reps ? (set.weight * set.reps).toFixed(0) : '-'}
                                                    </Text>
                                                </View>
                                            ))}

                                            {/* Footer Total */}
                                            <View className="flex-row py-2.5 px-2 bg-gray-200 dark:bg-gray-800">
                                                <Text className="flex-[3] text-sm font-semibold text-gray-900 dark:text-white text-right pr-2">
                                                    Exercise Total:
                                                </Text>
                                                <Text className="flex-1 text-sm font-bold text-gray-900 dark:text-white text-center">
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
