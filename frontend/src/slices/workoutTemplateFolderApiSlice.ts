import { apiSlice } from '@/slices/apiSlice';

const BASE_URL =
    import.meta.env.VITE_MODE === 'development'
        ? 'http://localhost:5004/api'
        : 'https://api.fitverse.codewithxjohn.com/api';

export interface WorkoutTemplateFolder {
    _id: string;
    userId: string;
    name: string;
    color: string;
    order: number;
    createdAt: string;
    updatedAt: string;
}

interface GetTemplateFoldersResponse {
    success: boolean;
    data: WorkoutTemplateFolder[];
}

interface CreateTemplateFolderRequest {
    name: string;
    color?: string;
}

interface CreateTemplateFolderResponse {
    success: boolean;
    message: string;
    data: WorkoutTemplateFolder;
}

interface UpdateTemplateFolderRequest {
    id: string;
    name?: string;
    color?: string;
}

interface UpdateTemplateFolderResponse {
    success: boolean;
    message: string;
    data: WorkoutTemplateFolder;
}

interface DeleteTemplateFolderResponse {
    success: boolean;
    message: string;
    data: WorkoutTemplateFolder;
}

interface ReorderTemplateFoldersRequest {
    folderIds: string[];
}

interface ReorderTemplateFoldersResponse {
    success: boolean;
    message: string;
    data: WorkoutTemplateFolder[];
}

export const workoutTemplateFolderApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getTemplateFolders: builder.query<GetTemplateFoldersResponse, void>({
            query: () => ({
                url: `${BASE_URL}/workout-template-folders`,
                method: 'GET',
                credentials: 'include',
            }),
            providesTags: ['WorkoutTemplateFolder'],
        }),
        createTemplateFolder: builder.mutation<
            CreateTemplateFolderResponse,
            CreateTemplateFolderRequest
        >({
            query: (data) => ({
                url: `${BASE_URL}/workout-template-folders`,
                method: 'POST',
                body: data,
                credentials: 'include',
            }),
            invalidatesTags: ['WorkoutTemplateFolder'],
        }),
        updateTemplateFolder: builder.mutation<
            UpdateTemplateFolderResponse,
            UpdateTemplateFolderRequest
        >({
            query: ({ id, ...data }) => ({
                url: `${BASE_URL}/workout-template-folders/${id}`,
                method: 'PUT',
                body: data,
                credentials: 'include',
            }),
            invalidatesTags: ['WorkoutTemplateFolder'],
        }),
        deleteTemplateFolder: builder.mutation<
            DeleteTemplateFolderResponse,
            string
        >({
            query: (id) => ({
                url: `${BASE_URL}/workout-template-folders/${id}`,
                method: 'DELETE',
                credentials: 'include',
            }),
            invalidatesTags: ['WorkoutTemplateFolder', 'WorkoutTemplate'],
        }),
        reorderTemplateFolders: builder.mutation<
            ReorderTemplateFoldersResponse,
            ReorderTemplateFoldersRequest
        >({
            query: (data) => ({
                url: `${BASE_URL}/workout-template-folders/reorder`,
                method: 'PUT',
                body: data,
                credentials: 'include',
            }),
            invalidatesTags: ['WorkoutTemplateFolder'],
        }),
    }),
});

export const {
    useGetTemplateFoldersQuery,
    useCreateTemplateFolderMutation,
    useUpdateTemplateFolderMutation,
    useDeleteTemplateFolderMutation,
    useReorderTemplateFoldersMutation,
} = workoutTemplateFolderApiSlice;
