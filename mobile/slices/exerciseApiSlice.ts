import { apiSlice } from './apiSlice';

const EXERCISES_URL = '/exercises';

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
            query: () => `${EXERCISES_URL}`,
            transformResponse: (response: ExerciseResponse[]) =>
                response.map(transformExercise),
        }),

        // Get exercise by ID
        getExerciseById: builder.query<Exercise, string>({
            query: (id) => `${EXERCISES_URL}/${id}`,
            transformResponse: (response: ExerciseResponse) =>
                transformExercise(response),
        }),

        // Create a new exercise
        createExercise: builder.mutation<Exercise, Partial<Exercise>>({
            query: (exercise) => ({
                url: `${EXERCISES_URL}`,
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
                url: `${EXERCISES_URL}/${id}`,
                method: 'PUT',
                body: data,
            }),
        }),

        // Delete an exercise
        deleteExercise: builder.mutation<{ message: string }, string>({
            query: (id) => ({
                url: `${EXERCISES_URL}/${id}`,
                method: 'DELETE',
            }),
        }),

        // Get exercises grouped by category
        getExercisesByCategory: builder.query<Record<string, Exercise[]>, void>(
            {
                query: () => `${EXERCISES_URL}/by-category`,
                transformResponse: (
                    response: Record<string, ExerciseResponse[]>
                ) => {
                    const transformed: Record<string, Exercise[]> = {};
                    for (const category in response) {
                        transformed[category] =
                            response[category].map(transformExercise);
                    }
                    return transformed;
                },
            }
        ),
    }),
});

export const {
    useGetExercisesQuery,
    useGetExerciseByIdQuery,
    useCreateExerciseMutation,
    useUpdateExerciseMutation,
    useDeleteExerciseMutation,
    useGetExercisesByCategoryQuery,
} = exerciseApiSlice;
