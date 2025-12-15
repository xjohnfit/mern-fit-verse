import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { ReportDetailsModalProps, ReportStatus, ReportAction } from '../admin.types';

const ReportDetailsModal = ({ isOpen, onClose, report, onUpdate, isUpdating }: ReportDetailsModalProps) => {
    const [status, setStatus] = useState<ReportStatus>('pending');
    const [actionTaken, setActionTaken] = useState<ReportAction | ''>('');
    const [adminNotes, setAdminNotes] = useState('');

    useEffect(() => {
        if (report) {
            setStatus(report.status);
            setActionTaken(report.actionTaken || '');
            setAdminNotes(report.adminNotes || '');
        }
    }, [report]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (report) {
            onUpdate(
                report._id,
                status,
                actionTaken !== '' ? actionTaken : undefined,
                adminNotes || undefined
            );
        }
    };

    const getStatusColor = (status: ReportStatus) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-500';
            case 'reviewed':
                return 'bg-blue-500';
            case 'resolved':
                return 'bg-green-500';
            case 'dismissed':
                return 'bg-gray-500';
            default:
                return 'bg-gray-500';
        }
    };

    const getReasonLabel = (reason: string) => {
        return reason.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    if (!report) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-6">
                <DialogHeader>
                    <DialogTitle>Report Details</DialogTitle>
                    <DialogDescription>
                        Review and take action on this report
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Report Info */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">Report ID</label>
                                <p className="text-sm font-mono">{report._id}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">Status</label>
                                <div>
                                    <Badge className={getStatusColor(report.status)}>
                                        {report.status.toUpperCase()}
                                    </Badge>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">Reason</label>
                                <p className="text-sm">{getReasonLabel(report.reason)}</p>
                            </div>
                        </div>

                        {report.description && (
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground">Description</label>
                                <p className="text-sm bg-muted p-3 rounded-md">{report.description}</p>
                            </div>
                        )}

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">Reporter</label>
                                <p className="text-sm font-medium">{report.reporter.name}</p>
                                <p className="text-xs text-muted-foreground">@{report.reporter.username}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">Reported User</label>
                                <p className="text-sm font-medium">{report.reportedUser.name}</p>
                                <p className="text-xs text-muted-foreground">@{report.reportedUser.username}</p>
                                {report.reportedUser.email && (
                                    <p className="text-xs text-muted-foreground">{report.reportedUser.email}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">Submitted</label>
                                <p className="text-sm">{new Date(report.createdAt).toLocaleString()}</p>
                            </div>
                        </div>

                        {report.reviewedBy && report.reviewedAt && (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground">Reviewed By</label>
                                    <p className="text-sm">{report.reviewedBy.name} (@{report.reviewedBy.username})</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground">Reviewed At</label>
                                    <p className="text-sm">{new Date(report.reviewedAt).toLocaleString()}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action Section */}
                    <div className="border-t pt-4 space-y-4">
                        <h3 className="font-semibold text-base">Take Action</h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="status" className="block text-sm font-semibold text-foreground">Status</label>
                                <select
                                    id="status"
                                    value={status}
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatus(e.target.value as ReportStatus)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="reviewed">Reviewed</option>
                                    <option value="resolved">Resolved</option>
                                    <option value="dismissed">Dismissed</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="action" className="block text-sm font-semibold text-foreground">Action Taken</label>
                                <select
                                    id="action"
                                    value={actionTaken}
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setActionTaken(e.target.value as ReportAction | '')}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                    <option value="">None</option>
                                    <option value="no_action">No Action</option>
                                    <option value="warning">Warning</option>
                                    <option value="content_removed">Content Removed</option>
                                    <option value="suspend">Suspend Account</option>
                                    <option value="ban">Ban Account</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="adminNotes" className="block text-sm font-semibold text-foreground">Admin Notes</label>
                            <textarea
                                id="adminNotes"
                                value={adminNotes}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAdminNotes(e.target.value)}
                                placeholder="Add notes about your decision..."
                                rows={3}
                                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground resize-none"
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-2 border-t pt-4">
                        <Button type="button" variant="outline" onClick={onClose} disabled={isUpdating}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isUpdating}>
                            {isUpdating ? 'Updating...' : 'Update Report'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ReportDetailsModal;
