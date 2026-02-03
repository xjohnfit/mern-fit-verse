import React from 'react';
import { View, Text, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import WorkoutStatsStyles from '../../styles/dashboard/WorkoutStatsStyles';

interface WorkoutStatsProps {
    workoutStats: {
        totalWorkouts?: number;
        workoutsThisWeek?: number;
    } | undefined;
    daysActive: number;
    compact?: boolean;
}

const WorkoutStats: React.FC<WorkoutStatsProps> = ({ workoutStats, daysActive, compact = false }) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const styles = WorkoutStatsStyles;

    const avgPerWeek = daysActive > 0
        ? ((workoutStats?.totalWorkouts || 0) / (daysActive / 7)).toFixed(1)
        : '0';

    const cardStyle = compact
        ? (isDark ? styles.cardCompactDark : styles.cardCompact)
        : (isDark ? styles.cardDark : styles.card);

    const headerStyle = compact ? styles.cardHeaderCompact : styles.cardHeader;
    const titleStyle = compact
        ? (isDark ? styles.cardTitleCompactDark : styles.cardTitleCompact)
        : (isDark ? styles.cardTitleDark : styles.cardTitle);
    const iconSize = compact ? 16 : 22;

    return (
        <View style={compact ? styles.sectionCompact : styles.section}>
            <View style={cardStyle}>
                <View style={headerStyle}>
                    <Ionicons name="barbell" size={iconSize} color="#10B981" style={styles.headerIcon} />
                    <Text style={titleStyle}>
                        Workout Stats
                    </Text>
                </View>

                <View style={compact ? styles.statsContainerCompact : styles.statsContainer}>
                    {/* Total Workouts */}
                    <View style={compact ? styles.statItemCompact : styles.statItem}>
                        <View style={[compact ? styles.iconCircleCompact : styles.iconCircle, { backgroundColor: '#06B6D4' }]}>
                            <Ionicons name="barbell" size={compact ? 14 : 20} color="#fff" />
                        </View>
                        <Text style={isDark ? (compact ? styles.statLabelCompactDark : styles.statLabelDark) : (compact ? styles.statLabelCompact : styles.statLabel)}>Total</Text>
                        <Text style={isDark ? (compact ? styles.statValueCompactDark : styles.statValueDark) : (compact ? styles.statValueCompact : styles.statValue)}>
                            {workoutStats?.totalWorkouts || 0}
                        </Text>
                        <Text style={compact ? styles.statSubtitleCompact : styles.statSubtitle}>All time</Text>
                    </View>

                    {/* Divider */}
                    <View style={isDark ? (compact ? styles.dividerCompactDark : styles.dividerDark) : (compact ? styles.dividerCompact : styles.divider)} />

                    {/* This Week */}
                    <View style={compact ? styles.statItemCompact : styles.statItem}>
                        <View style={[compact ? styles.iconCircleCompact : styles.iconCircle, { backgroundColor: '#EC4899' }]}>
                            <Ionicons name="calendar-outline" size={compact ? 14 : 20} color="#fff" />
                        </View>
                        <Text style={isDark ? (compact ? styles.statLabelCompactDark : styles.statLabelDark) : (compact ? styles.statLabelCompact : styles.statLabel)}>This Week</Text>
                        <Text style={isDark ? (compact ? styles.statValueCompactDark : styles.statValueDark) : (compact ? styles.statValueCompact : styles.statValue)}>
                            {workoutStats?.workoutsThisWeek || 0}
                        </Text>
                        <Text style={compact ? styles.statSubtitleCompact : styles.statSubtitle}>Keep going</Text>
                    </View>

                    {/* Divider */}
                    <View style={isDark ? (compact ? styles.dividerCompactDark : styles.dividerDark) : (compact ? styles.dividerCompact : styles.divider)} />

                    {/* Avg Per Week */}
                    <View style={compact ? styles.statItemCompact : styles.statItem}>
                        <View style={[compact ? styles.iconCircleCompact : styles.iconCircle, { backgroundColor: '#14B8A6' }]}>
                            <Ionicons name="trending-up" size={compact ? 14 : 20} color="#fff" />
                        </View>
                        <Text style={isDark ? (compact ? styles.statLabelCompactDark : styles.statLabelDark) : (compact ? styles.statLabelCompact : styles.statLabel)}>Average</Text>
                        <Text style={isDark ? (compact ? styles.statValueCompactDark : styles.statValueDark) : (compact ? styles.statValueCompact : styles.statValue)}>
                            {avgPerWeek}
                        </Text>
                        <Text style={compact ? styles.statSubtitleCompact : styles.statSubtitle}>Per week</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default WorkoutStats;
