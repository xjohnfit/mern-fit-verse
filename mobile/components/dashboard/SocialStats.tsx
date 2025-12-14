import React from 'react';
import { View, Text, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import StatsCard from '@/components/dashboard/StatsCard';
import SocialStatsStyles from '../../styles/dashboard/SocialStatsStyles';

interface SocialStatsProps {
    totalLikes: number;
    followers: number;
    totalPosts: number;
    daysActive: number;
}

const SocialStats: React.FC<SocialStatsProps> = ({ totalLikes, followers, totalPosts, daysActive }) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const styles = SocialStatsStyles;

    return (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Ionicons name="people" size={20} color="#F59E0B" style={styles.headerIcon} />
                <Text style={isDark ? styles.sectionTitleDark : styles.sectionTitle}>
                    Social
                </Text>
            </View>
            <View style={styles.statsRow}>
                <View style={styles.statsCard}>
                    <StatsCard
                        icon="heart"
                        iconColor="#fff"
                        bgColor="#8B5CF6"
                        label="Total Likes"
                        value={totalLikes}
                    />
                </View>
                <View style={styles.statsCard}>
                    <StatsCard
                        icon="people"
                        iconColor="#fff"
                        bgColor="#F59E0B"
                        label="Followers"
                        value={followers}
                    />
                </View>
            </View>
            <View style={styles.statsRow}>
                <View style={styles.statsCard}>
                    <StatsCard
                        icon="pulse"
                        iconColor="#fff"
                        bgColor="#F43F5E"
                        label="Posts"
                        value={totalPosts}
                    />
                </View>
                <View style={styles.statsCard}>
                    <StatsCard
                        icon="time"
                        iconColor="#fff"
                        bgColor="#0EA5E9"
                        label="Days Active"
                        value={daysActive}
                    />
                </View>
            </View>
        </View>
    );
};

export default SocialStats;
