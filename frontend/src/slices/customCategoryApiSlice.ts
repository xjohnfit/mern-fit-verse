import { apiSlice } from '@/slices/apiSlice';

const BASE_URL = '/custom-categories';

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
                url: BASE_URL,
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
                url: `${BASE_URL}/add`,
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
                url: `${BASE_URL}/delete/${categoryId}`,
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
