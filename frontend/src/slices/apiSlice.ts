import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl:
            import.meta.env.VITE_MODE === 'development'
                ?  `${import.meta.env.VITE_BACKEND_URL}/api`
                : 'https://api.fitverse.codewithxjohn.com/api',
        credentials: 'include', // Add this globally to all requests
        prepareHeaders: (headers, _api) => {
            return headers;
        },
    }),
    tagTypes: [
        'User',
        'Posts',
        'Workout',
        'Exercise',
        'Nutrition',
        'CustomCategory',
        'WorkoutTemplate',
        'WorkoutTemplateFolder',
        'Notification',
        'Message',
        'Food',
        'FoodSuggestions',
        'Report',
        'Block',
        'Support',
    ],
    endpoints: (_builder) => ({}),
});

export default apiSlice;
