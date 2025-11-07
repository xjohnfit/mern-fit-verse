import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: '' }),
    tagTypes: ['User', 'Workout', 'Exercise'],
    endpoints: (builder) => ({}),
});

export default apiSlice;
