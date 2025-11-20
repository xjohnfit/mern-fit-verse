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

// Redux state types
export interface RootState {
    auth: {
        userInfo: User | null;
        isAuthenticated: boolean;
    };
}
