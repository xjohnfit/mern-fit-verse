import { apiSlice } from '@/slices/apiSlice';

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (data) => ({
                url: '/auth/login',
                method: 'POST',
                body: data,
            }),
        }),
        register: builder.mutation({
            query: (data) => ({
                url: '/auth/register',
                method: 'POST',
                body: data,
            }),
        }),
        logout: builder.mutation<void, void>({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
        }),
        deleteUser: builder.mutation<void, void>({
            query: () => ({
                url: '/auth/delete',
                method: 'DELETE',
            }),
            invalidatesTags: ['User'],
        }),
        getUserProfile: builder.query({
            query: () => ({
                url: '/users/profile',
                method: 'GET',
            }),
            providesTags: ['User'],
        }),
        updateUserProfile: builder.mutation({
            query: (data) => ({
                url: '/users/profile',
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['User'],
        }),
        viewUserProfile: builder.query({
            query: (username) => ({
                url: `/users/profile/view/${username}`,
                method: 'GET',
            }),
        }),
        followUnfollowUser: builder.mutation({
            query: (username) => ({
                url: `/users/profile/follow/${username}`,
                method: 'POST',
            }),
            invalidatesTags: ['User'],
        }),
        getSuggestedUsers: builder.query({
            query: () => ({
                url: '/users/profile/view/suggested',
                method: 'GET',
            }),
            providesTags: ['User'],
        }),
        updateNutritionGoals: builder.mutation({
            query: (data) => ({
                url: '/users/nutrition-goals',
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['User'],
        }),
        // Admin endpoints
        getAllUsers: builder.query({
            query: () => ({
                url: '/users/admin/users',
                method: 'GET',
            }),
            providesTags: ['User'],
        }),
        updateUserRole: builder.mutation({
            query: ({ userId, admin }) => ({
                url: `/users/admin/users/${userId}/role`,
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
    useDeleteUserMutation,
    useUpdateUserProfileMutation,
    useViewUserProfileQuery,
    useFollowUnfollowUserMutation,
    useGetSuggestedUsersQuery,
    useUpdateNutritionGoalsMutation,
    useGetAllUsersQuery,
    useUpdateUserRoleMutation,
} = usersApiSlice;
