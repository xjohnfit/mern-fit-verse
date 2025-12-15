import { apiSlice } from '@/slices/apiSlice';

interface GetAllReportsParams {
    page?: number;
    limit?: number;
    status?: string;
    reason?: string;
}

export const reportsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Get all reports (Admin only)
        getAllReports: builder.query({
            query: ({
                page = 1,
                limit = 10,
                status,
                reason,
            }: GetAllReportsParams = {}) => {
                const params = new URLSearchParams();
                params.append('page', page.toString());
                params.append('limit', limit.toString());
                if (status) params.append('status', status);
                if (reason) params.append('reason', reason);

                return {
                    url: `/reports?${params.toString()}`,
                    method: 'GET',
                };
            },
            providesTags: ['Report'],
        }),

        // Get single report by ID (Admin only)
        getReportById: builder.query({
            query: (reportId) => ({
                url: `/reports/${reportId}`,
                method: 'GET',
            }),
            providesTags: (_result, _error, reportId) => [
                { type: 'Report', id: reportId },
            ],
        }),

        // Update report status (Admin only)
        updateReportStatus: builder.mutation({
            query: ({ reportId, status, actionTaken, adminNotes }) => ({
                url: `/reports/${reportId}`,
                method: 'PUT',
                body: { status, actionTaken, adminNotes },
            }),
            invalidatesTags: (_result, _error, { reportId }) => [
                { type: 'Report', id: reportId },
                'Report',
            ],
        }),

        // Delete report (Admin only)
        deleteReport: builder.mutation({
            query: (reportId) => ({
                url: `/reports/${reportId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Report'],
        }),

        // Report a user (Any authenticated user)
        reportUser: builder.mutation({
            query: (data) => ({
                url: '/reports',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Report'],
        }),

        // Get my reports
        getMyReports: builder.query({
            query: () => ({
                url: '/reports/my-reports',
                method: 'GET',
            }),
            providesTags: ['Report'],
        }),
    }),
});

export const {
    useGetAllReportsQuery,
    useGetReportByIdQuery,
    useUpdateReportStatusMutation,
    useDeleteReportMutation,
    useReportUserMutation,
    useGetMyReportsQuery,
} = reportsApiSlice;
