import React from 'react';
import { View, Text, TouchableOpacity, TextInput, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from '@/styles/nutrition/SearchHeaderStyles';

interface SearchHeaderProps {
  searchTerm: string;
  onSearchChange: (text: string) => void;
  onBack: () => void;
  onClear: () => void;
}

const SearchHeader = ({
  searchTerm,
  onSearchChange,
  onBack,
  onClear,
}: SearchHeaderProps) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, isDark ? styles.containerDark : styles.containerLight, { paddingTop: insets.top + 16 }]}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={onBack}
          style={[styles.backButton, isDark ? styles.backButtonDark : styles.backButtonLight]}
        >
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={[styles.title, isDark ? styles.titleDark : styles.titleLight]}>
            Add Food
          </Text>
          <Text style={[styles.subtitle, isDark ? styles.subtitleDark : styles.subtitleLight]}>
            Search and track your nutrition
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.searchContainer,
          isDark ? styles.searchContainerDark : styles.searchContainerLight,
          searchTerm.length > 0 ? styles.searchContainerActive : styles.searchContainerInactive,
        ]}
      >
        <Ionicons name="search" size={22} color="#10B981" />
        <TextInput
          value={searchTerm}
          onChangeText={onSearchChange}
          placeholder="Try 'chicken breast' or 'apple'..."
          placeholderTextColor="#9CA3AF"
          style={[styles.searchInput, isDark ? styles.searchInputDark : styles.searchInputLight]}
        />
        {searchTerm.length > 0 && (
          <TouchableOpacity
            onPress={onClear}
            style={[styles.clearButton, isDark ? styles.clearButtonDark : styles.clearButtonLight]}
          >
            <Ionicons name="close" size={16} color="#6B7280" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default SearchHeader;

