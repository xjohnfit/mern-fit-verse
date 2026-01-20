import { apiSlice } from '@/slices/apiSlice';

export interface SupportTicket {
    _id: string;
    user: {
        _id: string;
        name: string;
        email: string;
        username: string;
        photo?: string;
    };
    subject: string;
    category: 'technical' | 'account' | 'billing' | 'feedback' | 'other';
    priority: 'low' | 'medium' | 'high';
    status: 'open' | 'in-progress' | 'resolved' | 'closed';
    description: string;
    messages: {
        _id: string;
        sender: {
            _id: string;
            name: string;
            email: string;
            username: string;
            photo?: string;
        };
        senderType: 'user' | 'admin';
        message: string;
        timestamp: string;
        attachments?: string[];
    }[];
    assignedTo?: {
        _id: string;
        name: string;
        email: string;
        username: string;
        photo?: string;
    };
    createdAt: string;
    updatedAt: string;
}

export interface CreateTicketData {
    subject: string;
    category: 'technical' | 'account' | 'billing' | 'feedback' | 'other';
    description: string;
    priority?: 'low' | 'medium' | 'high';
}

export interface AddMessageData {
    message: string;
}

export interface UpdateTicketData {
    status?: 'open' | 'in-progress' | 'resolved' | 'closed';
    priority?: 'low' | 'medium' | 'high';
}

export interface AssignTicketData {
    adminId?: string;
}

export interface SupportStats {
    totalTickets: number;
    openTickets: number;
    inProgressTickets: number;
    resolvedTickets: number;
    closedTickets: number;
    highPriorityTickets: number;
    categoryStats: {
        _id: string;
        count: number;
    }[];
}

export const supportApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Create new support ticket
        createSupportTicket: builder.mutation<SupportTicket, CreateTicketData>({
            query: (data) => ({
                url: '/support',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Support'],
        }),

        // Get all tickets for logged-in user
        getMyTickets: builder.query<
            SupportTicket[],
            { status?: string; category?: string } | undefined
        >({
            query: (params) => ({
                url: '/support/my-tickets',
                method: 'GET',
                params: params || undefined,
            }),
            providesTags: ['Support'],
        }),

        // Get single ticket by ID
        getTicketById: builder.query<SupportTicket, string>({
            query: (id) => ({
                url: `/support/${id}`,
                method: 'GET',
            }),
            providesTags: ['Support'],
        }),

        // Add message to ticket
        addMessageToTicket: builder.mutation<
            SupportTicket,
            { id: string; data: AddMessageData }
        >({
            query: ({ id, data }) => ({
                url: `/support/${id}/messages`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Support'],
        }),

        // Update ticket
        updateTicket: builder.mutation<
            SupportTicket,
            { id: string; data: UpdateTicketData }
        >({
            query: ({ id, data }) => ({
                url: `/support/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['Support'],
        }),

        // Delete ticket
        deleteTicket: builder.mutation<{ message: string }, string>({
            query: (id) => ({
                url: `/support/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Support'],
        }),

        // Admin: Get all tickets
        getAllTickets: builder.query<
            SupportTicket[],
            | { status?: string; category?: string; priority?: string }
            | undefined
        >({
            query: (params) => ({
                url: '/support/admin/all',
                method: 'GET',
                params: params || undefined,
            }),
            providesTags: ['Support'],
        }),

        // Admin: Assign ticket
        assignTicket: builder.mutation<
            SupportTicket,
            { id: string; data: AssignTicketData }
        >({
            query: ({ id, data }) => ({
                url: `/support/admin/${id}/assign`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['Support'],
        }),

        // Admin: Get support statistics
        getSupportStats: builder.query<SupportStats, void>({
            query: () => ({
                url: '/support/admin/stats',
                method: 'GET',
            }),
            providesTags: ['Support'],
        }),
    }),
});

export const {
    useCreateSupportTicketMutation,
    useGetMyTicketsQuery,
    useGetTicketByIdQuery,
    useAddMessageToTicketMutation,
    useUpdateTicketMutation,
    useDeleteTicketMutation,
    useGetAllTicketsQuery,
    useAssignTicketMutation,
    useGetSupportStatsQuery,
} = supportApiSlice;
