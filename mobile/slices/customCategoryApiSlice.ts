import { apiSlice } from './apiSlice';
import Constants from 'expo-constants';

const isDevelopment = Constants.expoConfig?.extra?.mode === 'development';

const BASE_URL = isDevelopment
    ? 'http://localhost:5004/api'
    : 'https://api.fitverse.codewithxjohn.com/api';

export interface CustomCategory {
    _id: string;
    user: string;
    name: string;
    color: string;
    order: number;
    createdAt: string;
    updatedAt: string;
}

interface GetCustomCategoriesResponse {
    success: boolean;
    data: CustomCategory[];
}

interface AddCustomCategoryRequest {
    name: string;
    color: string;
}

interface AddCustomCategoryResponse {
    success: boolean;
    message: string;
    data: CustomCategory;
}

interface DeleteCustomCategoryResponse {
    success: boolean;
    message: string;
    data: CustomCategory;
}

export const customCategoryApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCustomCategories: builder.query<GetCustomCategoriesResponse, void>({
            query: () => ({
                url: `${BASE_URL}/custom-categories`,
                method: 'GET',
                credentials: 'include',
            }),
            providesTags: ['CustomCategory'],
        }),
        addCustomCategory: builder.mutation<
            AddCustomCategoryResponse,
            AddCustomCategoryRequest
        >({
            query: (data) => ({
                url: `${BASE_URL}/custom-categories/add`,
                method: 'POST',
                credentials: 'include',
                body: data,
            }),
            invalidatesTags: ['CustomCategory'],
        }),
        deleteCustomCategory: builder.mutation<
            DeleteCustomCategoryResponse,
            string
        >({
            query: (categoryId) => ({
                url: `${BASE_URL}/custom-categories/delete/${categoryId}`,
                method: 'DELETE',
                credentials: 'include',
            }),
            invalidatesTags: ['CustomCategory'],
        }),
    }),
});

export const {
    useGetCustomCategoriesQuery,
    useAddCustomCategoryMutation,
    useDeleteCustomCategoryMutation,
} = customCategoryApiSlice;
