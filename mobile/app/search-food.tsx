import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    useColorScheme,
    FlatList,
    Keyboard,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import SafeScreen from '@/components/layout/SafeScreen';
import Toast from 'react-native-toast-message';
import { useAppSelector } from '@/hooks/useRedux';
import {
    useGetFoodAutocompleteQuery,
    useLazySearchFoodsQuery,
    useLazyGetFoodByIdQuery,
} from '@/slices/fatSecretApiSlice';
import { useAddNutritionEntryMutation } from '@/slices/nutritionApiSlice';

const SearchFood = () => {
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

            console.log('Search result:', searchResult);

            // Handle the foods_search.results.food structure
            if (searchResult?.success && searchResult?.data?.foods_search?.results) {
                const results = searchResult.data.foods_search.results;

                // The results object contains a 'food' property which can be an array or single object
                const foodData = results.food;
                const foodArray = Array.isArray(foodData) ? foodData : [foodData];
                const firstFood = foodArray[0];

                if (firstFood?.food_id) {
                    const foodId = String(firstFood.food_id);
                    console.log('Fetching food details for ID:', foodId);
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
        <SafeScreen>
            <View style={{ flex: 1, backgroundColor: isDark ? '#111827' : '#F9FAFB' }}>
                {/* Header with gradient */}
                <View style={{ backgroundColor: isDark ? '#1F2937' : '#FFFFFF', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: isDark ? '#374151' : '#E5E7EB' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                        <TouchableOpacity
                            onPress={() => router.back()}
                            style={{
                                marginRight: 16,
                                width: 36,
                                height: 36,
                                borderRadius: 18,
                                backgroundColor: isDark ? '#374151' : '#F3F4F6',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <Ionicons name="arrow-back" size={20} color={isDark ? '#FFFFFF' : '#111827'} />
                        </TouchableOpacity>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 22, fontWeight: 'bold', color: isDark ? '#FFFFFF' : '#111827' }}>
                                Add Food
                            </Text>
                            <Text style={{ fontSize: 13, color: isDark ? '#9CA3AF' : '#6B7280', marginTop: 2 }}>
                                Search and track your nutrition
                            </Text>
                        </View>
                    </View>

                    {/* Search Input in Header */}
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: isDark ? '#374151' : '#F3F4F6',
                        borderRadius: 12,
                        paddingHorizontal: 16,
                        borderWidth: 2,
                        borderColor: searchTerm.length > 0 ? '#10B981' : 'transparent'
                    }}>
                        <Ionicons name="search" size={20} color="#10B981" />
                        <TextInput
                            value={searchTerm}
                            onChangeText={(text) => {
                                setSearchTerm(text);
                                if (selectedFood && text !== selectedFood) {
                                    setSelectedFood('');
                                }
                            }}
                            placeholder="Try 'chicken breast' or 'apple'..."
                            placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                            style={{
                                flex: 1,
                                paddingVertical: 14,
                                paddingHorizontal: 12,
                                fontSize: 16,
                                color: isDark ? '#FFFFFF' : '#111827',
                            }}
                        />
                        {searchTerm.length > 0 && (
                            <TouchableOpacity
                                onPress={() => {
                                    setSearchTerm('');
                                    setSelectedFood('');
                                }}
                                style={{
                                    width: 28,
                                    height: 28,
                                    borderRadius: 14,
                                    backgroundColor: isDark ? '#4B5563' : '#E5E7EB',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Ionicons name="close" size={16} color={isDark ? '#FFFFFF' : '#111827'} />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                <ScrollView
                    style={{ flex: 1 }}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{ paddingBottom: 20 }}
                >
                    <View style={{ paddingHorizontal: 20, paddingTop: 16 }}>
                        {/* Autocomplete Suggestions with animation */}
                        {showSuggestions && suggestions.length > 0 && (
                            <View style={{ marginBottom: 16 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                                    <Ionicons name="list-outline" size={16} color={isDark ? '#9CA3AF' : '#6B7280'} />
                                    <Text style={{ fontSize: 13, fontWeight: '600', color: isDark ? '#9CA3AF' : '#6B7280', marginLeft: 6 }}>
                                        {suggestions.length} SUGGESTIONS
                                    </Text>
                                </View>
                                {suggestions.map((item, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => handleSuggestionClick(item)}
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            paddingVertical: 14,
                                            paddingHorizontal: 16,
                                            backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                                            marginBottom: 8,
                                            borderRadius: 12,
                                            borderWidth: 1,
                                            borderColor: isDark ? '#374151' : '#E5E7EB',
                                            shadowColor: '#000',
                                            shadowOffset: { width: 0, height: 1 },
                                            shadowOpacity: 0.05,
                                            shadowRadius: 2,
                                            elevation: 1,
                                        }}
                                    >
                                        <View style={{
                                            width: 36,
                                            height: 36,
                                            borderRadius: 8,
                                            backgroundColor: '#10B98120',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginRight: 12
                                        }}>
                                            <Ionicons name="restaurant" size={18} color="#10B981" />
                                        </View>
                                        <Text style={{ fontSize: 15, color: isDark ? '#FFFFFF' : '#111827', flex: 1, fontWeight: '500' }}>
                                            {item}
                                        </Text>
                                        <Ionicons name="chevron-forward" size={18} color={isDark ? '#6B7280' : '#9CA3AF'} />
                                    </TouchableOpacity>
                                ))}
                                {isAutocompleteLoading && (
                                    <View style={{ paddingVertical: 16, alignItems: 'center' }}>
                                        <ActivityIndicator color="#10B981" size="small" />
                                        <Text style={{ marginTop: 8, fontSize: 13, color: isDark ? '#9CA3AF' : '#6B7280' }}>
                                            Searching...
                                        </Text>
                                    </View>
                                )}
                            </View>
                        )}

                        {/* Loading State */}
                        {isFetchingFood && (
                            <View style={{
                                paddingVertical: 60,
                                alignItems: 'center',
                                backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                                borderRadius: 16,
                                marginBottom: 16
                            }}>
                                <ActivityIndicator size="large" color="#10B981" />
                                <Text style={{ marginTop: 16, fontSize: 15, color: isDark ? '#D1D5DB' : '#6B7280', fontWeight: '500' }}>
                                    Loading nutrition data...
                                </Text>
                            </View>
                        )}

                        {/* Selected Food Details - Enhanced Card */}
                        {selectedFood && !isFetchingFood && foodDetails?.success && (
                            <>
                                {/* Food Info Card */}
                                <View style={{
                                    backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                                    borderRadius: 16,
                                    padding: 20,
                                    marginBottom: 20,
                                    borderWidth: 1,
                                    borderColor: isDark ? '#374151' : '#E5E7EB',
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 8,
                                    elevation: 3,
                                }}>
                                    {/* Header with icon */}
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                                        <View style={{
                                            width: 48,
                                            height: 48,
                                            borderRadius: 12,
                                            backgroundColor: '#10B98120',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginRight: 12
                                        }}>
                                            <Ionicons name="nutrition" size={24} color="#10B981" />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: isDark ? '#FFFFFF' : '#111827', marginBottom: 4 }}>
                                                {selectedFood}
                                            </Text>
                                            <Text style={{ fontSize: 13, color: isDark ? '#9CA3AF' : '#6B7280' }}>
                                                {getNutritionValues().servingDescription}
                                            </Text>
                                        </View>
                                    </View>

                                    {/* Nutrition Grid */}
                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                                        <View style={{
                                            backgroundColor: isDark ? '#111827' : '#F9FAFB',
                                            paddingHorizontal: 16,
                                            paddingVertical: 14,
                                            borderRadius: 12,
                                            flex: 1,
                                            minWidth: '47%',
                                            borderWidth: 2,
                                            borderColor: '#10B98130'
                                        }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                                                <Ionicons name="flame" size={16} color="#EF4444" />
                                                <Text style={{ fontSize: 11, color: isDark ? '#9CA3AF' : '#6B7280', marginLeft: 4, fontWeight: '600', textTransform: 'uppercase' }}>
                                                    Calories
                                                </Text>
                                            </View>
                                            <Text style={{ fontSize: 24, fontWeight: 'bold', color: isDark ? '#FFFFFF' : '#111827' }}>
                                                {getNutritionValues().calories}
                                            </Text>
                                        </View>
                                        <View style={{
                                            backgroundColor: isDark ? '#111827' : '#F9FAFB',
                                            paddingHorizontal: 16,
                                            paddingVertical: 14,
                                            borderRadius: 12,
                                            flex: 1,
                                            minWidth: '47%',
                                            borderWidth: 2,
                                            borderColor: '#3B82F630'
                                        }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                                                <Ionicons name="fitness" size={16} color="#3B82F6" />
                                                <Text style={{ fontSize: 11, color: isDark ? '#9CA3AF' : '#6B7280', marginLeft: 4, fontWeight: '600', textTransform: 'uppercase' }}>
                                                    Protein
                                                </Text>
                                            </View>
                                            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#3B82F6' }}>
                                                {getNutritionValues().protein}g
                                            </Text>
                                        </View>
                                        <View style={{
                                            backgroundColor: isDark ? '#111827' : '#F9FAFB',
                                            paddingHorizontal: 16,
                                            paddingVertical: 14,
                                            borderRadius: 12,
                                            flex: 1,
                                            minWidth: '47%',
                                            borderWidth: 2,
                                            borderColor: '#F59E0B30'
                                        }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                                                <Ionicons name="flash" size={16} color="#F59E0B" />
                                                <Text style={{ fontSize: 11, color: isDark ? '#9CA3AF' : '#6B7280', marginLeft: 4, fontWeight: '600', textTransform: 'uppercase' }}>
                                                    Carbs
                                                </Text>
                                            </View>
                                            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#F59E0B' }}>
                                                {getNutritionValues().carbs}g
                                            </Text>
                                        </View>
                                        <View style={{
                                            backgroundColor: isDark ? '#111827' : '#F9FAFB',
                                            paddingHorizontal: 16,
                                            paddingVertical: 14,
                                            borderRadius: 12,
                                            flex: 1,
                                            minWidth: '47%',
                                            borderWidth: 2,
                                            borderColor: '#EF444430'
                                        }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                                                <Ionicons name="water" size={16} color="#EF4444" />
                                                <Text style={{ fontSize: 11, color: isDark ? '#9CA3AF' : '#6B7280', marginLeft: 4, fontWeight: '600', textTransform: 'uppercase' }}>
                                                    Fats
                                                </Text>
                                            </View>
                                            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#EF4444' }}>
                                                {getNutritionValues().fats}g
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                {/* Amount Input Card */}
                                <View style={{
                                    backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                                    borderRadius: 16,
                                    padding: 20,
                                    marginBottom: 20,
                                    borderWidth: 1,
                                    borderColor: isDark ? '#374151' : '#E5E7EB',
                                }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                                        <Ionicons name="scale-outline" size={20} color="#10B981" />
                                        <Text style={{ fontSize: 15, fontWeight: '600', color: isDark ? '#D1D5DB' : '#111827', marginLeft: 8 }}>
                                            Serving Size
                                        </Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <TextInput
                                            value={amount}
                                            onChangeText={setAmount}
                                            keyboardType="decimal-pad"
                                            placeholder="1.0"
                                            placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                                            style={{
                                                flex: 1,
                                                backgroundColor: isDark ? '#374151' : '#F3F4F6',
                                                borderRadius: 12,
                                                paddingHorizontal: 16,
                                                paddingVertical: 16,
                                                fontSize: 18,
                                                fontWeight: '600',
                                                color: isDark ? '#FFFFFF' : '#111827',
                                                borderWidth: 2,
                                                borderColor: amount && parseFloat(amount) > 0 ? '#10B981' : 'transparent',
                                                marginRight: 12
                                            }}
                                        />
                                        <View style={{
                                            backgroundColor: isDark ? '#374151' : '#F3F4F6',
                                            borderRadius: 12,
                                            paddingHorizontal: 20,
                                            paddingVertical: 16,
                                        }}>
                                            <Text style={{ fontSize: 16, fontWeight: '600', color: isDark ? '#9CA3AF' : '#6B7280' }}>
                                                {servingUnit || 'unit'}
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                {/* Add Button - Prominent */}
                                <TouchableOpacity
                                    onPress={handleAddFood}
                                    disabled={isAddingEntry || !amount || parseFloat(amount) <= 0}
                                    style={{
                                        backgroundColor: (!amount || parseFloat(amount) <= 0) ? (isDark ? '#374151' : '#D1D5DB') : '#10B981',
                                        borderRadius: 16,
                                        paddingVertical: 18,
                                        alignItems: 'center',
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        shadowColor: '#10B981',
                                        shadowOffset: { width: 0, height: 4 },
                                        shadowOpacity: (!amount || parseFloat(amount) <= 0) ? 0 : 0.3,
                                        shadowRadius: 8,
                                        elevation: (!amount || parseFloat(amount) <= 0) ? 0 : 5,
                                    }}
                                >
                                    {isAddingEntry ? (
                                        <ActivityIndicator color="#FFFFFF" />
                                    ) : (
                                        <>
                                            <Ionicons name="add-circle" size={24} color="#FFFFFF" style={{ marginRight: 8 }} />
                                            <Text style={{ color: '#FFFFFF', fontSize: 17, fontWeight: 'bold' }}>
                                                Add to Diary
                                            </Text>
                                        </>
                                    )}
                                </TouchableOpacity>
                            </>
                        )}

                        {/* Empty State - Enhanced */}
                        {!selectedFood && !isFetchingFood && !showSuggestions && searchTerm.length === 0 && (
                            <View style={{
                                paddingVertical: 80,
                                alignItems: 'center',
                                backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                                borderRadius: 16,
                                marginTop: 20,
                                borderWidth: 2,
                                borderColor: isDark ? '#374151' : '#E5E7EB',
                                borderStyle: 'dashed'
                            }}>
                                <View style={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: 40,
                                    backgroundColor: '#10B98120',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: 20
                                }}>
                                    <Ionicons name="search" size={40} color="#10B981" />
                                </View>
                                <Text style={{ fontSize: 18, fontWeight: '600', color: isDark ? '#D1D5DB' : '#111827', textAlign: 'center', marginBottom: 8 }}>
                                    Start Your Search
                                </Text>
                                <Text style={{ fontSize: 14, color: isDark ? '#9CA3AF' : '#6B7280', textAlign: 'center', paddingHorizontal: 40 }}>
                                    Type at least 2 characters in the search bar above to find foods
                                </Text>
                                <View style={{ marginTop: 24, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8 }}>
                                    {['Chicken', 'Rice', 'Apple', 'Salmon'].map((suggestion, idx) => (
                                        <TouchableOpacity
                                            key={idx}
                                            onPress={() => setSearchTerm(suggestion)}
                                            style={{
                                                paddingHorizontal: 16,
                                                paddingVertical: 8,
                                                backgroundColor: isDark ? '#374151' : '#F3F4F6',
                                                borderRadius: 20,
                                                borderWidth: 1,
                                                borderColor: isDark ? '#4B5563' : '#E5E7EB',
                                            }}
                                        >
                                            <Text style={{ fontSize: 13, color: isDark ? '#D1D5DB' : '#6B7280', fontWeight: '500' }}>
                                                {suggestion}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        )}
                    </View>
                </ScrollView>
            </View>
        </SafeScreen>
    );
};

export default SearchFood;
