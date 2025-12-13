import React from 'react';
import { View, Text, TouchableOpacity, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '@/styles/nutrition/EmptySearchStateStyles';

interface EmptySearchStateProps {
  onSuggestionClick: (suggestion: string) => void;
}

const EmptySearchState = ({ onSuggestionClick }: EmptySearchStateProps) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const suggestions = ['Chicken', 'Rice', 'Apple', 'Salmon'];

  return (
    <View style={[styles.container, isDark ? styles.containerDark : styles.containerLight]}>
      <View style={styles.iconContainer}>
        <Ionicons name="search" size={40} color="#10B981" />
      </View>
      <Text style={[styles.title, isDark ? styles.titleDark : styles.titleLight]}>
        Start Your Search
      </Text>
      <Text style={[styles.description, isDark ? styles.descriptionDark : styles.descriptionLight]}>
        Type at least 2 characters in the search bar above to find foods
      </Text>
      <View style={styles.suggestionsContainer}>
        {suggestions.map((suggestion, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => onSuggestionClick(suggestion)}
            style={[styles.suggestionChip, isDark ? styles.suggestionChipDark : styles.suggestionChipLight]}
          >
            <Text style={[styles.suggestionText, isDark ? styles.suggestionTextDark : styles.suggestionTextLight]}>
              {suggestion}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default EmptySearchState;

