import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export const ActiveWorkoutBanner: React.FC = () => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const styles = useMemo(() => createStyles(isDark), [isDark]);

    return (
        <TouchableOpacity
            style={styles.activeBanner}
            onPress={() => router.push('/workout/startWorkoutScreen' as any)}
            activeOpacity={0.85}
        >
            <LinearGradient
                colors={['#10b981', '#059669', '#047857']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.activeBannerGradient}
            >
                <View style={styles.pulseOuter}>
                    <View style={styles.pulseInner} />
                </View>
                <View style={styles.activeBannerContent}>
                    <View style={styles.activeBannerLeft}>
                        <View style={styles.activeBannerIcon}>
                            <LinearGradient
                                colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.15)']}
                                style={styles.iconGradient}
                            >
                                <Ionicons name="fitness" size={24} color="#fff" />
                            </LinearGradient>
                        </View>
                        <View style={styles.textContainer}>
                            <View style={styles.titleRow}>
                                <View style={styles.liveDot} />
                                <Text style={styles.activeBannerTitle}>Active Workout</Text>
                            </View>
                            <Text style={styles.activeBannerText}>
                                Tap to continue your session
                            </Text>
                        </View>
                    </View>
                    <View style={styles.arrowContainer}>
                        <Ionicons name="chevron-forward" size={24} color="#fff" />
                    </View>
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );
};

const createStyles = (isDark: boolean) => StyleSheet.create({
    activeBanner: {
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 24,
        elevation: 8,
        shadowColor: '#10b981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
    },
    activeBannerGradient: {
        padding: 18,
        position: 'relative',
    },
    pulseOuter: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pulseInner: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#fff',
    },
    activeBannerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    activeBannerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 14,
    },
    activeBannerIcon: {
        width: 48,
        height: 48,
        borderRadius: 14,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    iconGradient: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textContainer: {
        flex: 1,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    liveDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#fff',
    },
    activeBannerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    activeBannerText: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.95)',
        marginTop: 4,
        fontWeight: '500',
    },
    arrowContainer: {
        width: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
