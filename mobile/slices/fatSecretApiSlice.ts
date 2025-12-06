import { apiSlice } from './apiSlice';

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

// Inject endpoints into the main apiSlice (avoids duplicate middleware)
export const fatSecretApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        searchFoods: builder.query({
            query: ({
                search_expression,
                max_results = 50,
                page_number = 0,
            }) => ({
                url: `${BASE_URL}/search`,
                params: {
                    search_expression,
                    max_results,
                    page_number,
                },
            }),
            providesTags: ['Food'],
        }),
        getFood: builder.query({
            query: (food_id) => ({
                url: `${BASE_URL}/food/${food_id}`,
            }),
            providesTags: (_result, _error, food_id) => [
                { type: 'Food', id: food_id },
            ],
        }),
        autocomplete: builder.query<
            ApiResponse<AutocompleteResponse>,
            AutocompleteParams
        >({
            query: ({ expression, max_results = 4, region = 'US' }) => ({
                url: `${BASE_URL}/autocomplete`,
                params: {
                    expression,
                    max_results,
                    region,
                },
            }),
            providesTags: ['FoodSuggestions'],
        }),
    }),
});

export const {
    useSearchFoodsQuery,
    useGetFoodQuery,
    useAutocompleteQuery,
    useLazySearchFoodsQuery,
    useLazyGetFoodQuery,
    useLazyAutocompleteQuery,
} = fatSecretApiSlice;
