import { apiSlice } from './apiSlice';

const BASE_URL = import.meta.env.MODE === 'development' ? 'http://localhost:5003/api' : '/api';

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}/users/auth`,
        method: 'POST',
        credentials: 'include', // Include cookies in the request
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}/users/register`,
        method: 'POST',
        credentials: 'include', // Include cookies in the request
        body: data,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: `${BASE_URL}/users/logout`,
        method: 'POST',
        credentials: 'include', // Include cookies in the request
      }),
    }),
    updateUserProfile: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}/users/profile`,
        method: 'PUT',
        credentials: 'include', // Include cookies in the request
        body: data,
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useLogoutMutation, useUpdateUserProfileMutation } = usersApiSlice;