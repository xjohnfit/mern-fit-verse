import React from 'react';
import { View, Text, TextInput, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '@/styles/nutrition/ServingSizeInputStyles';

interface ServingSizeInputProps {
  amount: string;
  servingUnit: string;
  onAmountChange: (amount: string) => void;
}

const ServingSizeInput = ({ amount, servingUnit, onAmountChange }: ServingSizeInputProps) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={[styles.container, isDark ? styles.containerDark : styles.containerLight]}>
      <View style={styles.header}>
        <Ionicons name="scale-outline" size={20} color="#10B981" />
        <Text style={[styles.headerText, isDark ? styles.headerTextDark : styles.headerTextLight]}>
          Serving Size
        </Text>
      </View>
      <View style={styles.inputRow}>
        <TextInput
          value={amount}
          onChangeText={onAmountChange}
          keyboardType="decimal-pad"
          placeholder="1.0"
          placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
          style={[
            styles.input,
            isDark ? styles.inputDark : styles.inputLight,
            amount && parseFloat(amount) > 0 ? styles.inputActive : styles.inputInactive,
          ]}
        />
        <View style={[styles.unitContainer, isDark ? styles.unitContainerDark : styles.unitContainerLight]}>
          <Text style={[styles.unitText, isDark ? styles.unitTextDark : styles.unitTextLight]}>
            {servingUnit || 'unit'}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default ServingSizeInput;

