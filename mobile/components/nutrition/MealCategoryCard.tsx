import React from 'react';
import { View, Text, TouchableOpacity, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FoodItem from './FoodItem';
import styles from '@/styles/nutrition/MealCategoryCardStyles';

interface MealCategoryCardProps {
  category: {
    key: string;
    name: string;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
    foods: any[];
  };
  onAddFood: () => void;
  onDeleteFood: (id: string) => void;
}

const MealCategoryCard = ({ category, onAddFood, onDeleteFood }: MealCategoryCardProps) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={[styles.card, isDark ? styles.cardDark : styles.cardLight]}>
      <View style={[styles.header, category.foods.length > 0 && styles.headerWithMargin]}>
        <View style={styles.leftSection}>
          <View style={[styles.iconContainer, { backgroundColor: `${category.color}20` }]}>
            <Ionicons name={category.icon} size={24} color={category.color} />
          </View>
          <View style={styles.textContainer}>
            <Text style={[styles.categoryName, isDark ? styles.categoryNameDark : styles.categoryNameLight]}>
              {category.name}
            </Text>
            <Text style={[styles.itemCount, isDark ? styles.itemCountDark : styles.itemCountLight]}>
              {category.foods.length} {category.foods.length === 1 ? 'item' : 'items'}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={onAddFood} style={styles.addButton}>
          <Ionicons name="add" size={26} color="#10B981" />
        </TouchableOpacity>
      </View>

      {category.foods.length > 0 && (
        <View style={styles.foodsContainer}>
          {category.foods.map((food: any) => (
            <FoodItem key={food._id} food={food} onDelete={onDeleteFood} />
          ))}
        </View>
      )}
    </View>
  );
};

export default MealCategoryCard;

