import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import DashboardHeaderStyles from '../../styles/dashboard/DashboardHeaderStyles';

interface DashboardHeaderProps {
    userName: string;
    topInset: number;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ userName, topInset }) => {
    const styles = DashboardHeaderStyles;
    const router = useRouter();

    const handleSettingsPress = () => {
        router.push('/settings');
    };

    return (
        <LinearGradient
            colors={['#3b82f6', '#2563eb', '#1d4ed8']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
        >
            <View style={[styles.container, { paddingTop: topInset + 16 }]}>
                <View style={styles.contentRow}>
                    <View style={styles.iconContainer}>
                        <LinearGradient
                            colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.15)']}
                            style={styles.iconGradient}
                        >
                            <Ionicons name="home" size={32} color="#fff" />
                        </LinearGradient>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>
                            Home
                        </Text>
                        <Text style={styles.subtitle}>
                            Welcome back, {userName}
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={styles.settingsButton}
                        onPress={handleSettingsPress}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="settings-outline" size={26} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
        </LinearGradient>
    );
};

export default DashboardHeader;
