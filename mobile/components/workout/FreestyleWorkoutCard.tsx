import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme, Alert } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface FreestyleWorkoutCardProps {
    hasActiveWorkout?: boolean;
}

export const FreestyleWorkoutCard: React.FC<FreestyleWorkoutCardProps> = ({ hasActiveWorkout = false }) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const styles = useMemo(() => createStyles(isDark), [isDark]);

    const handlePress = () => {
        if (hasActiveWorkout) {
            Alert.alert(
                'Active Workout',
                'You already have an active workout in progress. Please finish or cancel your current workout before starting a new one.',
                [{ text: 'OK' }]
            );
            return;
        }
        router.push('/workout/start' as any);
    };

    return (
        <TouchableOpacity
            style={[styles.freestyleCard, hasActiveWorkout && styles.cardDisabled]}
            onPress={handlePress}
            activeOpacity={hasActiveWorkout ? 1 : 0.85}
        >
            <LinearGradient
                colors={isDark ? ['#1e3a8a', '#1e40af', '#2563eb'] : ['#dbeafe', '#bfdbfe', '#93c5fd']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.cardGradient}
            >
                <View style={styles.freestyleHeader}>
                    <View style={styles.freestyleIcon}>
                        <LinearGradient
                            colors={['#3b82f6', '#2563eb', '#1d4ed8']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.freestyleIconGradient}
                        >
                            <Ionicons name="flash" size={32} color="#fff" />
                        </LinearGradient>
                    </View>
                    <View style={styles.freestyleBadge}>
                        <LinearGradient
                            colors={['#fbbf24', '#f59e0b']}
                            style={styles.badgeGradient}
                        >
                            <Ionicons name="rocket" size={12} color="#fff" />
                            <Text style={styles.freestyleBadgeText}>QUICK START</Text>
                        </LinearGradient>
                    </View>
                </View>
                <Text style={styles.freestyleTitle}>Freestyle Workout</Text>
                <Text style={styles.freestyleDescription}>
                    Jump right in and add exercises on the fly. Perfect for spontaneous
                    training sessions without planning ahead.
                </Text>
                <View style={styles.freestyleTags}>
                    <View style={styles.freestyleTag}>
                        <Ionicons name="infinite" size={14} color={isDark ? '#f1f5f9' : '#1e40af'} />
                        <Text style={styles.freestyleTagText}>Flexible</Text>
                    </View>
                    <View style={styles.freestyleTag}>
                        <Ionicons name="time-outline" size={14} color={isDark ? '#f1f5f9' : '#1e40af'} />
                        <Text style={styles.freestyleTagText}>No Planning</Text>
                    </View>
                    <View style={styles.freestyleTag}>
                        <Ionicons name="rocket-outline" size={14} color={isDark ? '#f1f5f9' : '#1e40af'} />
                        <Text style={styles.freestyleTagText}>Spontaneous</Text>
                    </View>
                </View>
                <View style={styles.startButton}>
                    <Text style={styles.startButtonText}>Start Workout</Text>
                    <Ionicons name="arrow-forward" size={18} color={isDark ? '#f1f5f9' : '#1e40af'} />
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );
};

const createStyles = (isDark: boolean) => StyleSheet.create({
    freestyleCard: {
        borderRadius: 20,
        overflow: 'hidden',
        elevation: 6,
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    cardDisabled: {
        opacity: 0.5,
    },
    cardGradient: {
        padding: 24,
    },
    freestyleHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    freestyleIcon: {
        borderRadius: 18,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    freestyleIconGradient: {
        width: 64,
        height: 64,
        alignItems: 'center',
        justifyContent: 'center',
    },
    freestyleBadge: {
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    badgeGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        gap: 4,
    },
    freestyleBadgeText: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#fff',
        letterSpacing: 0.5,
    },
    freestyleTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: isDark ? '#f1f5f9' : '#1e3a8a',
        marginBottom: 10,
    },
    freestyleDescription: {
        fontSize: 15,
        color: isDark ? '#cbd5e1' : '#1e40af',
        lineHeight: 22,
        marginBottom: 20,
        fontWeight: '500',
    },
    freestyleTags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 20,
    },
    freestyleTag: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.15)' : '#fff',
        gap: 6,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    freestyleTagText: {
        fontSize: 13,
        fontWeight: '600',
        color: isDark ? '#f1f5f9' : '#1e40af',
    },
    startButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.15)' : '#fff',
        paddingVertical: 14,
        borderRadius: 14,
        gap: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    startButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: isDark ? '#f1f5f9' : '#1e40af',
    },
});
