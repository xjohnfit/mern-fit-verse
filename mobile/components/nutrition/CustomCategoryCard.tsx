import React from 'react';
import { View, Text, TouchableOpacity, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FoodItem from './FoodItem';
import styles from '@/styles/nutrition/CustomCategoryCardStyles';

interface CustomCategoryCardProps {
  category: {
    id: string;
    name: string;
    color: string;
    foods: any[];
  };
  onAddFood: () => void;
  onDeleteCategory: () => void;
  onDeleteFood: (id: string) => void;
}

const CustomCategoryCard = ({ category, onAddFood, onDeleteCategory, onDeleteFood }: CustomCategoryCardProps) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={[styles.card, isDark ? styles.cardDark : styles.cardLight]}>
      <View style={[styles.header, category.foods.length > 0 && styles.headerWithMargin]}>
        <View style={styles.leftSection}>
          <View style={[styles.iconContainer, { backgroundColor: `${category.color}20` }]}>
            <Ionicons name="nutrition" size={24} color={category.color} />
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
        <View style={styles.buttonsContainer}>
          <TouchableOpacity onPress={onAddFood} style={styles.addButton}>
            <Ionicons name="add" size={24} color="#10B981" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onDeleteCategory} style={styles.deleteButton}>
            <Ionicons name="close" size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>
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

export default CustomCategoryCard;

