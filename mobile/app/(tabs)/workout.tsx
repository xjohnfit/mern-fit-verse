import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  useColorScheme,
  Modal,
  TextInput,
} from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Redux
import { useGetTemplateFoldersQuery } from '@/slices/workoutTemplateFolderApiSlice';
import { useGetTemplatesQuery } from '@/slices/workoutTemplateApiSlice';
import { useGetExercisesByCategoryQuery } from '@/slices/exerciseApiSlice';

// Components
import {
  TemplateCard,
  FolderCard,
  CreateFolderDialog,
  EditFolderDialog,
  WorkoutHeader,
  ActiveWorkoutBanner,
  FreestyleWorkoutCard,
} from '@/components/workout';

// Types
import type { WorkoutTemplateFolder } from '@/types/workout.types';

// =====================
// Main WorkoutScreen Component
// =====================
const WorkoutScreen = () => {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [showCreateFolderDialog, setShowCreateFolderDialog] = useState(false);
  const [showEditFolderDialog, setShowEditFolderDialog] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<WorkoutTemplateFolder | null>(null);
  const [hasActiveWorkout, setHasActiveWorkout] = useState(false);
  const [showExerciseBrowser, setShowExerciseBrowser] = useState(false);
  const [exerciseSearch, setExerciseSearch] = useState('');
  const opacity = useSharedValue(0);

  const { data: foldersResponse, isLoading: foldersLoading } = useGetTemplateFoldersQuery();
  const { data: templatesResponse, isLoading: templatesLoading } = useGetTemplatesQuery();
  const { data: exercisesByCategory, isLoading: exercisesLoading } = useGetExercisesByCategoryQuery();

  const folders = foldersResponse?.data || [];
  const templates = templatesResponse?.data || [];
  const unsortedTemplates = templates.filter((t) => !t.folderId);

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

  const handleEditFolder = (folder: WorkoutTemplateFolder) => {
    setSelectedFolder(folder);
    setShowEditFolderDialog(true);
  };

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 500 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  useEffect(() => {
    const checkActiveWorkout = async () => {
      try {
        const workoutStartTime = await AsyncStorage.getItem('workout_start_time');
        setHasActiveWorkout(workoutStartTime !== null);
      } catch (error) {
        console.error('Error checking active workout:', error);
      }
    };

    checkActiveWorkout();
    const interval = setInterval(checkActiveWorkout, 2000);
    return () => clearInterval(interval);
  }, []);

  const isLoading = foldersLoading || templatesLoading;

  const styles = useMemo(() => createStyles(isDark), [isDark]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDark ? "light-content" : "light-content"} />
      <WorkoutHeader paddingTop={insets.top} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {hasActiveWorkout && <ActiveWorkoutBanner />}

        <Animated.View style={[styles.section, animatedStyle]}>
          <View style={styles.sectionHeader}>
            <View style={styles.titleContainer}>
              <View style={styles.iconBadge}>
                <LinearGradient
                  colors={['#f3e8ff', '#ede9fe']}
                  style={styles.iconBadgeGradient}
                >
                  <Ionicons name="albums" size={20} color="#9333ea" />
                </LinearGradient>
              </View>
              <View>
                <Text style={styles.sectionTitle}>My Templates</Text>
                <Text style={styles.sectionSubtitle}>
                  {templates.length} {templates.length === 1 ? 'template' : 'templates'} • {folders.length} {folders.length === 1 ? 'folder' : 'folders'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.actionButtonsContainer}>
            <View style={styles.actionButtonsRow}>
              <TouchableOpacity
                style={styles.actionCard}
                onPress={() => setShowCreateFolderDialog(true)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={isDark ? ['#581c87', '#6b21a8'] : ['#f3e8ff', '#e9d5ff']}
                  style={styles.actionIconCircle}
                >
                  <Ionicons name="folder-open" size={22} color={isDark ? '#f3e8ff' : '#7e22ce'} />
                </LinearGradient>
                <Text style={styles.actionCardTitle}>New Folder</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionCard}
                onPress={() => router.push('/workout/create-template' as any)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#9333ea', '#7e22ce']}
                  style={styles.actionIconCircle}
                >
                  <Ionicons name="add-circle" size={22} color="#fff" />
                </LinearGradient>
                <Text style={styles.actionCardTitle}>New Template</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.actionCardFull}
              onPress={() => setShowExerciseBrowser(true)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={isDark ? ['#065f46', '#047857'] : ['#d1fae5', '#a7f3d0']}
                style={styles.actionIconCircle}
              >
                <Ionicons name="library" size={22} color={isDark ? '#d1fae5' : '#047857'} />
              </LinearGradient>
              <Text style={styles.actionCardTitle}>Browse Exercises</Text>
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <LinearGradient
                colors={isDark ? ['#1e293b', '#334155'] : ['#f3e8ff', '#faf5ff']}
                style={styles.loadingCard}
              >
                <ActivityIndicator size="large" color={isDark ? '#a78bfa' : '#9333ea'} />
                <Text style={styles.loadingText}>Loading your templates...</Text>
              </LinearGradient>
            </View>
          ) : folders.length === 0 && templates.length === 0 ? (
            <View style={styles.emptyState}>
              <LinearGradient
                colors={isDark ? ['#1e293b', '#334155'] : ['#faf5ff', '#f3e8ff']}
                style={styles.emptyStateGradient}
              >
                <View style={styles.emptyIconContainer}>
                  <LinearGradient
                    colors={['#9333ea', '#7e22ce']}
                    style={styles.emptyIconGradient}
                  >
                    <Ionicons name="fitness" size={48} color="#fff" />
                  </LinearGradient>
                </View>
                <Text style={styles.emptyStateTitle}>Start Your Journey</Text>
                <Text style={styles.emptyStateText}>
                  Create your first workout template to streamline your training and track your progress effectively.
                </Text>
                <View style={styles.emptyStateFeatures}>
                  <View style={styles.featureItem}>
                    <View style={styles.featureIcon}>
                      <Ionicons name="checkmark-circle" size={20} color={isDark ? '#e9d5ff' : '#9333ea'} />
                    </View>
                    <Text style={styles.featureText}>Save time with templates</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <View style={styles.featureIcon}>
                      <Ionicons name="checkmark-circle" size={20} color={isDark ? '#e9d5ff' : '#9333ea'} />
                    </View>
                    <Text style={styles.featureText}>Organize with folders</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <View style={styles.featureIcon}>
                      <Ionicons name="checkmark-circle" size={20} color={isDark ? '#e9d5ff' : '#9333ea'} />
                    </View>
                    <Text style={styles.featureText}>Track your progress</Text>
                  </View>
                </View>
                <View style={styles.emptyStateButtons}>
                  <TouchableOpacity
                    style={styles.emptyPrimaryButton}
                    onPress={() => router.push('/workout/create-template' as any)}
                  >
                    <LinearGradient
                      colors={['#9333ea', '#7e22ce']}
                      style={styles.emptyPrimaryGradient}
                    >
                      <Ionicons name="add-circle" size={22} color="#fff" />
                      <Text style={styles.emptyPrimaryText}>Create Template</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.emptySecondaryButton}
                    onPress={() => setShowCreateFolderDialog(true)}
                  >
                    <Ionicons name="folder-open" size={20} color={isDark ? '#a78bfa' : '#9333ea'} />
                    <Text style={styles.emptySecondaryText}>Create Folder</Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View>
          ) : (
            <View style={styles.list}>
              {folders.map((folder) => (
                <FolderCard
                  key={folder._id}
                  folder={folder}
                  templates={templates}
                  onEditFolder={handleEditFolder}
                  hasActiveWorkout={hasActiveWorkout}
                />
              ))}
              {unsortedTemplates.length > 0 && (
                <View style={styles.unsortedSection}>
                  <View style={styles.unsortedHeader}>
                    <Ionicons name="albums-outline" size={18} color="#6b7280" />
                    <Text style={styles.unsortedTitle}>Unsorted Templates</Text>
                    <View style={styles.unsortedBadge}>
                      <Text style={styles.unsortedBadgeText}>{unsortedTemplates.length}</Text>
                    </View>
                  </View>
                  <View style={styles.unsortedTemplates}>
                    {unsortedTemplates.map((template) => (
                      <TemplateCard key={template._id} template={template} hasActiveWorkout={hasActiveWorkout} />
                    ))}
                  </View>
                </View>
              )}
            </View>
          )}
        </Animated.View>

        <FreestyleWorkoutCard hasActiveWorkout={hasActiveWorkout} />
      </ScrollView>

      <CreateFolderDialog
        visible={showCreateFolderDialog}
        onClose={() => setShowCreateFolderDialog(false)}
      />
      <EditFolderDialog
        visible={showEditFolderDialog}
        onClose={() => setShowEditFolderDialog(false)}
        folder={selectedFolder}
      />

      {/* Exercise Browser Modal */}
      <Modal visible={showExerciseBrowser} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.exerciseBrowserModal, { paddingBottom: insets.bottom + 20 }]}>
            {/* Handle Bar */}
            <View style={styles.modalHandle}>
              <View style={styles.handleBar} />
            </View>

            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Exercise Library</Text>
              <TouchableOpacity
                onPress={() => {
                  setShowExerciseBrowser(false);
                  setExerciseSearch('');
                }}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={isDark ? '#FFFFFF' : '#111827'} />
              </TouchableOpacity>
            </View>

            {/* Search Input */}
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
              <TextInput
                value={exerciseSearch}
                onChangeText={setExerciseSearch}
                placeholder="Search exercises..."
                placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                style={styles.searchInput}
              />
              {exerciseSearch.length > 0 && (
                <TouchableOpacity onPress={() => setExerciseSearch('')}>
                  <Ionicons name="close-circle" size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
                </TouchableOpacity>
              )}
            </View>

            {/* Exercise List */}
            <ScrollView style={styles.exerciseList}>
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
                          <View key={exercise.id} style={styles.exerciseCard}>
                            <View style={styles.exerciseCardHeader}>
                              <View style={styles.exerciseIconCircle}>
                                <Ionicons name="barbell" size={20} color="#9333ea" />
                              </View>
                              <View style={styles.exerciseInfo}>
                                <Text style={styles.exerciseName}>{exercise.name}</Text>
                              </View>
                            </View>
                            {exercise.description && (
                              <Text style={styles.exerciseDescription} numberOfLines={2}>
                                {exercise.description}
                              </Text>
                            )}
                          </View>
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
          </View>
        </View>
      </Modal>
    </View>
  );
};

// =====================
// Styles
// =====================
const createStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#0f172a' : '#f9fafb',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: 14,
    overflow: 'hidden',
  },
  iconBadgeGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: isDark ? '#f1f5f9' : '#111827',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: isDark ? '#94a3b8' : '#6b7280',
    fontWeight: '500',
  },
  actionButtonsContainer: {
    gap: 10,
    marginBottom: 20,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  actionCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: isDark ? '#1e293b' : '#fff',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: isDark ? '#334155' : '#e5e7eb',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDark ? 0.3 : 0.05,
    shadowRadius: 4,
    gap: 10,
  },
  actionCardFull: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: isDark ? '#1e293b' : '#fff',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: isDark ? '#334155' : '#e5e7eb',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDark ? 0.3 : 0.05,
    shadowRadius: 4,
    gap: 10,
  },
  actionIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#9333ea',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  actionCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: isDark ? '#f1f5f9' : '#111827',
  },

  loadingContainer: {
    marginTop: 8,
  },
  loadingCard: {
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 15,
    color: isDark ? '#a78bfa' : '#7e22ce',
    fontWeight: '600',
  },
  emptyState: {
    marginTop: 8,
  },
  emptyStateGradient: {
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
  },
  emptyIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 24,
    elevation: 4,
    shadowColor: '#9333ea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  emptyIconGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: isDark ? '#f1f5f9' : '#111827',
    marginBottom: 12,
  },
  emptyStateText: {
    fontSize: 15,
    color: isDark ? '#94a3b8' : '#6b7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  emptyStateFeatures: {
    width: '100%',
    marginBottom: 28,
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? '#1e293b' : '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 12,
  },
  featureIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: isDark ? '#7e22ce' : '#f3e8ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    fontSize: 15,
    fontWeight: '600',
    color: isDark ? '#cbd5e1' : '#374151',
  },
  emptyStateButtons: {
    width: '100%',
    gap: 12,
  },
  emptyPrimaryButton: {
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#9333ea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  emptyPrimaryGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 10,
  },
  emptyPrimaryText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  emptySecondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: isDark ? '#7e22ce' : '#e9d5ff',
    backgroundColor: isDark ? '#1e293b' : '#fff',
    gap: 8,
  },
  emptySecondaryText: {
    fontSize: 15,
    fontWeight: '700',
    color: isDark ? '#a78bfa' : '#7e22ce',
  },
  list: {
    gap: 12,
  },
  unsortedSection: {
    marginTop: 12,
  },
  unsortedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? '#1e293b' : '#f3f4f6',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 12,
    gap: 8,
  },
  unsortedTemplates: {
    gap: 12,
  },
  unsortedTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: isDark ? '#94a3b8' : '#6b7280',
    flex: 1,
  },
  unsortedBadge: {
    backgroundColor: isDark ? '#334155' : '#fff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  unsortedBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: isDark ? '#cbd5e1' : '#6b7280',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  exerciseBrowserModal: {
    backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingTop: 12,
  },
  modalHandle: {
    alignItems: 'center',
    marginBottom: 16,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: isDark ? '#4B5563' : '#D1D5DB',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: isDark ? '#FFFFFF' : '#111827',
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? '#374151' : '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    fontSize: 16,
    color: isDark ? '#FFFFFF' : '#111827',
  },
  exerciseList: {
    paddingHorizontal: 20,
  },
  exerciseLoadingContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  exerciseLoadingText: {
    marginTop: 16,
    fontSize: 16,
    color: isDark ? '#9CA3AF' : '#6B7280',
  },
  exerciseGrid: {
    gap: 20,
    paddingBottom: 20,
  },
  categorySection: {
    marginBottom: 8,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? '#111827' : '#F3E8FF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 12,
    gap: 10,
  },
  categoryIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: isDark ? '#374151' : '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: isDark ? '#FFFFFF' : '#7E22CE',
    flex: 1,
  },
  categoryBadge: {
    backgroundColor: isDark ? '#7E22CE' : '#9333EA',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  categoryExercises: {
    gap: 10,
  },
  exerciseCard: {
    backgroundColor: isDark ? '#111827' : '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: isDark ? '#374151' : '#E5E7EB',
  },
  exerciseCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  exerciseIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: isDark ? '#374151' : '#F3E8FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#FFFFFF' : '#111827',
  },
  exerciseDescription: {
    fontSize: 14,
    color: isDark ? '#D1D5DB' : '#6B7280',
    lineHeight: 20,
  },
  exerciseEmptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  exerciseEmptyText: {
    fontSize: 16,
    color: isDark ? '#9CA3AF' : '#6B7280',
    marginTop: 16,
    textAlign: 'center',
  },
});

export default WorkoutScreen;
