import React, { useState, useEffect } from 'react';
import {
    View,
    ScrollView,
    useColorScheme,
    Keyboard,
    StatusBar,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { useAppSelector } from '@/hooks/useRedux';
import {
    useGetFoodAutocompleteQuery,
    useLazySearchFoodsQuery,
    useLazyGetFoodByIdQuery,
} from '@/slices/fatSecretApiSlice';
import { useAddNutritionEntryMutation } from '@/slices/nutritionApiSlice';
import SearchHeader from '@/components/nutrition/SearchHeader';
import FoodSuggestionsList from '@/components/nutrition/FoodSuggestionsList';
import LoadingState from '@/components/nutrition/LoadingState';
import FoodDetailsCard from '@/components/nutrition/FoodDetailsCard';
import ServingSizeInput from '@/components/nutrition/ServingSizeInput';
import AddFoodButton from '@/components/nutrition/AddFoodButton';
import EmptySearchState from '@/components/nutrition/EmptySearchState';

const AddFoodScreen = () => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const router = useRouter();
    const params = useLocalSearchParams();
    const { userInfo } = useAppSelector((state) => state.auth);

    // Get params from navigation
    const date = params.date as string;
    const category = params.category as string;
    const categoryId = params.categoryId as string | undefined;

    // State
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [selectedFood, setSelectedFood] = useState<string>('');
    const [amount, setAmount] = useState<string>('1');
    const [servingUnit, setServingUnit] = useState<string>('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    // API hooks
    const shouldFetch = debouncedSearch.length >= 2;
    const { data: autocompleteResponse, isLoading: isAutocompleteLoading } = useGetFoodAutocompleteQuery(
        { expression: debouncedSearch, max_results: 8 },
        { skip: !shouldFetch }
    );
    const [triggerSearchFoods, { data: searchResults }] = useLazySearchFoodsQuery();
    const [triggerGetFoodById, { data: foodDetails, isLoading: isLoadingFoodDetails, isFetching: isFetchingFood }] = useLazyGetFoodByIdQuery();
    const [addNutritionEntry, { isLoading: isAddingEntry }] = useAddNutritionEntryMutation();

    const suggestions: string[] = autocompleteResponse?.success
        ? (autocompleteResponse.data.suggestions?.suggestion || []).map((s: any) => typeof s === 'string' ? s : s.name || '')
        : [];

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            // Only show suggestions if we have a search term and no food is selected
            if (searchTerm.length >= 2 && !selectedFood) {
                setShowSuggestions(true);
            } else {
                setShowSuggestions(false);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [searchTerm, selectedFood]);

    const handleSuggestionClick = async (suggestion: string) => {
        const suggestionText = typeof suggestion === 'string' ? suggestion : (suggestion as any).suggestion;

        // Dismiss keyboard first
        Keyboard.dismiss();

        // Hide suggestions immediately
        setShowSuggestions(false);
        setSelectedFood(suggestionText);
        setSearchTerm(suggestionText);
        setAmount('1');

        // Fetch food details using RTK Query
        try {
            const searchResult = await triggerSearchFoods({
                search_expression: suggestionText,
                max_results: 1,
            }).unwrap();

            // Handle the foods_search.results.food structure
            if (searchResult?.success && searchResult?.data?.foods_search?.results) {
                const results = searchResult.data.foods_search.results;

                // The results object contains a 'food' property which can be an array or single object
                const foodData = results.food;
                const foodArray = Array.isArray(foodData) ? foodData : [foodData];
                const firstFood = foodArray[0];

                if (firstFood?.food_id) {
                    const foodId = String(firstFood.food_id);
                    await triggerGetFoodById(foodId).unwrap();
                } else {
                    console.error('No food_id found in result:', firstFood);
                    Toast.show({ type: 'error', text1: 'Food ID not found' });
                }
            } else {
                console.error('Invalid search result structure:', searchResult);
                Toast.show({ type: 'error', text1: 'No food found' });
            }
        } catch (error) {
            console.error('Error fetching food:', error);
            Toast.show({ type: 'error', text1: 'Failed to load food details' });
        }
    };

    const calculateAdjustedValue = (baseValue: string | number, servingAmount: number) => {
        const amountNum = parseFloat(amount) || 1;
        const base = parseFloat(String(baseValue)) || 0;
        return ((base / servingAmount) * amountNum).toFixed(1);
    };

    const getNutritionValues = () => {
        if (!selectedFood || !foodDetails?.success || !foodDetails.data?.food) {
            return {
                calories: '0',
                protein: '0.0',
                carbs: '0.0',
                fats: '0.0',
                servingDescription: 'Select a food item',
            };
        }

        const food = foodDetails.data.food;
        let serving = food?.servings?.serving;
        if (Array.isArray(serving)) serving = serving[0];

        if (!serving) {
            return {
                calories: '0',
                protein: '0.0',
                carbs: '0.0',
                fats: '0.0',
                servingDescription: 'No serving info available',
            };
        }

        const servingDesc = serving.serving_description || '';
        const servingAmount = parseFloat(serving.number_of_units) || 1;
        const measurementUnit = serving.measurement_description || '';

        if (servingUnit === '') {
            setServingUnit(measurementUnit);
        }

        return {
            calories: calculateAdjustedValue(serving.calories, servingAmount),
            protein: calculateAdjustedValue(serving.protein, servingAmount),
            carbs: calculateAdjustedValue(serving.carbohydrate, servingAmount),
            fats: calculateAdjustedValue(serving.fat, servingAmount),
            servingDescription: servingDesc,
        };
    };

    const handleAddFood = async () => {
        if (!selectedFood || !foodDetails?.success) {
            Toast.show({ type: 'error', text1: 'Please select a food from search results' });
            return;
        }

        const food = foodDetails.data?.food;
        let serving = food?.servings?.serving;
        if (Array.isArray(serving)) serving = serving[0];

        if (!serving) {
            Toast.show({ type: 'error', text1: 'No serving information available' });
            return;
        }

        const servingAmount = parseFloat(serving.number_of_units) || 1;
        const amountNum = parseFloat(amount) || 1;
        const adjustedCalories = parseFloat(calculateAdjustedValue(serving.calories, servingAmount));
        const adjustedProtein = parseFloat(calculateAdjustedValue(serving.protein, servingAmount));
        const adjustedCarbs = parseFloat(calculateAdjustedValue(serving.carbohydrate, servingAmount));
        const adjustedFats = parseFloat(calculateAdjustedValue(serving.fat, servingAmount));

        try {
            await addNutritionEntry({
                date: date,
                mealCategory: category,
                customCategoryId: categoryId || undefined,
                foodItem: `${selectedFood} (${amountNum} ${servingUnit})`,
                calories: adjustedCalories,
                protein: adjustedProtein,
                carbs: adjustedCarbs,
                fats: adjustedFats,
            }).unwrap();

            Toast.show({ type: 'success', text1: 'Food added successfully!' });
            router.back();
        } catch (error: any) {
            Toast.show({ type: 'error', text1: error?.data?.message || 'Failed to add food' });
        }
    };

    return (
        <>
            <StatusBar barStyle="light-content" backgroundColor="#10b981" />
            <View style={{ flex: 1, backgroundColor: isDark ? '#111827' : '#F9FAFB' }}>
                    <SearchHeader
                        searchTerm={searchTerm}
                        onSearchChange={(text) => {
                        setSearchTerm(text);
                        if (selectedFood && text !== selectedFood) {
                            setSelectedFood('');
                        }
                    }}
                    onBack={() => router.back()}
                    onClear={() => {
                        setSearchTerm('');
                        setSelectedFood('');
                    }}
                    />

                    <ScrollView
                        style={{ flex: 1 }}
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={{ paddingBottom: 20 }}
                    >
                        <View style={{ paddingHorizontal: 20, paddingTop: 16 }}>
                            {showSuggestions && suggestions.length > 0 && (
                                <FoodSuggestionsList
                                    suggestions={suggestions}
                                    isLoading={isAutocompleteLoading}
                                    onSuggestionClick={handleSuggestionClick}
                                />
                            )}

                            {isFetchingFood && <LoadingState />}

                            {selectedFood && !isFetchingFood && foodDetails?.success && (
                                <>
                                    <FoodDetailsCard
                                        foodName={selectedFood}
                                        nutritionValues={getNutritionValues()}
                                    />

                                    <ServingSizeInput
                                        amount={amount}
                                        servingUnit={servingUnit}
                                        onAmountChange={setAmount}
                                    />

                                    <AddFoodButton
                                        onPress={handleAddFood}
                                        disabled={!amount || parseFloat(amount) <= 0}
                                        isLoading={isAddingEntry}
                                    />
                                </>
                            )}

                            {!selectedFood && !isFetchingFood && !showSuggestions && searchTerm.length === 0 && (
                                <EmptySearchState onSuggestionClick={setSearchTerm} />
                            )}
                        </View>
                    </ScrollView>
                </View>
        </>
    );
};

export default AddFoodScreen;
