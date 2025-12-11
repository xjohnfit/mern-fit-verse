import { apiSlice, baseUrl as BASE_URL } from './apiSlice';

interface NutritionEntry {
    _id: string;
    user: string;
    date: string;
    mealCategory: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'Custom';
    foodItem: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    createdAt: string;
    updatedAt: string;
}

interface NutritionTotals {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
}

interface GetDailyNutritionResponse {
    success: boolean;
    data: {
        entries: NutritionEntry[];
        totals: NutritionTotals;
        date: string;
    };
}

interface AddNutritionEntryRequest {
    date?: string;
    mealCategory: string;
    customCategoryId?: string;
    foodItem: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
}

interface AddNutritionEntryResponse {
    success: boolean;
    message: string;
    data: NutritionEntry;
}

export const nutritionApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getDailyNutrition: builder.query<
            GetDailyNutritionResponse,
            string | void
        >({
            query: (date) => ({
                url: `${BASE_URL}/nutrition${date ? `?date=${date}` : ''}`,
                method: 'GET',
                credentials: 'include',
            }),
            providesTags: ['Nutrition'],
        }),
        addNutritionEntry: builder.mutation<
            AddNutritionEntryResponse,
            AddNutritionEntryRequest
        >({
            query: (data) => ({
                url: `${BASE_URL}/nutrition/add`,
                method: 'POST',
                credentials: 'include',
                body: data,
            }),
            invalidatesTags: ['Nutrition'],
        }),
        deleteNutritionEntry: builder.mutation<
            { success: boolean; message: string },
            string
        >({
            query: (entryId) => ({
                url: `${BASE_URL}/nutrition/delete/${entryId}`,
                method: 'DELETE',
                credentials: 'include',
            }),
            invalidatesTags: ['Nutrition'],
        }),
    }),
});

export const {
    useGetDailyNutritionQuery,
    useAddNutritionEntryMutation,
    useDeleteNutritionEntryMutation,
} = nutritionApiSlice;
