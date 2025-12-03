import { apiSlice } from '@/slices/apiSlice';

const BASE_URL =
    import.meta.env.VITE_MODE === 'development'
        ? 'http://localhost:5004/api'
        : 'https://api.fitverse.codewithxjohn.com/api';

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (data) => ({
                url: `${BASE_URL}/auth/login`,
                method: 'POST',
                body: data,
            }),
        }),
        register: builder.mutation({
            query: (data) => ({
                url: `${BASE_URL}/auth/register`,
                method: 'POST',
                body: data,
            }),
        }),
        logout: builder.mutation<void, void>({
            query: () => ({
                url: `${BASE_URL}/auth/logout`,
                method: 'POST',
            }),
        }),
        getUserProfile: builder.query({
            query: () => ({
                url: `${BASE_URL}/users/profile`,
                method: 'GET',
            }),
            providesTags: ['User'],
        }),
        updateUserProfile: builder.mutation({
            query: (data) => ({
                url: `${BASE_URL}/users/profile`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['User'],
        }),
        viewUserProfile: builder.query({
            query: (username) => ({
                url: `${BASE_URL}/users/profile/view/${username}`,
                method: 'GET',
            }),
        }),
        followUnfollowUser: builder.mutation({
            query: (username) => ({
                url: `${BASE_URL}/users/profile/follow/${username}`,
                method: 'POST',
            }),
            invalidatesTags: ['User'],
        }),
        getSuggestedUsers: builder.query({
            query: () => ({
                url: `${BASE_URL}/users/profile/view/suggested`,
                method: 'GET',
            }),
            providesTags: ['User'],
        }),
        updateNutritionGoals: builder.mutation({
            query: (data) => ({
                url: `${BASE_URL}/users/nutrition-goals`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['User'],
        }),
        // Admin endpoints
        getAllUsers: builder.query({
            query: () => ({
                url: `${BASE_URL}/users/admin/users`,
                method: 'GET',
            }),
            providesTags: ['User'],
        }),
        updateUserRole: builder.mutation({
            query: ({ userId, admin }) => ({
                url: `${BASE_URL}/users/admin/users/${userId}/role`,
                method: 'PUT',
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
