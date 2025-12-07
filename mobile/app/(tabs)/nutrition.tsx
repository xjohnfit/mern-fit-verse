import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
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

// Check if date is today and return appropriate label
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
      pathname: '/search-food',
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
      <StatusBar barStyle="light-content" backgroundColor={isDark ? '#92400E' : '#F59E0B'} />
      <View style={{ flex: 1, backgroundColor: isDark ? '#111827' : '#F9FAFB' }}>
        <ScrollView
          style={{ flex: 1 }}
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
        >
          {/* Header with Gradient */}
          <LinearGradient
            colors={isDark ? ['#92400E', '#B45309', '#D97706'] : ['#F59E0B', '#F97316', '#FB923C']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ paddingHorizontal: 20, paddingTop: insets.top + 20, paddingBottom: 28 }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <View style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                <Ionicons name="nutrition" size={32} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 4 }}>
                  Nutrition
                </Text>
                <Text style={{ fontSize: 15, color: 'rgba(255,255,255,0.95)', fontWeight: '500' }}>
                  Track your daily intake
                </Text>
              </View>
            </View>
          </LinearGradient>

          {/* Date Navigator */}
          <View style={{ paddingHorizontal: 20, paddingVertical: 12, backgroundColor: isDark ? '#1F2937' : '#FFFFFF', borderBottomWidth: 1, borderBottomColor: isDark ? '#374151' : '#E5E7EB' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <TouchableOpacity
                onPress={() => handleDateChange(-1)}
                style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: isDark ? '#374151' : '#F3F4F6', alignItems: 'center', justifyContent: 'center' }}
              >
                <Ionicons name="chevron-back" size={20} color={isDark ? '#FFFFFF' : '#111827'} />
              </TouchableOpacity>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="calendar" size={18} color="#F59E0B" style={{ marginRight: 8 }} />
                <Text style={{ fontSize: 17, fontWeight: '700', color: isDark ? '#FFFFFF' : '#111827' }}>
                  {selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => handleDateChange(1)}
                style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: isDark ? '#374151' : '#F3F4F6', alignItems: 'center', justifyContent: 'center' }}
              >
                <Ionicons name="chevron-forward" size={20} color={isDark ? '#FFFFFF' : '#111827'} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Nutrition Goals Card */}
          <View style={{ margin: 20, backgroundColor: isDark ? '#1F2937' : '#FFFFFF', borderRadius: 20, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 12, elevation: 5, borderWidth: 1, borderColor: isDark ? '#374151' : '#F3F4F6' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#F59E0B20', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                  <Ionicons name="stats-chart" size={24} color="#F59E0B" />
                </View>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: isDark ? '#FFFFFF' : '#111827' }}>
                  {getDateLabel(selectedDate)} Progress
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsEditingGoals(!isEditingGoals)}
                style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: isDark ? '#374151' : '#F3F4F6', alignItems: 'center', justifyContent: 'center' }}
              >
                <Ionicons name={isEditingGoals ? 'close' : 'settings-outline'} size={22} color="#F59E0B" />
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

                {/* Macros Grid */}
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  {[
                    { key: 'protein', label: 'Protein', color: '#10B981', icon: 'fitness' as const, goal: goals.protein || 150 },
                    { key: 'carbs', label: 'Carbs', color: '#EF4444', icon: 'flash' as const, goal: goals.carbs || 200 },
                    { key: 'fats', label: 'Fats', color: '#F59E0B', icon: 'water' as const, goal: goals.fats || 65 },
                  ].map((macro) => (
                    <View key={macro.key} style={{ flex: 1, backgroundColor: isDark ? '#111827' : '#F9FAFB', borderRadius: 14, padding: 14, borderWidth: 2, borderColor: `${macro.color}30` }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                        <Ionicons name={macro.icon} size={16} color={macro.color} />
                        <Text style={{ fontSize: 11, color: isDark ? '#9CA3AF' : '#6B7280', marginLeft: 4, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.3 }}>
                          {macro.label}
                        </Text>
                      </View>
                      <Text style={{ fontSize: 22, fontWeight: 'bold', color: macro.color, marginBottom: 4 }}>
                        {Number(totals[macro.key as keyof typeof totals]).toFixed(1).replace(/\.0$/, '')}g
                      </Text>
                      <Text style={{ fontSize: 12, color: isDark ? '#6B7280' : '#9CA3AF', fontWeight: '600' }}>
                        / {macro.goal}g
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* Meal Categories */}
          <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
              <View style={{ width: 4, height: 28, backgroundColor: '#F59E0B', borderRadius: 2, marginRight: 12 }} />
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: isDark ? '#FFFFFF' : '#111827' }}>
                {getDateLabel(selectedDate)} Meals
              </Text>
            </View>

            {/* Standard Meal Categories */}
            {mealCategories.map((category) => (
              <View key={category.key} style={{ backgroundColor: isDark ? '#1F2937' : '#FFFFFF', borderRadius: 18, padding: 18, marginBottom: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3, borderWidth: 1, borderColor: isDark ? '#374151' : '#F3F4F6' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: category.foods.length > 0 ? 14 : 0 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    <View style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: `${category.color}20`, alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
                      <Ionicons name={category.icon} size={24} color={category.color} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 18, fontWeight: '700', color: isDark ? '#FFFFFF' : '#111827', marginBottom: 2 }}>
                        {category.name}
                      </Text>
                      <Text style={{ fontSize: 13, color: isDark ? '#9CA3AF' : '#6B7280', fontWeight: '500' }}>
                        {category.foods.length} {category.foods.length === 1 ? 'item' : 'items'}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleOpenAddFood(category.key)}
                    style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#10B98120', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Ionicons name="add" size={26} color="#10B981" />
                  </TouchableOpacity>
                </View>

                {category.foods.length > 0 && (
                  <View style={{ marginTop: 4 }}>
                    {category.foods.map((food: any, index: number) => (
                      <View key={food._id} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 14, backgroundColor: isDark ? '#111827' : '#F9FAFB', borderRadius: 12, marginBottom: index < category.foods.length - 1 ? 8 : 0 }}>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 16, fontWeight: '600', color: isDark ? '#FFFFFF' : '#111827', marginBottom: 4 }}>
                            {food.foodItem}
                          </Text>
                          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                              <Ionicons name="flame" size={12} color="#F59E0B" />
                              <Text style={{ fontSize: 12, color: isDark ? '#9CA3AF' : '#6B7280', marginLeft: 3, fontWeight: '600' }}>{food.calories}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                              <Ionicons name="fitness" size={12} color="#3B82F6" />
                              <Text style={{ fontSize: 12, color: isDark ? '#9CA3AF' : '#6B7280', marginLeft: 3, fontWeight: '600' }}>P:{food.protein}g</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                              <Ionicons name="flash" size={12} color="#F59E0B" />
                              <Text style={{ fontSize: 12, color: isDark ? '#9CA3AF' : '#6B7280', marginLeft: 3, fontWeight: '600' }}>C:{food.carbs}g</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                              <Ionicons name="water" size={12} color="#EF4444" />
                              <Text style={{ fontSize: 12, color: isDark ? '#9CA3AF' : '#6B7280', marginLeft: 3, fontWeight: '600' }}>F:{food.fats}g</Text>
                            </View>
                          </View>
                        </View>
                        <TouchableOpacity
                          onPress={() => handleDeleteFood(food._id)}
                          style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#EF444420', alignItems: 'center', justifyContent: 'center', marginLeft: 12 }}
                        >
                          <Ionicons name="trash-outline" size={18} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}

            {/* Custom Categories */}
            {customCategories.map((category) => (
              <View key={category.id} style={{ backgroundColor: isDark ? '#1F2937' : '#FFFFFF', borderRadius: 18, padding: 18, marginBottom: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3, borderWidth: 1, borderColor: isDark ? '#374151' : '#F3F4F6' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: category.foods.length > 0 ? 14 : 0 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    <View style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: `${category.color}20`, alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
                      <Ionicons name="nutrition" size={24} color={category.color} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 18, fontWeight: '700', color: isDark ? '#FFFFFF' : '#111827', marginBottom: 2 }}>
                        {category.name}
                      </Text>
                      <Text style={{ fontSize: 13, color: isDark ? '#9CA3AF' : '#6B7280', fontWeight: '500' }}>
                        {category.foods.length} {category.foods.length === 1 ? 'item' : 'items'}
                      </Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TouchableOpacity
                      onPress={() => handleOpenAddFood('custom', category.id)}
                      style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#10B98120', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Ionicons name="add" size={24} color="#10B981" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDeleteCategory(category.id)}
                      style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#EF444420', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Ionicons name="close" size={20} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>

                {category.foods.length > 0 && (
                  <View style={{ marginTop: 4 }}>
                    {category.foods.map((food: any, index: number) => (
                      <View key={food._id} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 14, backgroundColor: isDark ? '#111827' : '#F9FAFB', borderRadius: 12, marginBottom: index < category.foods.length - 1 ? 8 : 0 }}>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 16, fontWeight: '600', color: isDark ? '#FFFFFF' : '#111827', marginBottom: 4 }}>
                            {food.foodItem}
                          </Text>
                          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                              <Ionicons name="flame" size={12} color="#F59E0B" />
                              <Text style={{ fontSize: 12, color: isDark ? '#9CA3AF' : '#6B7280', marginLeft: 3, fontWeight: '600' }}>{food.calories}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                              <Ionicons name="fitness" size={12} color="#3B82F6" />
                              <Text style={{ fontSize: 12, color: isDark ? '#9CA3AF' : '#6B7280', marginLeft: 3, fontWeight: '600' }}>P:{food.protein}g</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                              <Ionicons name="flash" size={12} color="#F59E0B" />
                              <Text style={{ fontSize: 12, color: isDark ? '#9CA3AF' : '#6B7280', marginLeft: 3, fontWeight: '600' }}>C:{food.carbs}g</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                              <Ionicons name="water" size={12} color="#EF4444" />
                              <Text style={{ fontSize: 12, color: isDark ? '#9CA3AF' : '#6B7280', marginLeft: 3, fontWeight: '600' }}>F:{food.fats}g</Text>
                            </View>
                          </View>
                        </View>
                        <TouchableOpacity
                          onPress={() => handleDeleteFood(food._id)}
                          style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#EF444420', alignItems: 'center', justifyContent: 'center', marginLeft: 12 }}
                        >
                          <Ionicons name="trash-outline" size={18} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}

            {/* Add Custom Category Button */}
            {customCategories.length < 3 && (
              <TouchableOpacity
                onPress={() => setShowAddCategoryModal(true)}
                style={{ backgroundColor: isDark ? '#1F2937' : '#FFFFFF', borderRadius: 18, padding: 20, borderWidth: 2, borderColor: '#F59E0B', borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#F59E0B20', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                    <Ionicons name="add" size={24} color="#F59E0B" />
                  </View>
                  <Text style={{ fontSize: 17, fontWeight: '700', color: '#F59E0B' }}>
                    Add Custom Category
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          </View>

          {/* Add Category Modal */}
          <Modal visible={showAddCategoryModal} animationType="slide" transparent>
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', paddingHorizontal: 20 }}>
              <View style={{ backgroundColor: isDark ? '#1F2937' : '#FFFFFF', borderRadius: 16, padding: 24 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: isDark ? '#FFFFFF' : '#111827', marginBottom: 16 }}>
                  Add Custom Category
                </Text>
                <TextInput
                  value={newCategoryName}
                  onChangeText={setNewCategoryName}
                  placeholder="Category name"
                  placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                  style={{
                    backgroundColor: isDark ? '#374151' : '#F3F4F6',
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                    fontSize: 16,
                    color: isDark ? '#FFFFFF' : '#111827',
                    marginBottom: 16,
                  }}
                />
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <TouchableOpacity
                    onPress={() => setShowAddCategoryModal(false)}
                    style={{ flex: 1, backgroundColor: isDark ? '#374151' : '#E5E7EB', borderRadius: 12, paddingVertical: 14, alignItems: 'center' }}
                  >
                    <Text style={{ color: isDark ? '#FFFFFF' : '#111827', fontSize: 16, fontWeight: '600' }}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleAddCustomCategory}
                    style={{ flex: 1, backgroundColor: '#10B981', borderRadius: 12, paddingVertical: 14, alignItems: 'center' }}
                  >
                    <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '600' }}>Add</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </View>
    </>
  );
};

export default nutrition;
