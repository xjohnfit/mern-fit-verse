import React from 'react';
import { View, Text, TouchableOpacity, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '@/styles/nutrition/AddCustomCategoryButtonStyles';

interface AddCustomCategoryButtonProps {
  onPress: () => void;
}

const AddCustomCategoryButton = ({ onPress }: AddCustomCategoryButtonProps) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, isDark ? styles.buttonDark : styles.buttonLight]}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="add" size={24} color="#10b981" />
        </View>
        <Text style={styles.text}>Add Custom Category</Text>
      </View>
    </TouchableOpacity>
  );
};

export default AddCustomCategoryButton;

