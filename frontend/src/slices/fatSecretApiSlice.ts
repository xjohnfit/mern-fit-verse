import { apiSlice } from '@/slices/apiSlice';

const BASE_URL = '/fatsecret';

// Types for API responses
export interface FoodSuggestion {
    suggestion: string;
}

export interface AutocompleteResponse {
    suggestions: {
        suggestion: FoodSuggestion[] | string[];
    };
}

export interface AutocompleteParams {
    expression: string;
    max_results?: number; // Optional: default is 4, max is 10
    region?: string; // Optional: default is "US" (e.g., "FR" for France)
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    error?: string;
}

// Inject endpoints into the base apiSlice
export const fatSecretApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Foods Autocomplete - Uses backend proxy to FatSecret API
        getFoodAutocomplete: builder.query<
            ApiResponse<AutocompleteResponse>,
            AutocompleteParams
        >({
            query: ({ expression, max_results = 4, region = 'US' }) => ({
                url: `${BASE_URL}/autocomplete`,
                method: 'GET',
                params: {
                    expression,
                    max_results: Math.min(max_results, 10), // Ensure max is 10
                    region,
                },
            }),
            providesTags: ['FoodSuggestions'],
            transformResponse: (
                response: ApiResponse<AutocompleteResponse>
            ) => {
                // Backend returns structured response with success/data
                return response;
            },
        }),

        // Food Search - Uses backend proxy for advanced search
        searchFoods: builder.query<
            ApiResponse<any>,
            {
                search_expression: string;
                page_number?: number;
                max_results?: number;
            }
        >({
            query: ({
                search_expression,
                page_number = 0,
                max_results = 20,
            }) => ({
                url: `${BASE_URL}/search`,
                method: 'GET',
                params: {
                    search_expression,
                    page_number,
                    max_results: Math.min(max_results, 50),
                },
            }),
            providesTags: ['Food'],
        }),

        // Get Food Details by ID - Uses backend proxy
        getFoodById: builder.query<ApiResponse<any>, string>({
            query: (foodId) => ({
                url: `${BASE_URL}/food/${foodId}`,
                method: 'GET',
            }),
            providesTags: (_result, _error, foodId) => [
                { type: 'Food', id: foodId },
            ],
        }),


        // Health check for FatSecret integration
        checkNutritionHealth: builder.query<
            ApiResponse<{ message: string; timestamp: string }>,
            void
        >({
            query: () => ({
                url: `${BASE_URL}/health`,
                method: 'GET',
            }),
        }),
    }),
});

export const {
    useGetFoodAutocompleteQuery,
    useSearchFoodsQuery,
    useGetFoodByIdQuery,
    useCheckNutritionHealthQuery,
    useLazyGetFoodAutocompleteQuery,
    useLazySearchFoodsQuery,
    useLazyGetFoodByIdQuery,
} = fatSecretApiSlice;
