import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: '',
        prepareHeaders: (headers, _api) => {
            // Don't set Content-Type for FormData - let browser set it automatically
            // This is important for file uploads with multipart/form-data
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
    ],
    endpoints: (_builder) => ({}),
});

export default apiSlice;
