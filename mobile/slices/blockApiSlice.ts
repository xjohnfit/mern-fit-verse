import { apiSlice } from './apiSlice';

interface BlockUserResponse {
    message: string;
    blockedUserId: string;
}

interface UnblockUserResponse {
    message: string;
    unblockedUserId: string;
}

interface BlockedUser {
    _id: string;
    name: string;
    username: string;
    photo?: string;
}

interface BlockedUsersResponse {
    blockedUsers: BlockedUser[];
}

interface BlockStatusResponse {
    isBlocked: boolean;
    blockedByThem: boolean;
    canInteract: boolean;
}

export const blockApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        blockUser: builder.mutation<BlockUserResponse, string>({
            query: (userId) => ({
                url: `/users/block/${userId}`,
                method: 'POST',
            }),
            invalidatesTags: ['User', 'Block'],
        }),
        unblockUser: builder.mutation<UnblockUserResponse, string>({
            query: (userId) => ({
                url: `/users/block/${userId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['User', 'Block'],
        }),
        getBlockedUsers: builder.query<BlockedUsersResponse, void>({
            query: () => '/users/blocked',
            providesTags: ['Block'],
        }),
        checkIfBlocked: builder.query<BlockStatusResponse, string>({
            query: (userId) => `/users/block-status/${userId}`,
            providesTags: ['Block'],
        }),
    }),
});

export const {
    useBlockUserMutation,
    useUnblockUserMutation,
    useGetBlockedUsersQuery,
    useCheckIfBlockedQuery,
} = blockApiSlice;
