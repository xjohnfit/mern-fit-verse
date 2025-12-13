import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '@/styles/nutrition/AddFoodButtonStyles';

interface AddFoodButtonProps {
  onPress: () => void;
  disabled: boolean;
  isLoading: boolean;
}

const AddFoodButton = ({ onPress, disabled, isLoading }: AddFoodButtonProps) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      style={[
        styles.button,
        disabled ? (isDark ? styles.buttonDisabledDark : styles.buttonDisabledLight) : styles.buttonActive,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <>
          <Ionicons name="add-circle" size={24} color="#FFFFFF" style={styles.icon} />
          <Text style={styles.text}>Add to Diary</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

export default AddFoodButton;

