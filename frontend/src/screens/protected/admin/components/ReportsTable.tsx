import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { ReportsTableProps, ReportStatus } from '../admin.types';

const ReportsTable = ({ reports, onViewDetails, onDelete, isLoading }: ReportsTableProps) => {
    if (isLoading) {
        return <div className="text-center py-8 text-muted-foreground">Loading reports...</div>;
    }

    if (reports.length === 0) {
        return <div className="text-center py-8 text-muted-foreground">No reports found</div>;
    }

    const getStatusColor = (status: ReportStatus) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
            case 'reviewed':
                return 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 border-blue-200 dark:border-blue-800';
            case 'resolved':
                return 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 border-green-200 dark:border-green-800';
            case 'dismissed':
                return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700';
            default:
                return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700';
        }
    };

    const getReasonLabel = (reason: string) => {
        return reason.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <>
            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {reports.map((report) => (
                    <div
                        key={report._id}
                        className="bg-card border border-border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="space-y-3">
                            {/* Header with Status */}
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-foreground text-base">
                                        {getReasonLabel(report.reason)}
                                    </h3>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {formatDate(report.createdAt)}
                                    </p>
                                </div>
                                <Badge className={`shrink-0 border ${getStatusColor(report.status)}`}>
                                    {report.status.toUpperCase()}
                                </Badge>
                            </div>

                            {/* Reporter and Reported User */}
                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border text-sm">
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                                        Reporter
                                    </p>
                                    <p className="font-medium text-foreground truncate">
                                        {report.reporter.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate">
                                        @{report.reporter.username}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                                        Reported User
                                    </p>
                                    <p className="font-medium text-foreground truncate">
                                        {report.reportedUser.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate">
                                        @{report.reportedUser.username}
                                    </p>
                                </div>
                            </div>

                            {/* Action Taken */}
                            {report.actionTaken && (
                                <div className="pt-2 border-t border-border">
                                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                                        Action Taken
                                    </p>
                                    <p className="text-sm text-foreground">
                                        {getReasonLabel(report.actionTaken)}
                                    </p>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-2 pt-2">
                                <Button
                                    size="sm"
                                    variant="default"
                                    onClick={() => onViewDetails(report)}
                                    className="flex-1"
                                >
                                    View Details
                                </Button>
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => onDelete(report._id)}
                                    className="flex-1"
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b border-border bg-muted/50">
                            <th className="text-left p-3 font-semibold text-foreground">Reason</th>
                            <th className="text-left p-3 font-semibold text-foreground">Reporter</th>
                            <th className="text-left p-3 font-semibold text-foreground">Reported User</th>
                            <th className="text-left p-3 font-semibold text-foreground">Status</th>
                            <th className="text-left p-3 font-semibold text-foreground">Action Taken</th>
                            <th className="text-left p-3 font-semibold text-foreground">Date</th>
                            <th className="text-left p-3 font-semibold text-foreground">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.map((report) => (
                            <tr key={report._id} className="border-b border-border hover:bg-muted/50 transition-colors">
                                <td className="p-3 text-foreground font-medium">
                                    {getReasonLabel(report.reason)}
                                </td>
                                <td className="p-3">
                                    <div>
                                        <p className="text-foreground font-medium">{report.reporter.name}</p>
                                        <p className="text-xs text-muted-foreground">@{report.reporter.username}</p>
                                    </div>
                                </td>
                                <td className="p-3">
                                    <div>
                                        <p className="text-foreground font-medium">{report.reportedUser.name}</p>
                                        <p className="text-xs text-muted-foreground">@{report.reportedUser.username}</p>
                                    </div>
                                </td>
                                <td className="p-3">
                                    <Badge className={`border ${getStatusColor(report.status)}`}>
                                        {report.status.toUpperCase()}
                                    </Badge>
                                </td>
                                <td className="p-3 text-muted-foreground">
                                    {report.actionTaken ? getReasonLabel(report.actionTaken) : '-'}
                                </td>
                                <td className="p-3 text-muted-foreground text-sm">
                                    {formatDate(report.createdAt)}
                                </td>
                                <td className="p-3">
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="default"
                                            onClick={() => onViewDetails(report)}
                                        >
                                            View
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => onDelete(report._id)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default ReportsTable;
