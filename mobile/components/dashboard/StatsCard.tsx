import { View, Text } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

interface StatsCardProps {
    icon: keyof typeof Ionicons.glyphMap;
    iconColor: string;
    bgColor: string;
    label: string;
    value: string | number;
    subtitle?: string;
    className?: string;
}

export default function StatsCard({
    icon,
    iconColor,
    bgColor,
    label,
    value,
    subtitle,
    className = '',
}: StatsCardProps) {
    return (
        <View className={`rounded-2xl overflow-hidden ${className}`} style={{ backgroundColor: bgColor }}>
            <BlurView intensity={20} tint="light" className="p-4">
                <View className="flex-row items-center justify-between mb-2">
                    <Ionicons name={icon} size={24} color={iconColor} />
                </View>
                <Text className="text-white/70 text-xs mb-1">{label}</Text>
                <Text className="text-white text-2xl font-bold mb-1">{value}</Text>
                {subtitle && <Text className="text-white/60 text-xs">{subtitle}</Text>}
            </BlurView>
        </View>
    );
}
