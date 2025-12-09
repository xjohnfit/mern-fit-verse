import React, { useMemo } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    useColorScheme,
    Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import type { WorkoutTemplate } from '@/types/workout.types';

interface TemplateCardProps {
    template: WorkoutTemplate;
    hasActiveWorkout?: boolean;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({ template, hasActiveWorkout = false }) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const styles = useMemo(() => createStyles(isDark), [isDark]);

    const totalSets = template.exercises.reduce((acc, exercise) => acc + exercise.sets.length, 0);

    const handleStartWorkout = () => {
        if (hasActiveWorkout) {
            Alert.alert(
                'Active Workout',
                'You already have an active workout in progress. Please finish or cancel your current workout before starting a new one.',
                [{ text: 'OK' }]
            );
            return;
        }
        router.push(`/workout/start?templateId=${template._id}` as any);
    };

    const handleEditTemplate = () => {
        router.push(`/workout/edit-template/${template._id}` as any);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.content}
                onPress={handleEditTemplate}
                activeOpacity={0.7}
            >
                <View style={styles.iconContainer}>
                    <Ionicons name="document-text" size={18} color={isDark ? '#e9d5ff' : '#9333ea'} />
                </View>
                <View style={styles.info}>
                    <Text style={styles.name} numberOfLines={1}>
                        {template.name}
                    </Text>
                    {template.description && (
                        <Text style={styles.description} numberOfLines={1}>
                            {template.description}
                        </Text>
                    )}
                    <View style={styles.stats}>
                        <View style={styles.stat}>
                            <Ionicons name="barbell-outline" size={12} color={isDark ? '#94a3b8' : '#6b7280'} />
                            <Text style={styles.statText}>
                                {template.exercises.length} exercises
                            </Text>
                        </View>
                        <View style={styles.stat}>
                            <Ionicons name="fitness-outline" size={12} color={isDark ? '#94a3b8' : '#6b7280'} />
                            <Text style={styles.statText}>{totalSets} sets</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.startButton, hasActiveWorkout && styles.startButtonDisabled]}
                onPress={handleStartWorkout}
                activeOpacity={hasActiveWorkout ? 1 : 0.7}
            >
                <LinearGradient
                    colors={['#3b82f6', '#2563eb']}
                    style={styles.startButtonGradient}
                >
                    <Ionicons name="play" size={14} color="#fff" />
                    <Text style={styles.startButtonText}>Start</Text>
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );
};

const createStyles = (isDark: boolean) => StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: isDark ? '#334155' : '#ffffff',
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: isDark ? '#475569' : '#e5e7eb',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 8,
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 6,
        backgroundColor: isDark ? '#7e22ce' : '#f3e8ff',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: 14,
        fontWeight: '600',
        color: isDark ? '#f1f5f9' : '#111827',
        marginBottom: 2,
    },
    description: {
        fontSize: 12,
        color: isDark ? '#94a3b8' : '#6b7280',
        marginBottom: 4,
    },
    stats: {
        flexDirection: 'row',
        gap: 12,
    },
    stat: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    statText: {
        fontSize: 11,
        color: isDark ? '#94a3b8' : '#6b7280',
    },
    startButton: {
        borderRadius: 8,
        overflow: 'hidden',
        marginLeft: 8,
    },
    startButtonDisabled: {
        opacity: 0.5,
    },
    startButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 12,
        gap: 4,
    },
    startButtonText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#fff',
    },
});
