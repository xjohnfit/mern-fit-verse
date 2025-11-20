import { apiSlice } from '@/slices/apiSlice';

const BASE_URL =
    import.meta.env.MODE === 'development'
        ? 'http://localhost:5003/api'
        : '/api';

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getUserProfile: builder.query({
            query: () => ({
                url: `${BASE_URL}/users/profile`,
                method: 'GET',
                credentials: 'include', // Include cookies in the request
            }),
            providesTags: ['User'],
        }),
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
                url: `${BASE_URL}/auth/register`,
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
                credentials: 'include',
                body: data,
            }),
            invalidatesTags: ['User'],
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
            invalidatesTags: ['User'],
        }),
        getSuggestedUsers: builder.query({
            query: () => ({
                url: `${BASE_URL}/users/profile/view/suggested`,
                method: 'GET',
                credentials: 'include', // Include cookies in the request
            }),
            providesTags: ['User'],
        }),
        updateNutritionGoals: builder.mutation({
            query: (data) => ({
                url: `${BASE_URL}/users/nutrition-goals`,
                method: 'PUT',
                credentials: 'include',
                body: data,
            }),
            invalidatesTags: ['User'],
        }),
        // Admin endpoints
        getAllUsers: builder.query({
            query: () => ({
                url: `${BASE_URL}/users/admin/users`,
                method: 'GET',
                credentials: 'include',
            }),
            providesTags: ['User'],
        }),
        updateUserRole: builder.mutation({
            query: ({ userId, admin }) => ({
                url: `${BASE_URL}/users/admin/users/${userId}/role`,
                method: 'PUT',
                credentials: 'include',
                body: { admin },
            }),
            invalidatesTags: ['User'],
        }),
    }),
});

export const {
    useGetUserProfileQuery,
    useLoginMutation,
    useRegisterMutation,
    useLogoutMutation,
    useUpdateUserProfileMutation,
    useViewUserProfileQuery,
    useFollowUnfollowUserMutation,
    useGetSuggestedUsersQuery,
    useUpdateNutritionGoalsMutation,
    useGetAllUsersQuery,
    useUpdateUserRoleMutation,
} = usersApiSlice;
