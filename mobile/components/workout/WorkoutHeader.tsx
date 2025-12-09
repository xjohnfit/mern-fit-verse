import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface WorkoutHeaderProps {
    paddingTop: number;
}

export const WorkoutHeader: React.FC<WorkoutHeaderProps> = ({ paddingTop }) => {
    return (
        <LinearGradient
            colors={['#9333ea', '#7e22ce', '#6b21a8']}
            style={styles.header}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <View style={[styles.headerContent, { paddingTop: paddingTop + 16 }]}>
                <View style={styles.headerTop}>
                    <View style={styles.headerIcon}>
                        <LinearGradient
                            colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.15)']}
                            style={styles.iconGradient}
                        >
                            <Ionicons name="barbell" size={32} color="#fff" />
                        </LinearGradient>
                    </View>
                    <View style={styles.headerTextContainer}>
                        <Text style={styles.headerTitle}>Workout</Text>
                        <Text style={styles.headerSubtitle}>
                            Train smarter, get stronger
                        </Text>
                    </View>
                </View>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: 20,
        paddingBottom: 24,
    },
    headerContent: {
        paddingBottom: 4,
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerIcon: {
        width: 56,
        height: 56,
        borderRadius: 18,
        overflow: 'hidden',
        marginRight: 14,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    iconGradient: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTextContainer: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        letterSpacing: 0.5,
    },
    headerSubtitle: {
        fontSize: 15,
        color: 'rgba(255, 255, 255, 0.95)',
        marginTop: 4,
        fontWeight: '500',
    },
});
