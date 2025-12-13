import React from 'react';
import { View, Text, useColorScheme } from 'react-native';
import styles from '@/styles/nutrition/MealsSectionHeaderStyles';

interface MealsSectionHeaderProps {
  dateLabel: string;
}

const MealsSectionHeader = ({ dateLabel }: MealsSectionHeaderProps) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={styles.sectionHeader}>
      <View style={styles.divider} />
      <Text style={[styles.title, isDark ? styles.titleDark : styles.titleLight]}>
        {dateLabel} Meals
      </Text>
    </View>
  );
};

export default MealsSectionHeader;

