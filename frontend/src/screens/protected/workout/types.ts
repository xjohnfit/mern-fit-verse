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
    restTime: number;
    notes?: string;
}

// Workout Set type (used during active workout)
export interface WorkoutSet {
    id: string;
    setNumber: number;
    reps: number;
    weight: number;
    completed: boolean;
    restTimeRemaining: number;
    duration?: number; // in seconds for time-based exercises
    distance?: number; // for cardio exercises
    notes?: string;
}

// Workout Exercise type (extends Exercise with sets)
export interface WorkoutExercise extends Exercise {
    sets: WorkoutSet[];
    restTime?: number; // in seconds
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
