import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  useColorScheme,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { formatDateForAPI } from '@/lib/formatDate';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { useAppSelector } from '@/hooks/useRedux';
import { AddCustomCategoryModal } from '@/components/nutrition/AddCustomCategoryModal';
import DateNavigator from '@/components/nutrition/DateNavigator';
import NutritionHeader from '@/components/nutrition/NutritionHeader';
import MealsSectionHeader from '@/components/nutrition/MealsSectionHeader';
import MealCategoryCard from '@/components/nutrition/MealCategoryCard';
import CustomCategoryCard from '@/components/nutrition/CustomCategoryCard';
import AddCustomCategoryButton from '@/components/nutrition/AddCustomCategoryButton';
import NutritionGoalsCard from '@/components/nutrition/NutritionGoalsCard';
import {
  useGetDailyNutritionQuery,
  useAddNutritionEntryMutation,
  useDeleteNutritionEntryMutation,
} from '@/slices/nutritionApiSlice';
import {
  useGetCustomCategoriesQuery,
  useAddCustomCategoryMutation,
  useDeleteCustomCategoryMutation,
} from '@/slices/customCategoryApiSlice';
import {
  useGetUserProfileQuery,
  useUpdateNutritionGoalsMutation,
} from '@/slices/usersApiSlice';

// Types
interface MealCategory {
  key: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  foods: any[];
}

interface CustomCategory {
  id: string;
  name: string;
  color: string;
  foods: any[];
}

// Check if the date is today and return the appropriate label
const getDateLabel = (date: Date): string => {
  const today = new Date();
  const isToday =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  if (isToday) {
    return "Today's";
  }

  // Format: "Dec 7's" or "Jan 15's"
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + "'s";
};

const nutrition = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { userInfo } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // State
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isEditingGoals, setIsEditingGoals] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Goals form state
  const [goalValues, setGoalValues] = useState({
    calories: '',
    protein: '',
    carbs: '',
    fats: '',
  });

  // API hooks
  const dateString = formatDateForAPI(selectedDate);
  const { data: dailyNutritionData, isLoading, refetch } = useGetDailyNutritionQuery(dateString);
  const [deleteNutritionEntry] = useDeleteNutritionEntryMutation();
  const { data: customCategoriesData } = useGetCustomCategoriesQuery();
  const [addCustomCategory] = useAddCustomCategoryMutation();
  const [deleteCustomCategory] = useDeleteCustomCategoryMutation();
  const { data: userProfile } = useGetUserProfileQuery(undefined);
  const [updateNutritionGoals, { isLoading: isUpdatingGoals }] = useUpdateNutritionGoalsMutation();

  // Initialize goal values from user profile
  useEffect(() => {
    if (userProfile?.nutritionGoals) {
      const protein = userProfile.nutritionGoals.protein || 0;
      const carbs = userProfile.nutritionGoals.carbs || 0;
      const fats = userProfile.nutritionGoals.fats || 0;
      const calculatedCalories = (protein * 4) + (carbs * 4) + (fats * 9);

      setGoalValues({
        calories: calculatedCalories.toString(),
        protein: protein.toString(),
        carbs: carbs.toString(),
        fats: fats.toString(),
      });
    }
  }, [userProfile]);

  // Meal categories configuration
  const mealCategoriesConfig = {
    breakfast: { name: 'Breakfast', icon: 'sunny' as const, color: '#F59E0B' },
    lunch: { name: 'Lunch', icon: 'fast-food' as const, color: '#10B981' },
    snack: { name: 'Snack', icon: 'ice-cream' as const, color: '#8B5CF6' },
    dinner: { name: 'Dinner', icon: 'restaurant' as const, color: '#EF4444' },
  };

  // Build meal categories with foods
  const mealCategories: MealCategory[] = Object.entries(mealCategoriesConfig).map(([key, config]) => ({
    key,
    ...config,
    foods: dailyNutritionData?.data?.entries?.filter((entry: any) => entry.mealCategory === key) || [],
  }));

  // Custom categories
  const customCategories: CustomCategory[] = (customCategoriesData?.data || []).map((cat: any) => ({
    id: cat._id,
    name: cat.name,
    color: cat.color,
    foods: dailyNutritionData?.data?.entries?.filter(
      (entry: any) => entry.mealCategory === 'custom' && entry.customCategoryId === cat._id
    ) || [],
  }));

  // Handlers
  const handleDateChange = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const handleOpenAddFood = (category: string, categoryId?: string) => {
    router.push({
      pathname: '/nutrition/addFoodScreen',
      params: {
        date: dateString,
        category: category,
        categoryId: categoryId || '',
      },
    });
  };

  const handleDeleteFood = (entryId: string) => {
    Alert.alert('Delete Food', 'Are you sure you want to delete this food entry?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteNutritionEntry(entryId).unwrap();
          } catch (error: any) {
            Toast.show({ type: 'error', text1: 'Failed to delete food' });
          }
        },
      },
    ]);
  };

  const handleAddCustomCategory = async () => {
    if (!newCategoryName.trim()) {
      Toast.show({ type: 'error', text1: 'Please enter a category name' });
      return;
    }
    if (customCategories.length >= 3) {
      Toast.show({ type: 'error', text1: 'Maximum 3 custom categories allowed' });
      return;
    }

    try {
      const colors = ['#3B82F6', '#EC4899', '#14B8A6'];
      await addCustomCategory({
        name: newCategoryName.trim(),
        color: colors[customCategories.length],
      }).unwrap();
      setNewCategoryName('');
      setShowAddCategoryModal(false);
    } catch (error: any) {
      Toast.show({ type: 'error', text1: error?.data?.message || 'Failed to create category' });
    }
  };

  const handleDeleteCategory = (categoryId: string) => {
    Alert.alert('Delete Category', 'Are you sure? This will delete all foods in this category.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteCustomCategory(categoryId).unwrap();
          } catch (error: any) {
            Toast.show({ type: 'error', text1: 'Failed to delete category' });
          }
        },
      },
    ]);
  };

  const handleSaveGoals = async () => {
    try {
      const protein = goalValues.protein ? Number(goalValues.protein) : 0;
      const carbs = goalValues.carbs ? Number(goalValues.carbs) : 0;
      const fats = goalValues.fats ? Number(goalValues.fats) : 0;
      const calculatedCalories = (protein * 4) + (carbs * 4) + (fats * 9);

      await updateNutritionGoals({
        calories: calculatedCalories,
        protein: protein || undefined,
        carbs: carbs || undefined,
        fats: fats || undefined,
      }).unwrap();
      setIsEditingGoals(false);
    } catch (error: any) {
      Toast.show({ type: 'error', text1: error?.data?.message || 'Failed to update goals' });
    }
  };

  const totals = dailyNutritionData?.data?.totals || { calories: 0, protein: 0, carbs: 0, fats: 0 };
  const goals = userProfile?.nutritionGoals || {};

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#10b981" />
      <View style={{ flex: 1, backgroundColor: isDark ? '#111827' : '#F9FAFB' }}>
        <ScrollView
          style={{ flex: 1 }}
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
        >
          <NutritionHeader topPadding={insets.top} />

          <DateNavigator selectedDate={selectedDate} onDateChange={handleDateChange} />

          <NutritionGoalsCard
            dateLabel={getDateLabel(selectedDate)}
            isEditingGoals={isEditingGoals}
            setIsEditingGoals={setIsEditingGoals}
            goalValues={goalValues}
            setGoalValues={setGoalValues}
            handleSaveGoals={handleSaveGoals}
            isUpdatingGoals={isUpdatingGoals}
            totals={totals}
            goals={goals}
          />

          {/* Meal Categories */}
          <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
            <MealsSectionHeader dateLabel={getDateLabel(selectedDate)} />

            {/* Standard Meal Categories */}
            {mealCategories.map((category) => (
              <MealCategoryCard
                key={category.key}
                category={category}
                onAddFood={() => handleOpenAddFood(category.key)}
                onDeleteFood={handleDeleteFood}
              />
            ))}

            {/* Custom Categories */}
            {customCategories.map((category) => (
              <CustomCategoryCard
                key={category.id}
                category={category}
                onAddFood={() => handleOpenAddFood('custom', category.id)}
                onDeleteCategory={() => handleDeleteCategory(category.id)}
                onDeleteFood={handleDeleteFood}
              />
            ))}

            {/* Add Custom Category Button */}
            {customCategories.length < 3 && (
              <AddCustomCategoryButton onPress={() => setShowAddCategoryModal(true)} />
            )}
          </View>

          {/* Add Category Modal */}
          <AddCustomCategoryModal
            visible={showAddCategoryModal}
            newCategoryName={newCategoryName}
            onChangeText={setNewCategoryName}
            onCancel={() => setShowAddCategoryModal(false)}
            onAdd={handleAddCustomCategory}
          />
        </ScrollView>
      </View>
    </>
  );
};

export default nutrition;
