import { apiSlice } from '@/slices/apiSlice';

const BASE_URL = '/api/exercises';

interface Exercise {
    id: string;
    name: string;
    description: string;
    instructions: string;
    image: string;
    category: string;
    createdAt?: Date;
    updatedAt?: Date;
}

// MongoDB response interface
interface ExerciseResponse {
    _id: string;
    name: string;
    description: string;
    instructions: string;
    image: string;
    category: string;
    createdAt?: Date;
    updatedAt?: Date;
}

// Transform MongoDB response to frontend format
const transformExercise = (exercise: ExerciseResponse): Exercise => ({
    id: exercise._id,
    name: exercise.name,
    description: exercise.description,
    instructions: exercise.instructions,
    image: exercise.image,
    category: exercise.category,
    createdAt: exercise.createdAt,
    updatedAt: exercise.updatedAt,
});

export const exerciseApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Get all exercises
        getExercises: builder.query<Exercise[], void>({
            query: () => `${BASE_URL}`,
            transformResponse: (response: ExerciseResponse[]) =>
                response.map(transformExercise),
        }),

        // Get exercise by ID
        getExerciseById: builder.query<Exercise, string>({
            query: (id) => `${BASE_URL}/${id}`,
            transformResponse: (response: ExerciseResponse) =>
                transformExercise(response),
        }),

        // Create a new exercise
        createExercise: builder.mutation<Exercise, Partial<Exercise>>({
            query: (exercise) => ({
                url: `${BASE_URL}`,
                method: 'POST',
                body: exercise,
            }),
        }),

        // Update an existing exercise
        updateExercise: builder.mutation<
            Exercise,
            { id: string; data: Partial<Exercise> }
        >({
            query: ({ id, data }) => ({
                url: `${BASE_URL}/${id}`,
                method: 'PUT',
                body: data,
            }),
        }),

        // Delete an exercise
        deleteExercise: builder.mutation<{ message: string }, string>({
            query: (id) => ({
                url: `${BASE_URL}/${id}`,
                method: 'DELETE',
            }),
        }),
    }),
});

export const {
    useGetExercisesQuery,
    useGetExerciseByIdQuery,
    useCreateExerciseMutation,
    useUpdateExerciseMutation,
    useDeleteExerciseMutation,
} = exerciseApiSlice;
