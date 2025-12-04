import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Constants from 'expo-constants';

const isDevelopment = Constants.expoConfig?.extra?.mode === 'development';

// Backend proxy configuration
const BASE_URL = isDevelopment
    ? 'http://localhost:5004/api/fatsecret'
    : 'https://api.fitverse.codewithxjohn.com/api/fatsecret';

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

// Create API slice using backend proxy (no direct FatSecret API calls)
export const fatSecretApiSlice = createApi({
    reducerPath: 'fatSecretApi',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
        credentials: 'include', // Include cookies for authentication
        prepareHeaders: (headers) => {
            headers.set('content-type', 'application/json');
            return headers;
        },
    }),
    endpoints: (builder) => ({
        searchFoods: builder.query({
            query: ({
                search_expression,
                max_results = 50,
                page_number = 0,
            }) => ({
                url: '/foods/search',
                params: {
                    search_expression,
                    max_results,
                    page_number,
                },
            }),
        }),
        getFood: builder.query({
            query: (food_id) => ({
                url: `/foods/${food_id}`,
            }),
        }),
        autocomplete: builder.query<
            ApiResponse<AutocompleteResponse>,
            AutocompleteParams
        >({
            query: ({ expression, max_results = 4, region = 'US' }) => ({
                url: '/foods/autocomplete',
                params: {
                    expression,
                    max_results,
                    region,
                },
            }),
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
