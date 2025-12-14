import { View, Text } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import statsCardStyles from '../../styles/dashboard/StatsCard';

interface StatsCardProps {
    icon: keyof typeof Ionicons.glyphMap;
    iconColor: string;
    bgColor: string;
    label: string;
    value: string | number;
    subtitle?: string;
}

export default function StatsCard({
    icon,
    iconColor,
    bgColor,
    label,
    value,
    subtitle,
}: StatsCardProps) {
    return (
        <View style={[statsCardStyles.container, { backgroundColor: bgColor }]}>
            <BlurView intensity={20} tint="light" style={statsCardStyles.blurView}>
                <View style={statsCardStyles.header}>
                    <Ionicons name={icon} size={24} color={iconColor} />
                </View>
                <Text style={statsCardStyles.label}>{label}</Text>
                <Text style={statsCardStyles.value}>{value}</Text>
                {subtitle && <Text style={statsCardStyles.subtitle}>{subtitle}</Text>}
            </BlurView>
        </View>
    );
}
