import { useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGetAllReportsQuery, useUpdateReportStatusMutation, useDeleteReportMutation } from '@/slices/reportsApiSlice';
import SearchInput from './SearchInput';
import ReportsTable from './ReportsTable';
import ReportDetailsModal from './ReportDetailsModal';
import type { Report, ReportStatus, ReportReason, ReportAction } from '../admin.types';

const ReportsManagementTab = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<ReportStatus | 'all'>('all');
    const [reasonFilter, setReasonFilter] = useState<ReportReason | 'all'>('all');
    const [page, setPage] = useState(1);
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    const { data: reportsData, isLoading: reportsLoading, refetch: refetchReports, error } = useGetAllReportsQuery({
        page,
        limit: 10,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        reason: reasonFilter !== 'all' ? reasonFilter : undefined,
    });

    console.log('Reports data:', reportsData);
    console.log('Reports loading:', reportsLoading);
    console.log('Reports error:', error);

    const [updateReportStatus, { isLoading: isUpdating }] = useUpdateReportStatusMutation();
    const [deleteReport] = useDeleteReportMutation();

    // Handle report update
    const handleReportUpdate = async (
        reportId: string,
        status: ReportStatus,
        actionTaken?: ReportAction,
        adminNotes?: string
    ) => {
        try {
            const result = await updateReportStatus({
                reportId,
                status,
                actionTaken,
                adminNotes,
            }).unwrap();
            toast.success(result.message || 'Report updated successfully');
            setShowDetailsModal(false);
            setSelectedReport(null);
            refetchReports();
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to update report');
        }
    };

    // Handle report deletion
    const handleReportDelete = async (reportId: string) => {
        if (!confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
            return;
        }

        try {
            const result = await deleteReport(reportId).unwrap();
            toast.success(result.message || 'Report deleted successfully');
            refetchReports();
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to delete report');
        }
    };

    // Handle view details
    const handleViewDetails = (report: Report) => {
        setSelectedReport(report);
        setShowDetailsModal(true);
    };

    // Handle close details modal
    const handleCloseDetailsModal = () => {
        setShowDetailsModal(false);
        setSelectedReport(null);
    };

    // Filter reports based on search
    const filteredReports = reportsData?.reports?.filter((report: Report) => {
        const searchLower = searchTerm.toLowerCase();
        return (
            report.reporter.name.toLowerCase().includes(searchLower) ||
            report.reporter.username.toLowerCase().includes(searchLower) ||
            report.reportedUser.name.toLowerCase().includes(searchLower) ||
            report.reportedUser.username.toLowerCase().includes(searchLower) ||
            report.reason.toLowerCase().includes(searchLower) ||
            (report.description && report.description.toLowerCase().includes(searchLower))
        );
    }) || [];

    // Get stats
    const totalReports = reportsData?.totalReports || 0;
    const pendingCount = reportsData?.reports?.filter((r: Report) => r.status === 'pending').length || 0;

    return (
        <>
            <div className="w-full space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Reports Management</CardTitle>
                        <CardDescription>
                            Review and manage user reports - {totalReports} total reports, {pendingCount} pending
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Filters Section */}
                        <div className="space-y-4 mb-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Search Input */}
                                <div className="md:col-span-1">
                                    <SearchInput
                                        value={searchTerm}
                                        onChange={setSearchTerm}
                                        placeholder="Search reports..."
                                    />
                                </div>

                                {/* Status Filter */}
                                <div>
                                    <select
                                        value={statusFilter}
                                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value as ReportStatus | 'all')}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    >
                                        <option value="all">All Statuses</option>
                                        <option value="pending">Pending</option>
                                        <option value="reviewed">Reviewed</option>
                                        <option value="resolved">Resolved</option>
                                        <option value="dismissed">Dismissed</option>
                                    </select>
                                </div>

                                {/* Reason Filter */}
                                <div>
                                    <select
                                        value={reasonFilter}
                                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setReasonFilter(e.target.value as ReportReason | 'all')}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    >
                                        <option value="all">All Reasons</option>
                                        <option value="harassment">Harassment</option>
                                        <option value="hate_speech">Hate Speech</option>
                                        <option value="spam">Spam</option>
                                        <option value="inappropriate_content">Inappropriate Content</option>
                                        <option value="violence">Violence</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>

                            {/* Clear Filters Button */}
                            {(statusFilter !== 'all' || reasonFilter !== 'all' || searchTerm) && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setStatusFilter('all');
                                        setReasonFilter('all');
                                        setSearchTerm('');
                                    }}
                                >
                                    Clear Filters
                                </Button>
                            )}
                        </div>

                        {/* Reports Table */}
                        <ReportsTable
                            reports={filteredReports}
                            onViewDetails={handleViewDetails}
                            onDelete={handleReportDelete}
                            isLoading={reportsLoading}
                        />

                        {/* Pagination */}
                        {reportsData && reportsData.totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-6">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                >
                                    Previous
                                </Button>
                                <span className="text-sm text-muted-foreground">
                                    Page {page} of {reportsData.totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage((p) => Math.min(reportsData.totalPages, p + 1))}
                                    disabled={page === reportsData.totalPages}
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Report Details Modal */}
            <ReportDetailsModal
                isOpen={showDetailsModal}
                onClose={handleCloseDetailsModal}
                report={selectedReport}
                onUpdate={handleReportUpdate}
                isUpdating={isUpdating}
            />
        </>
    );
};

export default ReportsManagementTab;
