// Workout Types for Mobile

import {
    WorkoutTemplate,
    WorkoutTemplateExercise,
} from '@/slices/workoutTemplateApiSlice';
import { WorkoutTemplateFolder } from '@/slices/workoutTemplateFolderApiSlice';

// Exercise types
export interface Exercise {
    id: string;
    name: string;
    description: string;
    instructions: string[];
    image?: string;
    category: string;
}

// Workout set
export interface WorkoutSet {
    id: string;
    setNumber: number;
    completed: boolean;
    weight?: number;
    reps?: number;
    restTimeRemaining?: number;
}

// Workout exercise
export interface WorkoutExercise extends Exercise {
    sets: WorkoutSet[];
}

// Template exercise for creating/editing
export interface TemplateExercise {
    exerciseId: string;
    exerciseName: string;
    sets: {
        setNumber: number;
        targetReps: number;
        targetWeight?: number;
        notes?: string;
    }[];
    notes?: string;
}

// Color preset
export interface ColorPreset {
    name: string;
    value: string;
}

// Component Props
export interface CreateFolderDialogProps {
    visible: boolean;
    onClose: () => void;
}

export interface EditFolderDialogProps {
    visible: boolean;
    onClose: () => void;
    folder: WorkoutTemplateFolder | null;
}

export interface FolderCardProps {
    folder: WorkoutTemplateFolder;
    templates: WorkoutTemplate[];
    onEditFolder: (folder: WorkoutTemplateFolder) => void;
}

export interface TemplateCardProps {
    template: WorkoutTemplate;
}

// Export types from slices
export type { WorkoutTemplate, WorkoutTemplateExercise, WorkoutTemplateFolder };
