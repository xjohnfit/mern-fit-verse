import React from 'react';
import { View, Text, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '@/styles/nutrition/FoodDetailsCardStyles';

interface NutritionValues {
  calories: string;
  protein: string;
  carbs: string;
  fats: string;
  servingDescription: string;
}

interface FoodDetailsCardProps {
  foodName: string;
  nutritionValues: NutritionValues;
}

const FoodDetailsCard = ({ foodName, nutritionValues }: FoodDetailsCardProps) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={[styles.container, isDark ? styles.containerDark : styles.containerLight]}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="nutrition" size={24} color="#10B981" />
        </View>
        <View style={styles.headerTextContainer}>
          <Text style={[styles.foodName, isDark ? styles.foodNameDark : styles.foodNameLight]}>
            {foodName}
          </Text>
          <Text style={[styles.servingDescription, isDark ? styles.servingDescriptionDark : styles.servingDescriptionLight]}>
            {nutritionValues.servingDescription}
          </Text>
        </View>
      </View>

      <View style={styles.nutritionGrid}>
        <View
          style={[
            styles.nutritionItem,
            isDark ? styles.nutritionItemDark : styles.nutritionItemLight,
            styles.caloriesBorder,
          ]}
        >
          <View style={styles.nutritionHeader}>
            <Ionicons name="flame" size={16} color="#EF4444" />
            <Text style={[styles.nutritionLabel, isDark ? styles.nutritionLabelDark : styles.nutritionLabelLight]}>
              Calories
            </Text>
          </View>
          <Text style={[styles.nutritionValue, isDark ? styles.caloriesValueDark : styles.caloriesValue]}>
            {nutritionValues.calories}
          </Text>
        </View>

        <View
          style={[
            styles.nutritionItem,
            isDark ? styles.nutritionItemDark : styles.nutritionItemLight,
            styles.proteinBorder,
          ]}
        >
          <View style={styles.nutritionHeader}>
            <Ionicons name="fitness" size={16} color="#3B82F6" />
            <Text style={[styles.nutritionLabel, isDark ? styles.nutritionLabelDark : styles.nutritionLabelLight]}>
              Protein
            </Text>
          </View>
          <Text style={[styles.nutritionValue, styles.proteinValue]}>
            {nutritionValues.protein}g
          </Text>
        </View>

        <View
          style={[
            styles.nutritionItem,
            isDark ? styles.nutritionItemDark : styles.nutritionItemLight,
            styles.carbsBorder,
          ]}
        >
          <View style={styles.nutritionHeader}>
            <Ionicons name="flash" size={16} color="#F59E0B" />
            <Text style={[styles.nutritionLabel, isDark ? styles.nutritionLabelDark : styles.nutritionLabelLight]}>
              Carbs
            </Text>
          </View>
          <Text style={[styles.nutritionValue, styles.carbsValue]}>
            {nutritionValues.carbs}g
          </Text>
        </View>

        <View
          style={[
            styles.nutritionItem,
            isDark ? styles.nutritionItemDark : styles.nutritionItemLight,
            styles.fatsBorder,
          ]}
        >
          <View style={styles.nutritionHeader}>
            <Ionicons name="water" size={16} color="#EF4444" />
            <Text style={[styles.nutritionLabel, isDark ? styles.nutritionLabelDark : styles.nutritionLabelLight]}>
              Fats
            </Text>
          </View>
          <Text style={[styles.nutritionValue, styles.fatsValue]}>
            {nutritionValues.fats}g
          </Text>
        </View>
      </View>
    </View>
  );
};

export default FoodDetailsCard;

