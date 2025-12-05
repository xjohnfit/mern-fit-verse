import { TouchableOpacity, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface QuickActionCardProps {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    description: string;
    colors: string[];
    onPress: () => void;
}

export default function QuickActionCard({
    icon,
    title,
    description,
    colors,
    onPress,
}: QuickActionCardProps) {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.8}
            className="mb-4 mx-1 rounded-xl overflow-hidden"
            style={{ borderRadius: 20 }}
        >
            <LinearGradient
                colors={colors as any}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                {/* Decorative circles */}
                <View className="absolute -left-8 -top-8 w-32 h-32 bg-white/10 rounded-full" />
                <View className="absolute -left-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full" />

                <View className="flex-row items-center justify-between mb-3 p-3">
                    <View className="flex-1 pr-4">
                        <Text className="text-white font-bold text-xl mb-2">{title}</Text>
                        <Text className="text-white/90 text-sm leading-5">{description}</Text>
                    </View>
                    <View className="bg-white/25 backdrop-blur-sm p-4 rounded-2xl items-center justify-center ml-2">
                        <Ionicons name={icon} size={32} color="white" />
                    </View>
                </View>

                {/* Action indicator - moved to bottom left */}
                <View className="flex-row items-center mt-2 p-2">
                    <Text className="text-white/80 text-xs font-semibold p-2">
                        Tap to start
                    </Text>
                    <Ionicons name="arrow-forward" size={14} color="rgba(255,255,255,0.8)" />
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );
}
