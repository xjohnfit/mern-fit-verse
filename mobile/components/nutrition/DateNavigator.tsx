import React from 'react';
import { View, Text, TouchableOpacity, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '@/styles/nutrition/DateNavigatorStyles';

interface DateNavigatorProps {
  selectedDate: Date;
  onDateChange: (days: number) => void;
}

const DateNavigator = ({ selectedDate, onDateChange }: DateNavigatorProps) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={[styles.container, isDark ? styles.containerDark : styles.containerLight]}>
      <View style={styles.content}>
        <TouchableOpacity
          onPress={() => onDateChange(-1)}
          style={[styles.navButton, isDark ? styles.navButtonDark : styles.navButtonLight]}
        >
          <Ionicons name="chevron-back" size={20} color={isDark ? '#FFFFFF' : '#111827'} />
        </TouchableOpacity>
        <View style={styles.dateContainer}>
          <Ionicons name="calendar" size={18} color="#10b981" style={styles.calendarIcon} />
          <Text style={[styles.dateText, isDark ? styles.dateTextDark : styles.dateTextLight]}>
            {selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => onDateChange(1)}
          style={[styles.navButton, isDark ? styles.navButtonDark : styles.navButtonLight]}
        >
          <Ionicons name="chevron-forward" size={20} color={isDark ? '#FFFFFF' : '#111827'} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DateNavigator;

