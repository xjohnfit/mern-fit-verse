import { apiSlice } from './apiSlice';

const REPORTS_URL = '/reports';

export const reportsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        reportUser: builder.mutation({
            query: (data) => ({
                url: REPORTS_URL,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Report'],
        }),
        getMyReports: builder.query({
            query: () => ({
                url: `${REPORTS_URL}/my-reports`,
            }),
            providesTags: ['Report'],
        }),
        getAllReports: builder.query({
            query: ({ status, page = 1, limit = 20 }) => ({
                url: REPORTS_URL,
                params: { status, page, limit },
            }),
            providesTags: ['Report'],
        }),
        getReportById: builder.query({
            query: (reportId) => ({
                url: `${REPORTS_URL}/${reportId}`,
            }),
            providesTags: ['Report'],
        }),
        updateReportStatus: builder.mutation({
            query: ({ reportId, ...data }) => ({
                url: `${REPORTS_URL}/${reportId}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Report'],
        }),
        deleteReport: builder.mutation({
            query: (reportId) => ({
                url: `${REPORTS_URL}/${reportId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Report'],
        }),
    }),
});

export const {
    useReportUserMutation,
    useGetMyReportsQuery,
    useGetAllReportsQuery,
    useGetReportByIdQuery,
    useUpdateReportStatusMutation,
    useDeleteReportMutation,
} = reportsApiSlice;
