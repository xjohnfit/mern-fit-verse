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

// Format date to YYYY-MM-DD
const formatDateForAPI = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

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
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch}  />}
        >
          <NutritionHeader topPadding={insets.top} />

          <DateNavigator selectedDate={selectedDate} onDateChange={handleDateChange} />

          {/* Nutrition Goals Card */}
          <View style={{ margin: 20, backgroundColor: isDark ? '#1F2937' : '#FFFFFF', borderRadius: 20, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 12, elevation: 5, borderWidth: 1, borderColor: isDark ? '#374151' : '#F3F4F6' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#10b98120', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                  <Ionicons name="stats-chart" size={24} color="#10b981" />
                </View>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: isDark ? '#FFFFFF' : '#111827' }}>
                  {getDateLabel(selectedDate)} Progress
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsEditingGoals(!isEditingGoals)}
                style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: isDark ? '#374151' : '#F3F4F6', alignItems: 'center', justifyContent: 'center' }}
              >
                <Ionicons name={isEditingGoals ? 'close' : 'settings-outline'} size={22} color="#10b981" />
              </TouchableOpacity>
            </View>

            {isEditingGoals ? (
              <View>
                {/* Calculated Calories (Read-only) */}
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, backgroundColor: isDark ? '#111827' : '#F9FAFB', borderRadius: 8, padding: 12, borderWidth: 1, borderColor: isDark ? '#374151' : '#E5E7EB' }}>
                  <View>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: isDark ? '#D1D5DB' : '#6B7280', marginBottom: 4 }}>
                      Calories Goal
                    </Text>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#3B82F6' }}>
                      {(() => {
                        const protein = Number(goalValues.protein) || 0;
                        const carbs = Number(goalValues.carbs) || 0;
                        const fats = Number(goalValues.fats) || 0;
                        return (protein * 4) + (carbs * 4) + (fats * 9);
                      })()} cal
                    </Text>
                  </View>
                  <View>
                    <Text style={{ fontSize: 11, color: isDark ? '#6B7280' : '#9CA3AF', marginTop: 2 }}>
                      Protein = 4 cal/g
                    </Text>
                    <Text style={{ fontSize: 11, color: isDark ? '#6B7280' : '#9CA3AF', marginTop: 2 }}>
                      Carbs = 4 cal/g
                    </Text>
                    <Text style={{ fontSize: 11, color: isDark ? '#6B7280' : '#9CA3AF', marginTop: 2 }}>
                      Fats = 9 cal/g
                    </Text>
                  </View>
                </View>

                {/* Editable Macros */}
                {['protein', 'carbs', 'fats'].map((key) => (
                  <View key={key} style={{ marginBottom: 12 }}>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: isDark ? '#D1D5DB' : '#6B7280', marginBottom: 4, textTransform: 'capitalize' }}>
                      {key} Goal (g)
                    </Text>
                    <TextInput
                      value={goalValues[key as keyof typeof goalValues]}
                      onChangeText={(text) => setGoalValues({ ...goalValues, [key]: text })}
                      keyboardType="numeric"
                      placeholder={`Enter ${key} goal`}
                      placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                      style={{
                        backgroundColor: isDark ? '#374151' : '#F3F4F6',
                        borderRadius: 8,
                        paddingHorizontal: 12,
                        paddingVertical: 12,
                        fontSize: 16,
                        color: isDark ? '#FFFFFF' : '#111827',
                      }}
                    />
                  </View>
                ))}
                <TouchableOpacity
                  onPress={handleSaveGoals}
                  disabled={isUpdatingGoals}
                  style={{ backgroundColor: '#10B981', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 8 }}
                >
                  {isUpdatingGoals ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '600' }}>Save Goals</Text>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                {/* Calories */}
                <View style={{ marginBottom: 20 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Ionicons name="flame" size={18} color="#3B82F6" style={{ marginRight: 6 }} />
                      <Text style={{ fontSize: 15, fontWeight: '700', color: isDark ? '#D1D5DB' : '#6B7280', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Calories
                      </Text>
                    </View>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: isDark ? '#FFFFFF' : '#111827' }}>
                      {totals.calories} <Text style={{ fontSize: 14, fontWeight: '600', color: isDark ? '#9CA3AF' : '#6B7280' }}>/ {goals.calories || 2000}</Text>
                    </Text>
                  </View>
                  <View style={{ height: 12, backgroundColor: isDark ? '#374151' : '#E5E7EB', borderRadius: 6, overflow: 'hidden' }}>
                    <LinearGradient
                      colors={['#3B82F6', '#60A5FA']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={{ height: '100%', width: `${Math.min(((totals.calories) / (goals.calories || 2000)) * 100, 100)}%` }}
                    />
                  </View>
                </View>

                {/* Macros */}
                <View style={{ gap: 8 }}>
                  {[
                    { key: 'protein', label: 'Protein', color: '#10B981', icon: 'fitness' as const, goal: goals.protein || 150 },
                    { key: 'carbs', label: 'Carbs', color: '#EF4444', icon: 'flash' as const, goal: goals.carbs || 200 },
                    { key: 'fats', label: 'Fats', color: '#F59E0B', icon: 'water' as const, goal: goals.fats || 65 },
                  ].map((macro) => {
                    const currentValue = Number(totals[macro.key as keyof typeof totals]);
                    const percentage = Math.min((currentValue / macro.goal) * 100, 100);

                    return (
                      <View key={macro.key} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: `${macro.color}20`, alignItems: 'center', justifyContent: 'center' }}>
                          <Ionicons name={macro.icon} size={18} color={macro.color} />
                        </View>
                        <View style={{ flex: 1, height: 36, borderRadius: 10, overflow: 'hidden', borderWidth: 1.5, borderColor: `${macro.color}30` }}>
                          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: isDark ? '#111827' : '#F9FAFB' }} />
                          <LinearGradient
                            colors={[`${macro.color}30`, `${macro.color}20`]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: `${percentage}%`, overflow: 'hidden' }}
                          />
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 12, height: '100%', position: 'relative' }}>
                            <Text style={{ fontSize: 13, color: isDark ? '#D1D5DB' : '#6B7280', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.3 }}>
                              {macro.label}
                            </Text>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: macro.color }}>
                              {currentValue.toFixed(1).replace(/\.0$/, '')}g <Text style={{ fontSize: 12, fontWeight: '600', color: isDark ? '#6B7280' : '#9CA3AF' }}>/ {macro.goal}g</Text>
                            </Text>
                          </View>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}
          </View>

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
