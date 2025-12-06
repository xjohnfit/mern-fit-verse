import { apiSlice } from './apiSlice';

const NOTIFICATIONS_URL = '/notifications';

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
                url: `${NOTIFICATIONS_URL}`,
                method: 'GET',
            }),
            providesTags: ['Notification'],
        }),

        // Delete notifications
        deleteNotifications: builder.mutation<{ message: string }, void>({
            query: () => ({
                url: `${NOTIFICATIONS_URL}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Notification'],
        }),

        // Update push token
        updatePushToken: builder.mutation({
            query: (pushToken) => ({
                url: '/users/push-token',
                method: 'POST',
                body: { pushToken },
            }),
        }),
    }),
});

export const { useGetNotificationsQuery, useDeleteNotificationsMutation, useUpdatePushTokenMutation } =
    notificationApiSlice;
