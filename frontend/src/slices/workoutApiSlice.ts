import { apiSlice } from './apiSlice';

const WORKOUTS_URL = '/api/workouts';

export const workoutApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createWorkout: builder.mutation({
            query: (workoutData) => ({
                url: WORKOUTS_URL,
                method: 'POST',
                body: workoutData,
            }),
        }),
        getWorkouts: builder.query({
            query: () => ({
                url: WORKOUTS_URL,
                method: 'GET',
            }),
        }),
        getWorkoutById: builder.query({
            query: (id) => ({
                url: `${WORKOUTS_URL}/${id}`,
                method: 'GET',
            }),
        }),
        updateWorkout: builder.mutation({
            query: ({ id, ...workoutData }) => ({
                url: `${WORKOUTS_URL}/${id}`,
                method: 'PUT',
                body: workoutData,
            }),
        }),
        deleteWorkout: builder.mutation({
            query: (id) => ({
                url: `${WORKOUTS_URL}/${id}`,
                method: 'DELETE',
            }),
        }),
        getWorkoutStats: builder.query({
            query: () => ({
                url: `${WORKOUTS_URL}/stats`,
                method: 'GET',
            }),
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
