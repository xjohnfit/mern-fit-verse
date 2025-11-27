// React
import { useState, useEffect } from "react";

// Third-party libraries
import { Apple } from "lucide-react";
import { toast } from "sonner";

// Redux slices / API hooks
import {
    useSearchFoodsQuery,
    useLazyGetFoodByIdQuery,
} from "@/slices/fatSecretApiSlice";
import {
    useAddNutritionEntryMutation,
    useGetDailyNutritionQuery,
    useDeleteNutritionEntryMutation,
} from "@/slices/nutritionApiSlice";
import {
    useGetCustomCategoriesQuery,
    useAddCustomCategoryMutation,
    useDeleteCustomCategoryMutation,
} from "@/slices/customCategoryApiSlice";
import {
    useGetUserProfileQuery,
    useUpdateNutritionGoalsMutation,
} from "@/slices/usersApiSlice";

// Components
import {
    SearchFoodModal,
    TodaysMealsSection,
    NutritionGoalsSection,
    MacroDistributionSection,
    NutritionTopSection,
} from "./components";

// Types
import {
    type MealCategory,
    type MealCategoryData,
    type CustomCategory,
    type GoalValues,
    type AddFoodData,
} from "./nutrition.types";

// Constants & Utils
import { formatDateForAPI } from "@/lib/formatDate";
import { mealCategoriesConfig, availableColors } from "./constants";

const NutritionScreen = () => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedFood, setSelectedFood] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<
        MealCategory | string | null
    >(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
    const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [isEditingGoals, setIsEditingGoals] = useState(false);
    const [goalValues, setGoalValues] = useState<GoalValues>({
        calories: "",
        protein: "",
        carbs: "",
        fats: "",
    });

    // Get the formatted date string for the current selected date
    const dateString = formatDateForAPI(selectedDate);

    // API hooks
    const { data: dailyNutritionData, isLoading: _isLoadingNutrition } =
        useGetDailyNutritionQuery(dateString);
    const [addNutritionEntry, { isLoading: _isAddingEntry }] =
        useAddNutritionEntryMutation();
    const [deleteNutritionEntry] = useDeleteNutritionEntryMutation();
    const { data: customCategoriesData } = useGetCustomCategoriesQuery();
    const [addCustomCategory] = useAddCustomCategoryMutation();
    const [deleteCustomCategory] = useDeleteCustomCategoryMutation();
    const { data: userProfile } = useGetUserProfileQuery(undefined);
    const [updateNutritionGoals] = useUpdateNutritionGoalsMutation();

    // Initialize goal values from user profile
    useEffect(() => {
        if (userProfile?.nutritionGoals) {
            setGoalValues({
                calories: userProfile.nutritionGoals.calories?.toString() || "",
                protein: userProfile.nutritionGoals.protein?.toString() || "",
                carbs: userProfile.nutritionGoals.carbs?.toString() || "",
                fats: userProfile.nutritionGoals.fats?.toString() || "",
            });
        }
    }, [userProfile]);

    // Build meal categories with foods from API data
    const mealCategories: Record<MealCategory, MealCategoryData> = {
        breakfast: {
            ...mealCategoriesConfig.breakfast,
            foods:
                dailyNutritionData?.data?.entries?.filter(
                    (entry: any) => entry.mealCategory === "breakfast"
                ) || [],
        },
        lunch: {
            ...mealCategoriesConfig.lunch,
            foods:
                dailyNutritionData?.data?.entries?.filter(
                    (entry: any) => entry.mealCategory === "lunch"
                ) || [],
        },
        snack: {
            ...mealCategoriesConfig.snack,
            foods:
                dailyNutritionData?.data?.entries?.filter(
                    (entry: any) => entry.mealCategory === "snack"
                ) || [],
        },
        dinner: {
            ...mealCategoriesConfig.dinner,
            foods:
                dailyNutritionData?.data?.entries?.filter(
                    (entry: any) => entry.mealCategory === "dinner"
                ) || [],
        },
    };

    // Custom meal categories (max 3) - now from API
    const customCategories: CustomCategory[] = (
        customCategoriesData?.data || []
    ).map((cat) => ({
        id: cat._id,
        name: cat.name,
        icon: Apple,
        color: cat.color,
        foods:
            dailyNutritionData?.data?.entries?.filter(
                (entry: any) =>
                    entry.mealCategory === "custom" &&
                    entry.customCategoryId === cat._id
            ) || [],
    }));

    const handleAddCustomCategory = async () => {
        if (newCategoryName.trim() && customCategories.length < 3) {
            try {
                const color =
                    availableColors[customCategories.length % availableColors.length];
                await addCustomCategory({
                    name: newCategoryName.trim(),
                    color,
                }).unwrap();
                toast.success("Custom category created!");
                setNewCategoryName("");
                setShowAddCategoryModal(false);
            } catch (error: any) {
                console.error("Error adding custom category:", error);
                toast.error(error?.data?.message || "Failed to create category");
            }
        }
    };

    const handleRemoveCustomCategory = async (categoryId: string) => {
        try {
            await deleteCustomCategory(categoryId).unwrap();
            toast.success("Category deleted successfully");
        } catch (error: any) {
            console.error("Error deleting custom category:", error);
            toast.error(error?.data?.message || "Failed to delete category");
        }
    };

    const handleDeleteFoodEntry = async (entryId: string) => {
        try {
            await deleteNutritionEntry(entryId).unwrap();
            toast.success("Food entry deleted successfully");
        } catch (error: any) {
            console.error("Error deleting food entry:", error);
            toast.error(error?.data?.message || "Failed to delete food entry");
        }
    };

    // For searching food to get ID
    const { data: searchData, isFetching: isSearching } = useSearchFoodsQuery(
        selectedFood
            ? { search_expression: selectedFood, max_results: 1 }
            : { search_expression: "", max_results: 1 },
        { skip: !selectedFood }
    );

    // For fetching food details
    const [triggerGetFoodById, { data: foodDetails, isFetching: isLoadingDetails }] =
        useLazyGetFoodByIdQuery();

    useEffect(() => {
        // Updated to match actual API response structure
        const foodsArr = searchData?.data?.foods_search?.results?.food;
        if (
            searchData?.success &&
            foodsArr &&
            Array.isArray(foodsArr) &&
            foodsArr.length > 0
        ) {
            const foundId = foodsArr[0]?.food_id;
            console.log("foundId:", foundId);
            if (foundId) {
                console.log("Calling triggerGetFoodById with:", foundId);
                triggerGetFoodById(foundId);
            }
        }
    }, [searchData, triggerGetFoodById]);

    const handleFoodSelect = (food: string) => {
        setSelectedFood(food);
    };

    const handleCategorySelect = (category: string, categoryId?: string) => {
        setSelectedCategory(category);
        setSelectedCategoryId(categoryId || null);
        setSelectedFood(null); // Clear selected food when opening modal
        setShowModal(true);
    };

    const handleCancel = () => {
        setShowModal(false);
        setSelectedFood(null);
        setSelectedCategory(null);
        setSelectedCategoryId(null);
    };

    const handleAddFood = async (nutritionData: AddFoodData) => {
        try {
            // Ensure category is selected
            if (!selectedCategory) {
                toast.error("Please select a meal category");
                return;
            }

            // Add the selected date and category to the nutrition data
            const dataWithDate = {
                ...nutritionData,
                date: formatDateForAPI(selectedDate),
                mealCategory: selectedCategory,
                customCategoryId: selectedCategoryId || undefined,
            };
            await addNutritionEntry(dataWithDate).unwrap();
            toast.success("Food added successfully!");
            setShowModal(false);
            setSelectedFood(null);
            setSelectedCategory(null);
            setSelectedCategoryId(null);
        } catch (error: any) {
            console.error("Error adding nutrition entry:", error);
            toast.error(error?.data?.message || "Failed to add food item");
        }
    };

    const handleSaveGoals = async () => {
        try {
            const goals = {
                calories: goalValues.calories ? Number(goalValues.calories) : undefined,
                protein: goalValues.protein ? Number(goalValues.protein) : undefined,
                carbs: goalValues.carbs ? Number(goalValues.carbs) : undefined,
                fats: goalValues.fats ? Number(goalValues.fats) : undefined,
            };

            await updateNutritionGoals(goals).unwrap();
            toast.success("Nutrition goals updated successfully!");
            setIsEditingGoals(false);
        } catch (error: any) {
            console.error("Error updating nutrition goals:", error);
            toast.error(error?.data?.message || "Failed to update goals");
        }
    };

    const handleGoalChange = (field: string, value: string) => {
        // Allow only numbers and decimal point
        if (value === "" || /^\d*\.?\d*$/.test(value)) {
            setGoalValues((prev) => {
                const newValues = { ...prev, [field]: value };

                // Auto-calculate calories when protein, carbs, or fats change
                // 1g protein = 4 calories, 1g carb = 4 calories, 1g fat = 9 calories
                if (field === "protein" || field === "carbs" || field === "fats") {
                    const protein =
                        field === "protein" ? Number(value) : Number(newValues.protein);
                    const carbs =
                        field === "carbs" ? Number(value) : Number(newValues.carbs);
                    const fats = field === "fats" ? Number(value) : Number(newValues.fats);

                    const calculatedCalories = protein * 4 + carbs * 4 + fats * 9;
                    newValues.calories =
                        calculatedCalories > 0 ? calculatedCalories.toFixed(0) : "";
                }

                return newValues;
            });
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-green-900/20 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-green-400/10 dark:bg-green-600/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-emerald-400/10 dark:bg-emerald-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="max-w-6xl mx-auto">
                    {/* Top Section: Header, Day Navigator, Search */}
                    <NutritionTopSection
                        selectedDate={selectedDate}
                        onDateChange={setSelectedDate}
                    />

                    {/* Nutrition Goals */}
                    <div className="mb-6">
                        <NutritionGoalsSection
                            isEditingGoals={isEditingGoals}
                            setIsEditingGoals={setIsEditingGoals}
                            goalValues={goalValues}
                            handleGoalChange={handleGoalChange}
                            handleSaveGoals={handleSaveGoals}
                            dailyNutritionData={dailyNutritionData}
                        />
                    </div>

                    {/* Main Layout: Macro Distribution + Today's Meals */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Sidebar: Macro Distribution Chart */}
                        <div className="lg:col-span-1">
                            <MacroDistributionSection
                                dailyNutritionData={dailyNutritionData}
                            />
                        </div>

                        {/* Right Content: Today's Meals */}
                        <div className="lg:col-span-2">
                            <TodaysMealsSection
                                mealCategories={mealCategories}
                                customCategories={customCategories}
                                showAddCategoryModal={showAddCategoryModal}
                                setShowAddCategoryModal={setShowAddCategoryModal}
                                newCategoryName={newCategoryName}
                                setNewCategoryName={setNewCategoryName}
                                onAddCustomCategory={handleAddCustomCategory}
                                onRemoveCustomCategory={handleRemoveCustomCategory}
                                onDeleteFoodEntry={handleDeleteFoodEntry}
                                onFoodSelect={handleCategorySelect}
                            />
                        </div>
                    </div>

                    {/* Food Modal */}
                    {showModal && (
                        <SearchFoodModal
                            handleCancel={handleCancel}
                            handleAddFood={handleAddFood}
                            isSearching={isSearching}
                            isLoadingDetails={isLoadingDetails}
                            foodDetails={foodDetails}
                            customCategories={customCategories.map((cat) => ({
                                id: cat.id,
                                name: cat.name,
                            }))}
                            onFoodSelect={handleFoodSelect}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default NutritionScreen;