import React from 'react';
import { View, Text, TouchableOpacity, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '@/styles/nutrition/FoodItemStyles';

interface FoodItemProps {
  food: {
    _id: string;
    foodItem: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
  onDelete: (id: string) => void;
}

const FoodItem = ({ food, onDelete }: FoodItemProps) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={[styles.itemContainer, isDark ? styles.itemContainerDark : styles.itemContainerLight]}>
      <View style={styles.contentContainer}>
        <Text style={[styles.foodName, isDark ? styles.foodNameDark : styles.foodNameLight]}>
          {food.foodItem}
        </Text>
        <View style={styles.macrosContainer}>
          <View style={styles.macroItem}>
            <Ionicons name="flame" size={12} color="#F59E0B" />
            <Text style={[styles.macroText, isDark ? styles.macroTextDark : styles.macroTextLight]}>
              {food.calories}
            </Text>
          </View>
          <View style={styles.macroItem}>
            <Ionicons name="fitness" size={12} color="#3B82F6" />
            <Text style={[styles.macroText, isDark ? styles.macroTextDark : styles.macroTextLight]}>
              P:{food.protein}g
            </Text>
          </View>
          <View style={styles.macroItem}>
            <Ionicons name="flash" size={12} color="#F59E0B" />
            <Text style={[styles.macroText, isDark ? styles.macroTextDark : styles.macroTextLight]}>
              C:{food.carbs}g
            </Text>
          </View>
          <View style={styles.macroItem}>
            <Ionicons name="water" size={12} color="#EF4444" />
            <Text style={[styles.macroText, isDark ? styles.macroTextDark : styles.macroTextLight]}>
              F:{food.fats}g
            </Text>
          </View>
        </View>
      </View>
      <TouchableOpacity onPress={() => onDelete(food._id)} style={styles.deleteButton}>
        <Ionicons name="trash-outline" size={18} color="#EF4444" />
      </TouchableOpacity>
    </View>
  );
};

export default FoodItem;

