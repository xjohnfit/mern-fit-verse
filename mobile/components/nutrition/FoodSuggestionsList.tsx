import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '@/styles/nutrition/FoodSuggestionsListStyles';

interface FoodSuggestionsListProps {
  suggestions: string[];
  isLoading: boolean;
  onSuggestionClick: (suggestion: string) => void;
}

const FoodSuggestionsList = ({
  suggestions,
  isLoading,
  onSuggestionClick,
}: FoodSuggestionsListProps) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="list-outline" size={16} color={isDark ? '#9CA3AF' : '#6B7280'} />
        <Text style={[styles.headerText, isDark ? styles.headerTextDark : styles.headerTextLight]}>
          {suggestions.length} SUGGESTIONS
        </Text>
      </View>
      {suggestions.map((item, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => onSuggestionClick(item)}
          style={[styles.suggestionItem, isDark ? styles.suggestionItemDark : styles.suggestionItemLight]}
        >
          <View style={styles.suggestionIcon}>
            <Ionicons name="restaurant" size={18} color="#10B981" />
          </View>
          <Text style={[styles.suggestionText, isDark ? styles.suggestionTextDark : styles.suggestionTextLight]}>
            {item}
          </Text>
          <Ionicons name="chevron-forward" size={18} color={isDark ? '#6B7280' : '#9CA3AF'} />
        </TouchableOpacity>
      ))}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="#10B981" size="small" />
          <Text style={[styles.loadingText, isDark ? styles.loadingTextDark : styles.loadingTextLight]}>
            Searching...
          </Text>
        </View>
      )}
    </View>
  );
};

export default FoodSuggestionsList;

