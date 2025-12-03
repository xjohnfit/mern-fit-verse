import { apiSlice } from '@/slices/apiSlice';

const BASE_URL =
    import.meta.env.VITE_MODE === 'development'
        ? 'http://localhost:5004/api'
        : 'https://api.fitverse.codewithxjohn.com';

export const workoutApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createWorkout: builder.mutation({
            query: (workoutData) => ({
                url: `${BASE_URL}`,
                method: 'POST',
                credentials: 'include',
                body: workoutData,
            }),
            invalidatesTags: ['Workout'],
        }),
        getWorkouts: builder.query({
            query: () => ({
                url: `${BASE_URL}`,
                method: 'GET',
                credentials: 'include',
            }),
            providesTags: ['Workout'],
        }),
        getWorkoutById: builder.query({
            query: (id) => ({
                url: `${BASE_URL}/${id}`,
                method: 'GET',
                credentials: 'include',
            }),
            providesTags: (_result, _error, id) => [{ type: 'Workout', id }],
        }),
        updateWorkout: builder.mutation({
            query: ({ id, ...workoutData }) => ({
                url: `${BASE_URL}/${id}`,
                method: 'PUT',
                body: workoutData,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: 'Workout', id },
                'Workout',
            ],
        }),
        deleteWorkout: builder.mutation({
            query: (id) => ({
                url: `${BASE_URL}/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Workout'],
        }),
        getWorkoutStats: builder.query({
            query: () => ({
                url: `${BASE_URL}/stats`,
                method: 'GET',
                credentials: 'include',
            }),
            providesTags: ['Workout'],
        }),
    }),
});

export const {
    useCreateWorkoutMutation,
    useGetWorkoutsQuery,
    useGetWorkoutByIdQuery,
    useUpdateWorkoutMutation,
    useDeleteWorkoutMutation,
    useGetWorkoutStatsQuery,
} = workoutApiSlice;
