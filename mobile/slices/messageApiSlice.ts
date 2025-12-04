import { apiSlice } from './apiSlice';

export interface Message {
    _id: string;
    senderId: string;
    receiverId: string;
    text: string;
    image?: string;
    createdAt: string;
    updatedAt: string;
}

export interface SendMessageRequest {
    senderId: string;
    receiverId: string;
    text: string;
    image?: string;
}

const MESSAGE_URL = '/messages';

export const messageApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getMessages: builder.query<
            Message[],
            { senderId: string; receiverId: string }
        >({
            query: ({ senderId, receiverId }) => ({
                url: `${MESSAGE_URL}/${senderId}/${receiverId}`,
                method: 'GET',
            }),
            providesTags: ['Message'],
        }),
        sendMessage: builder.mutation<Message, SendMessageRequest>({
            query: (data) => ({
                url: `${MESSAGE_URL}/send`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Message'],
        }),
    }),
});

export const { useGetMessagesQuery, useSendMessageMutation } = messageApiSlice;
