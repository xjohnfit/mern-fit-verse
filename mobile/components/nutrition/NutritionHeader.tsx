import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import styles from '@/styles/nutrition/NutritionHeaderStyles';

interface NutritionHeaderProps {
  topPadding: number;
}

const NutritionHeader = ({ topPadding }: NutritionHeaderProps) => {
  return (
    <LinearGradient
      colors={['#10b981', '#059669', '#047857']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.gradient, { paddingTop: topPadding + 20 }]}
    >
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Ionicons name="nutrition" size={32} color="#FFFFFF" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Nutrition</Text>
          <Text style={styles.subtitle}>Track your daily intake</Text>
        </View>
      </View>
    </LinearGradient>
  );
};

export default NutritionHeader;

