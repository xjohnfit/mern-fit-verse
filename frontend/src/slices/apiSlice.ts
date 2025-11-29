import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: '',
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
    ],
    endpoints: (_builder) => ({}),
});

export default apiSlice;
