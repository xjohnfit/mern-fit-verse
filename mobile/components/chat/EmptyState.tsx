import React, { useMemo } from 'react';
import { View, Text, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import createStyles from '@/styles/chat/EmptyStateStyles';

interface EmptyStateProps {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    subtitle: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, subtitle }) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const styles = useMemo(() => createStyles(isDark), [isDark]);

    return (
        <View style={styles.container}>
            <View
                style={[
                    styles.iconContainer,
                    { backgroundColor: isDark ? '#1F2937' : '#CFFAFE' },
                ]}
            >
                <Ionicons name={icon} size={40} color="#06b6d4" />
            </View>
            <Text style={[styles.title, { color: isDark ? '#f9fafb' : '#1f2937' }]}>
                {title}
            </Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
    );
};

export default EmptyState;

