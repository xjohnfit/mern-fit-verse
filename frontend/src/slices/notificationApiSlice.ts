import { apiSlice } from '@/slices/apiSlice';

const BASE_URL =
    import.meta.env.MODE === 'development'
        ? 'http://localhost:5004/api'
        : '/api';

export interface Notification {
    _id: string;
    from: {
        _id: string;
        username: string;
        photo?: string;
    };
    to: string;
    type: 'like' | 'unlike' | 'comment' | 'follow' | 'message' | 'other';
    isRead: boolean;
    createdAt: string;
    updatedAt: string;
}

export const notificationApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Get notifications
        getNotifications: builder.query<Notification[], void>({
            query: () => ({
                url: `${BASE_URL}/notifications`,
                method: 'GET',
                credentials: 'include',
            }),
            providesTags: ['Notification'],
        }),

        // Delete notifications
        deleteNotifications: builder.mutation<{ message: string }, void>({
            query: () => ({
                url: `${BASE_URL}/notifications`,
                method: 'DELETE',
                credentials: 'include',
            }),
            invalidatesTags: ['Notification'],
        }),
    }),
});

export const { useGetNotificationsQuery, useDeleteNotificationsMutation } =
    notificationApiSlice;
