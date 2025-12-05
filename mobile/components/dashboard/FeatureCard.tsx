import { View, Text } from 'react-native'
import { Ionicons } from "@expo/vector-icons";

const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}) => {
  return (
    <View className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 flex-row items-center">
      <View className="bg-white/20 rounded-full p-3 mr-4">
        <Ionicons name={icon} size={28} color="white" />
      </View>
      <View className="flex-1">
        <Text className="text-white text-lg font-bold mb-1">{title}</Text>
        <Text className="text-blue-100 text-sm">{description}</Text>
      </View>
    </View>
  );
}
export default FeatureCard
