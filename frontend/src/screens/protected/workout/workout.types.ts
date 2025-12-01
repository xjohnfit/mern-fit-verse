// Workout Types

// Basic Exercise type (used in multiple components)
export interface Exercise {
    id: string;
    name: string;
    description?: string;
    category: string;
    muscleGroup?: string[];
    equipment?: string;
    instructions?: string;
    image?: string;
    imageUrl?: string;
}

// Template Set type (used in template creation/editing)
export interface TemplateSet {
    setNumber: number;
    targetReps: number;
    targetWeight: number;
    notes?: string;
}

// Template Exercise type (used in template creation/editing)
export interface TemplateExercise {
    exerciseId: string;
    exerciseName: string;
    sets: TemplateSet[];
    notes?: string;
}

// Workout Set type (used during active workout)
export interface WorkoutSet {
    id: string;
    setNumber: number;
    reps: number;
    weight: number;
    completed: boolean;
    restTimeRemaining?: number; // Optional, for active rest timer
    duration?: number; // in seconds for time-based exercises
    distance?: number; // for cardio exercises
    notes?: string;
}

// Workout Exercise type (extends Exercise with sets)
export interface WorkoutExercise extends Exercise {
    sets: WorkoutSet[];
    notes?: string;
}

export interface WorkoutTemplate {
    _id: string;
    name: string;
    description?: string;
    exercises: WorkoutExercise[];
    userId: string;
    isPublic: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ActiveWorkout {
    id: string;
    templateId?: string;
    templateName?: string;
    exercises: WorkoutExercise[];
    startTime: string;
    endTime?: string;
    isFreestyle: boolean;
    notes?: string;
}

export interface WorkoutHistory {
    _id: string;
    userId: string;
    workoutName: string;
    exercises: WorkoutExercise[];
    startTime: string;
    endTime: string;
    duration: number; // in seconds
    totalVolume: number; // total weight lifted
    notes?: string;
    createdAt: string;
}

export interface WorkoutStats {
    totalWorkouts: number;
    totalVolume: number;
    totalDuration: number;
    workoutsThisWeek: number;
    workoutsThisMonth: number;
    favoriteExercises: string[];
}

// Form types
export interface CreateTemplateForm {
    name: string;
    description: string;
    exercises: WorkoutExercise[];
    isPublic: boolean;
}

export interface AddExerciseForm {
    exerciseId: string;
    sets: number;
    reps: number;
    weight?: number;
    restTime: number;
}

// Folder types
export interface Folder {
    _id: string;
    name: string;
    color: string;
}

// Color preset type
export interface ColorPreset {
    name: string;
    value: string;
}

// Component Props Types
export interface CreateFolderDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export interface TemplateDetailsFormProps {
    name: string;
    description: string;
    folderId: string;
    folders: Folder[];
    onNameChange: (name: string) => void;
    onDescriptionChange: (description: string) => void;
    onFolderChange: (folderId: string) => void;
}

export interface EditFolderDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    folder: Folder | null;
}

export interface EmptyExercisesStateProps {
    onAddClick: () => void;
}

export interface EmptyTemplatesStateProps {
    onCreateFolder: () => void;
    onCreateTemplate: () => void;
}

export interface ExerciseSearchDialogProps {
    isOpen: boolean;
    onClose: () => void;
    exercises: Exercise[];
    isLoading: boolean;
    searchTerm: string;
    onSearchChange: (term: string) => void;
    onAddExercise: (exercise: Exercise) => void;
}

export interface ExerciseSetRowProps {
    setNumber: number;
    targetReps: number;
    targetWeight: number;
    canRemove: boolean;
    onChange: (field: 'targetReps' | 'targetWeight', value: number) => void;
    onRemove: () => void;
}

export interface FolderSelectorProps {
    folders: Folder[];
    selectedFolderId: string;
    onSelectFolder: (folderId: string) => void;
}

export interface LoadingStateProps {
    message?: string;
}

export interface PageHeaderProps {
    icon: any; // LucideIcon type
    title: string;
    description: string;
    iconGradient?: string;
}

export interface TemplateExerciseCardProps {
    exercise: TemplateExercise;
    index: number;
    onRemove: () => void;
    onAddSet: () => void;
    onRemoveSet: (setNumber: number) => void;
    onUpdateSet: (
        setNumber: number,
        field: 'targetReps' | 'targetWeight',
        value: number
    ) => void;
}

export interface TemplateFormActionsProps {
    onCancel: () => void;
    onSave: () => void;
    isSaving: boolean;
    canSave: boolean;
    saveButtonText?: string;
}

export interface WorkoutActionCardProps {
    title: string;
    description: string;
    icon: any; // LucideIcon type
    iconGradient?: string;
    benefits: string[];
    benefitColor?: string;
    buttonText: string;
    buttonGradient?: string;
    hoverBorderColor?: string;
    onClick: () => void;
}
