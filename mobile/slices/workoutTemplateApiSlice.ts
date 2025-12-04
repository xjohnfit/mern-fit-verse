import { apiSlice } from './apiSlice';
import Constants from 'expo-constants';

const isDevelopment = Constants.expoConfig?.extra?.mode === 'development';

const BASE_URL = isDevelopment
    ? 'http://localhost:5004/api'
    : 'https://api.fitverse.codewithxjohn.com/api';

export interface WorkoutTemplateSet {
    setNumber: number;
    targetReps: number;
    targetWeight?: number;
    notes?: string;
}

export interface WorkoutTemplateExercise {
    exerciseId: string;
    exerciseName: string;
    sets: WorkoutTemplateSet[];
    restTime?: number; // deprecated, optional
    notes?: string;
}

export interface WorkoutTemplate {
    _id: string;
    userId: string;
    name: string;
    description?: string;
    exercises: WorkoutTemplateExercise[];
    folderId?: string;
    isPublic: boolean;
    createdAt: string;
    updatedAt: string;
}

interface GetTemplatesResponse {
    success: boolean;
    data: WorkoutTemplate[];
}

interface GetTemplateResponse {
    success: boolean;
    data: WorkoutTemplate;
}

interface CreateTemplateRequest {
    name: string;
    description?: string;
    exercises: WorkoutTemplateExercise[];
    folderId?: string;
    isPublic?: boolean;
}

interface CreateTemplateResponse {
    success: boolean;
    message: string;
    data: WorkoutTemplate;
}

interface UpdateTemplateRequest {
    id: string;
    name?: string;
    description?: string;
    exercises?: WorkoutTemplateExercise[];
    folderId?: string;
    isPublic?: boolean;
}

interface UpdateTemplateResponse {
    success: boolean;
    message: string;
    data: WorkoutTemplate;
}

interface DeleteTemplateResponse {
    success: boolean;
    message: string;
    data: WorkoutTemplate;
}

interface MoveTemplateRequest {
    id: string;
    folderId?: string | null;
}

interface MoveTemplateResponse {
    success: boolean;
    message: string;
    data: WorkoutTemplate;
}

export const workoutTemplateApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getTemplates: builder.query<GetTemplatesResponse, void>({
            query: () => ({
                url: `${BASE_URL}/workout-templates`,
                method: 'GET',
                credentials: 'include',
            }),
            providesTags: ['WorkoutTemplate'],
        }),
        getTemplateById: builder.query<GetTemplateResponse, string>({
            query: (id) => ({
                url: `${BASE_URL}/workout-templates/${id}`,
                method: 'GET',
                credentials: 'include',
            }),
            providesTags: ['WorkoutTemplate'],
        }),
        createTemplate: builder.mutation<
            CreateTemplateResponse,
            CreateTemplateRequest
        >({
            query: (data) => ({
                url: `${BASE_URL}/workout-templates`,
                method: 'POST',
                body: data,
                credentials: 'include',
            }),
            invalidatesTags: ['WorkoutTemplate'],
        }),
        updateTemplate: builder.mutation<
            UpdateTemplateResponse,
            UpdateTemplateRequest
        >({
            query: ({ id, ...data }) => ({
                url: `${BASE_URL}/workout-templates/${id}`,
                method: 'PUT',
                body: data,
                credentials: 'include',
            }),
            invalidatesTags: ['WorkoutTemplate'],
        }),
        deleteTemplate: builder.mutation<DeleteTemplateResponse, string>({
            query: (id) => ({
                url: `${BASE_URL}/workout-templates/${id}`,
                method: 'DELETE',
                credentials: 'include',
            }),
            invalidatesTags: ['WorkoutTemplate'],
        }),
        moveTemplate: builder.mutation<
            MoveTemplateResponse,
            MoveTemplateRequest
        >({
            query: ({ id, folderId }) => ({
                url: `${BASE_URL}/workout-templates/${id}/move`,
                method: 'PUT',
                body: { folderId },
                credentials: 'include',
            }),
            invalidatesTags: ['WorkoutTemplate'],
        }),
    }),
});

export const {
    useGetTemplatesQuery,
    useGetTemplateByIdQuery,
    useCreateTemplateMutation,
    useUpdateTemplateMutation,
    useDeleteTemplateMutation,
    useMoveTemplateMutation,
} = workoutTemplateApiSlice;
