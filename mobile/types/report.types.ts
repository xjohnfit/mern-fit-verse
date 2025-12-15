export type ReportReason =
    | 'harassment'
    | 'hate_speech'
    | 'spam'
    | 'inappropriate_content'
    | 'violence'
    | 'other';

export type ReportStatus = 'pending' | 'reviewed' | 'resolved' | 'dismissed';

export type ReportAction =
    | 'warning'
    | 'suspend'
    | 'ban'
    | 'content_removed'
    | 'no_action';

export interface Report {
    _id: string;
    reporter: {
        _id: string;
        name: string;
        username: string;
        photo?: string;
    };
    reportedUser: {
        _id: string;
        name: string;
        username: string;
        photo?: string;
        email?: string;
    };
    reportedPost?: string;
    reason: ReportReason;
    description?: string;
    status: ReportStatus;
    actionTaken?: ReportAction;
    reviewedBy?: {
        _id: string;
        name: string;
        username: string;
    };
    reviewedAt?: Date;
    adminNotes?: string;
    createdAt: Date;
}

export interface ReportUserRequest {
    reportedUserId: string;
    reportedPostId?: string;
    reason: ReportReason;
    description?: string;
}

export interface ReportResponse {
    message: string;
    report?: Report;
}

export interface ReportsListResponse {
    reports: Report[];
    currentPage: number;
    totalPages: number;
    totalReports: number;
}
