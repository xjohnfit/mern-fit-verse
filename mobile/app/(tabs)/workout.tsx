import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  useColorScheme,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Redux
import { useGetTemplateFoldersQuery } from "@/slices/workoutTemplateFolderApiSlice";
import { useGetTemplatesQuery } from "@/slices/workoutTemplateApiSlice";

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
import type { WorkoutTemplateFolder } from "@/types/workout.types";

// Styles
import createStyles from "@/styles/workout/workoutStyles";

// =====================
// Main WorkoutScreen Component
// =====================

const WorkoutScreen = () => {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [showCreateFolderDialog, setShowCreateFolderDialog] = useState(false);
  const [showEditFolderDialog, setShowEditFolderDialog] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<WorkoutTemplateFolder | null>(null);
  const [hasActiveWorkout, setHasActiveWorkout] = useState(false);
  const opacity = useSharedValue(0);

  const { data: foldersResponse, isLoading: foldersLoading } =
    useGetTemplateFoldersQuery();
  const { data: templatesResponse, isLoading: templatesLoading } =
    useGetTemplatesQuery();

  const folders = foldersResponse?.data || [];
  const templates = templatesResponse?.data || [];
  const unsortedTemplates = templates.filter((t) => !t.folderId);

  const handleEditFolder = (folder: WorkoutTemplateFolder) => {
    setSelectedFolder(folder);
    setShowEditFolderDialog(true);
  };

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 500 });
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  useEffect(() => {
    const checkActiveWorkout = async () => {
      try {
        const workoutStartTime =
          await AsyncStorage.getItem("workout_start_time");
        setHasActiveWorkout(workoutStartTime !== null);
      } catch (error) {
        console.error("Error checking active workout:", error);
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
      <StatusBar barStyle="light-content" />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <WorkoutHeader paddingTop={insets.top} />

        <View style={styles.contentWrapper}>
          {hasActiveWorkout && <ActiveWorkoutBanner />}

          <Animated.View style={[styles.section, animatedStyle]}>
            <View style={styles.sectionHeader}>
              <View style={styles.titleContainer}>
                <View style={styles.iconBadge}>
                  <LinearGradient
                    colors={["#f3e8ff", "#ede9fe"]}
                    style={styles.iconBadgeGradient}
                  >
                    <Ionicons name="albums" size={20} color="#9333ea" />
                  </LinearGradient>
                </View>
                <View>
                  <Text style={styles.sectionTitle}>My Templates</Text>
                  <Text style={styles.sectionSubtitle}>
                    {templates.length}{" "}
                    {templates.length === 1 ? "template" : "templates"} •{" "}
                    {folders.length}{" "}
                    {folders.length === 1 ? "folder" : "folders"}
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
                    colors={
                      isDark ? ["#581c87", "#6b21a8"] : ["#f3e8ff", "#e9d5ff"]
                    }
                    style={styles.actionIconCircle}
                  >
                    <Ionicons
                      name="folder-open"
                      size={22}
                      color={isDark ? "#f3e8ff" : "#7e22ce"}
                    />
                  </LinearGradient>
                  <Text style={styles.actionCardTitle}>New Folder</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionCard}
                  onPress={() => router.push("/workout/create-template" as any)}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={["#9333ea", "#7e22ce"]}
                    style={styles.actionIconCircle}
                  >
                    <Ionicons name="add-circle" size={22} color="#fff" />
                  </LinearGradient>
                  <Text style={styles.actionCardTitle}>New Template</Text>
                </TouchableOpacity>
              </View>

            <TouchableOpacity
              style={styles.actionCardFull}
              onPress={() => router.push('/workout/BrowseExercisesScreen' as any)}
              activeOpacity={0.8}
            >
                <LinearGradient
                  colors={
                    isDark ? ["#065f46", "#047857"] : ["#d1fae5", "#a7f3d0"]
                  }
                  style={styles.actionIconCircle}
                >
                  <Ionicons
                    name="library"
                    size={22}
                    color={isDark ? "#d1fae5" : "#047857"}
                  />
                </LinearGradient>
                <Text style={styles.actionCardTitle}>Browse Exercises</Text>
              </TouchableOpacity>
            </View>

            {isLoading ? (
              <View style={styles.loadingContainer}>
                <LinearGradient
                  colors={
                    isDark ? ["#1e293b", "#334155"] : ["#f3e8ff", "#faf5ff"]
                  }
                  style={styles.loadingCard}
                >
                  <ActivityIndicator
                    size="large"
                    color={isDark ? "#a78bfa" : "#9333ea"}
                  />
                  <Text style={styles.loadingText}>
                    Loading your templates...
                  </Text>
                </LinearGradient>
              </View>
            ) : folders.length === 0 && templates.length === 0 ? (
              <View style={styles.emptyState}>
                <LinearGradient
                  colors={
                    isDark ? ["#1e293b", "#334155"] : ["#faf5ff", "#f3e8ff"]
                  }
                  style={styles.emptyStateGradient}
                >
                  <View style={styles.emptyIconContainer}>
                    <LinearGradient
                      colors={["#9333ea", "#7e22ce"]}
                      style={styles.emptyIconGradient}
                    >
                      <Ionicons name="fitness" size={48} color="#fff" />
                    </LinearGradient>
                  </View>
                  <Text style={styles.emptyStateTitle}>Start Your Journey</Text>
                  <Text style={styles.emptyStateText}>
                    Create your first workout template to streamline your
                    training and track your progress effectively.
                  </Text>
                  <View style={styles.emptyStateFeatures}>
                    <View style={styles.featureItem}>
                      <View style={styles.featureIcon}>
                        <Ionicons
                          name="checkmark-circle"
                          size={20}
                          color={isDark ? "#e9d5ff" : "#9333ea"}
                        />
                      </View>
                      <Text style={styles.featureText}>
                        Save time with templates
                      </Text>
                    </View>
                    <View style={styles.featureItem}>
                      <View style={styles.featureIcon}>
                        <Ionicons
                          name="checkmark-circle"
                          size={20}
                          color={isDark ? "#e9d5ff" : "#9333ea"}
                        />
                      </View>
                      <Text style={styles.featureText}>
                        Organize with folders
                      </Text>
                    </View>
                    <View style={styles.featureItem}>
                      <View style={styles.featureIcon}>
                        <Ionicons
                          name="checkmark-circle"
                          size={20}
                          color={isDark ? "#e9d5ff" : "#9333ea"}
                        />
                      </View>
                      <Text style={styles.featureText}>
                        Track your progress
                      </Text>
                    </View>
                  </View>
                  <View style={styles.emptyStateButtons}>
                    <TouchableOpacity
                      style={styles.emptyPrimaryButton}
                      onPress={() =>
                        router.push("/workout/create-template" as any)
                      }
                    >
                      <LinearGradient
                        colors={["#9333ea", "#7e22ce"]}
                        style={styles.emptyPrimaryGradient}
                      >
                        <Ionicons name="add-circle" size={22} color="#fff" />
                        <Text style={styles.emptyPrimaryText}>
                          Create Template
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.emptySecondaryButton}
                      onPress={() => setShowCreateFolderDialog(true)}
                    >
                      <Ionicons
                        name="folder-open"
                        size={20}
                        color={isDark ? "#a78bfa" : "#9333ea"}
                      />
                      <Text style={styles.emptySecondaryText}>
                        Create Folder
                      </Text>
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
                      <Ionicons
                        name="albums-outline"
                        size={18}
                        color="#6b7280"
                      />
                      <Text style={styles.unsortedTitle}>
                        Unsorted Templates
                      </Text>
                      <View style={styles.unsortedBadge}>
                        <Text style={styles.unsortedBadgeText}>
                          {unsortedTemplates.length}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.unsortedTemplates}>
                      {unsortedTemplates.map((template) => (
                        <TemplateCard
                          key={template._id}
                          template={template}
                          hasActiveWorkout={hasActiveWorkout}
                        />
                      ))}
                    </View>
                  </View>
                )}
              </View>
            )}
          </Animated.View>
        </View>

        <View style={styles.contentWrapper}>
          <FreestyleWorkoutCard hasActiveWorkout={hasActiveWorkout} />
        </View>
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
    </View>
  );
};

export default WorkoutScreen;
