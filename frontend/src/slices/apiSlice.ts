import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: '' }),
    tagTypes: ['User', 'Posts', 'Workout', 'Exercise'],
    endpoints: (_builder) => ({}),
});

export default apiSlice;
