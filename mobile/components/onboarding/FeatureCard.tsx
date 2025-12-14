import { View, Text } from 'react-native'
import { Ionicons } from "@expo/vector-icons";
import FeatureCardStyles from '@/styles/dashboard/FeatureCardStyles';

const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}) => {
  const styles = FeatureCardStyles();
  
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={28} color="white" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  );
}
export default FeatureCard
