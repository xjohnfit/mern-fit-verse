// User related types
export interface User {
    _id: string;
    name: string;
    username: string;
    email: string;
    admin: boolean;
    createdAt: string;
    photo?: string;
}

// Exercise related types
export interface Exercise {
    id: string;
    name: string;
    description: string;
    instructions: string;
    image: string;
    category: string;
}

export interface ExerciseForm {
    name: string;
    description: string;
    instructions: string;
    image: string;
    category: string;
}

// Component Props types
export interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    className?: string;
}

export interface UserTableProps {
    users: User[];
    currentUserId: string;
    onRoleUpdate: (userId: string, currentAdmin: boolean) => void;
    isLoading: boolean;
}

export interface ExerciseTableProps {
    exercises: Exercise[];
    onEdit: (exercise: Exercise) => void;
    onDelete: (exerciseId: string) => void;
    isLoading: boolean;
}

export interface ExerciseFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    form: ExerciseForm;
    onFormChange: (form: ExerciseForm) => void;
    isEditing: boolean;
}

export interface UserManagementTabProps {
    currentUserId: string;
    isAdmin: boolean;
}

// Report related types
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

export interface ReportsListResponse {
    reports: Report[];
    currentPage: number;
    totalPages: number;
    totalReports: number;
}

export interface ReportDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    report: Report | null;
    onUpdate: (
        reportId: string,
        status: ReportStatus,
        actionTaken?: ReportAction,
        adminNotes?: string
    ) => void;
    isUpdating: boolean;
}

export interface ReportsTableProps {
    reports: Report[];
    onViewDetails: (report: Report) => void;
    onDelete: (reportId: string) => void;
    isLoading: boolean;
}

// Redux state types
export interface RootState {
    auth: {
        userInfo: User | null;
        isAuthenticated: boolean;
    };
}
