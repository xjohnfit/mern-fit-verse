import { apiSlice } from './apiSlice';

export interface Message {
    _id: string;
    senderId: string;
    receiverId: string;
    text: string;
    image?: string;
    createdAt: string;
    updatedAt?: string;
}

export interface SendMessageRequest {
    senderId: string;
    receiverId: string;
    text: string;
    image?: string;
}

export interface GetMessagesResponse {
    messages: Message[];
    hasMore: boolean;
}

const MESSAGE_URL = '/messages';

export const messageApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getMessages: builder.query<
            GetMessagesResponse,
            {
                senderId: string;
                receiverId: string;
                limit?: number;
                before?: string;
            }
        >({
            query: ({ senderId, receiverId, limit = 50, before }) => {
                const params = new URLSearchParams();
                params.append('limit', limit.toString());
                if (before) {
                    params.append('before', before);
                }
                return {
                    url: `${MESSAGE_URL}/${senderId}/${receiverId}?${params.toString()}`,
                    method: 'GET',
                };
            },
            transformResponse: (response: any) => {
                // Ensure the response has the correct structure
                if (response && typeof response === 'object') {
                    // If response is already in correct format
                    if (response.messages && Array.isArray(response.messages)) {
                        return response as GetMessagesResponse;
                    }
                    // If response is just an array (old format)
                    if (Array.isArray(response)) {
                        return {
                            messages: response,
                            hasMore: false,
                        };
                    }
                }
                return { messages: [], hasMore: false };
            },
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

export const {
    useGetMessagesQuery,
    useSendMessageMutation,
    useLazyGetMessagesQuery,
} = messageApiSlice;
