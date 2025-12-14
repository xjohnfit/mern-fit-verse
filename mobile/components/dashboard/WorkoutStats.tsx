import React from 'react';
import { View, Text, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import StatsCard from '@/components/dashboard/StatsCard';
import WorkoutStatsStyles from '../../styles/dashboard/WorkoutStatsStyles';

interface WorkoutStatsProps {
    workoutStats: {
        totalWorkouts?: number;
        workoutsThisWeek?: number;
    } | undefined;
    daysActive: number;
}

const WorkoutStats: React.FC<WorkoutStatsProps> = ({ workoutStats, daysActive }) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const styles = WorkoutStatsStyles;

    return (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Ionicons name="barbell" size={20} color="#10B981" style={styles.headerIcon} />
                <Text style={isDark ? styles.sectionTitleDark : styles.sectionTitle}>
                    Workout Stats
                </Text>
            </View>
            <View style={styles.statsRow}>
                <View style={styles.statsCard}>
                    <StatsCard
                        icon="barbell"
                        iconColor="#fff"
                        bgColor="#06B6D4"
                        label="Total Workouts"
                        value={workoutStats?.totalWorkouts || 0}
                        subtitle="All time"
                    />
                </View>
                <View style={styles.statsCard}>
                    <StatsCard
                        icon="calendar-outline"
                        iconColor="#fff"
                        bgColor="#EC4899"
                        label="This Week"
                        value={workoutStats?.workoutsThisWeek || 0}
                        subtitle="Keep it up! 💪"
                    />
                </View>
            </View>
            <StatsCard
                icon="trending-up"
                iconColor="#fff"
                bgColor="#14B8A6"
                label="Avg. Per Week"
                value={daysActive > 0 ? ((workoutStats?.totalWorkouts || 0) / (daysActive / 7)).toFixed(1) : 0}
                subtitle="Consistency score"
            />
        </View>
    );
};

export default WorkoutStats;
