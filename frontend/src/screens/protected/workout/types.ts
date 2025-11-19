// Workout Types

export interface Exercise {
    id: string;
    name: string;
    category: string;
    muscleGroup: string[];
    equipment: string;
    instructions?: string;
    imageUrl?: string;
}

export interface WorkoutSet {
    id: string;
    setNumber: number;
    reps: number;
    weight?: number;
    duration?: number; // in seconds for time-based exercises
    distance?: number; // for cardio exercises
    completed: boolean;
    notes?: string;
}

export interface WorkoutExercise {
    id: string;
    exercise: Exercise;
    sets: WorkoutSet[];
    restTime: number; // in seconds
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
