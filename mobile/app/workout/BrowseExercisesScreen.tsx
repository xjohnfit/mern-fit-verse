import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    useColorScheme,
    TextInput,
    StatusBar, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

// Redux
import { useGetExercisesByCategoryQuery, Exercise } from '@/slices/exerciseApiSlice';

// Components
import ExerciseInfoModal from '@/components/workout/ExerciseInfoModal';

// Styles
import createStyles from '@/styles/workout/BrowseExercisesScreenStyles';

const BrowseExercisesScreen = () => {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [exerciseSearch, setExerciseSearch] = useState('');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const { data: exercisesByCategory, isLoading: exercisesLoading } = useGetExercisesByCategoryQuery();

  // Filter exercises by category based on search
  const filteredExercisesByCategory = useMemo(() => {
    if (!exercisesByCategory) return {};

    if (!exerciseSearch) return exercisesByCategory;

    const filtered: Record<string, any[]> = {};
    const searchLower = exerciseSearch.toLowerCase();

    Object.entries(exercisesByCategory).forEach(([category, exercises]) => {
      const matchingExercises = exercises.filter(
        (exercise) =>
          exercise.name.toLowerCase().includes(searchLower) ||
          category.toLowerCase().includes(searchLower)
      );

      if (matchingExercises.length > 0) {
        filtered[category] = matchingExercises;
      }
    });

    return filtered;
  }, [exercisesByCategory, exerciseSearch]);

  const totalFilteredExercises = Object.values(filteredExercisesByCategory).reduce(
    (total, exercises) => total + exercises.length,
    0
  );

  const handleExercisePress = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedExercise(null);
  };

  const styles = useMemo(() => createStyles(isDark), [isDark]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <LinearGradient
        colors={isDark ? ['#7e22ce', '#6b21a8'] : ['#9333ea', '#7e22ce']}
        style={[styles.header, { paddingTop: insets.top }]}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Exercise Library</Text>
            <Text style={styles.headerSubtitle}>
              {totalFilteredExercises} {totalFilteredExercises === 1 ? 'exercise' : 'exercises'}
            </Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>

        {/* Search Input */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={isDark ? '#d1d5db' : '#e5e7eb'} />
          <TextInput
            value={exerciseSearch}
            onChangeText={setExerciseSearch}
            placeholder="Search exercises..."
            placeholderTextColor={isDark ? '#9ca3af' : '#d1d5db'}
            style={styles.searchInput}
          />
          {exerciseSearch.length > 0 && (
            <TouchableOpacity onPress={() => setExerciseSearch('')}>
              <Ionicons name="close-circle" size={20} color={isDark ? '#d1d5db' : '#e5e7eb'} />
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      {/* Exercise List */}
      <ScrollView style={styles.exerciseList} contentContainerStyle={styles.exerciseListContent}>
            {exercisesLoading ? (
              <View style={styles.exerciseLoadingContainer}>
                <ActivityIndicator size="large" color="#9333ea" />
                <Text style={styles.exerciseLoadingText}>Loading exercises...</Text>
              </View>
            ) : totalFilteredExercises > 0 ? (
              <View style={styles.exerciseGrid}>
                {Object.entries(filteredExercisesByCategory).map(([category, exercises]) => (
                  <View key={category} style={styles.categorySection}>
                    <View style={styles.categoryHeader}>
                      <View style={styles.categoryIconCircle}>
                        <Ionicons name="fitness" size={18} color="#9333ea" />
                      </View>
                      <Text style={styles.categoryTitle}>{category}</Text>
                      <View style={styles.categoryBadge}>
                        <Text style={styles.categoryBadgeText}>{exercises.length}</Text>
                      </View>
                    </View>
                    <View style={styles.categoryExercises}>
                      {exercises.map((exercise) => (
                        <TouchableOpacity
                          key={exercise.id}
                          style={styles.exerciseCard}
                          onPress={() => handleExercisePress(exercise)}
                          activeOpacity={0.7}
                        >
                          <View style={styles.exerciseCardHeader}>
                            <View style={styles.exerciseIconCircle}>
                              <Image source={{ uri: exercise.image }} style={styles.exerciseImage} />
                            </View>
                            <View style={styles.exerciseInfo}>
                              <Text style={styles.exerciseName}>{exercise.name}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.exerciseEmptyState}>
                <Ionicons name="search" size={48} color={isDark ? '#4B5563' : '#D1D5DB'} />
                <Text style={styles.exerciseEmptyText}>
                  {exerciseSearch ? 'No exercises found' : 'Start typing to search exercises'}
                </Text>
              </View>
            )}
          </ScrollView>

      {/* Exercise Info Modal */}
      <ExerciseInfoModal
        visible={modalVisible}
        exercise={selectedExercise}
        onClose={handleCloseModal}
      />
    </View>
  );
};

export default BrowseExercisesScreen;

