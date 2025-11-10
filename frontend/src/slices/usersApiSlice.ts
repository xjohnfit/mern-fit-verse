import { apiSlice } from './apiSlice';

const BASE_URL = import.meta.env.MODE === 'development' ? 'http://localhost:5003/api' : '/api';

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}/auth/login`,
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
        url: `${BASE_URL}/auth/logout`,
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
    viewUserProfile: builder.query({
      query: (username) => ({
        url: `${BASE_URL}/users/profile/view/${username}`,
        method: 'GET',
        credentials: 'include', // Include cookies in the request
      }),
    }),
    followUnfollowUser: builder.mutation({
      query: (username) => ({
        url: `${BASE_URL}/users/profile/follow/${username}`,
        method: 'POST',
        credentials: 'include', // Include cookies in the request
      }),
    }),
  }),
});

export const { 
  useLoginMutation, 
  useRegisterMutation, 
  useLogoutMutation, 
  useUpdateUserProfileMutation,
  useViewUserProfileQuery,
  useFollowUnfollowUserMutation 
} = usersApiSlice;