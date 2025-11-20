import mongoose, { Schema, model } from 'mongoose';

export interface IWorkoutTemplateSet {
    setNumber: number;
    targetReps: number;
    targetWeight?: number;
    notes?: string;
}

export interface IWorkoutTemplateExercise {
    exerciseId: string;
    exerciseName: string;
    sets: IWorkoutTemplateSet[];
    restTime: number; // in seconds
    notes?: string;
}

export interface IWorkoutTemplate {
    userId: mongoose.Types.ObjectId;
    name: string;
    description?: string;
    exercises: IWorkoutTemplateExercise[];
    folderId?: mongoose.Types.ObjectId;
    isPublic: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const workoutTemplateSetSchema = new Schema<IWorkoutTemplateSet>({
    setNumber: {
        type: Number,
        required: true,
    },
    targetReps: {
        type: Number,
        required: true,
        default: 0,
    },
    targetWeight: {
        type: Number,
        default: 0,
    },
    notes: {
        type: String,
    },
});

const workoutTemplateExerciseSchema = new Schema<IWorkoutTemplateExercise>({
    exerciseId: {
        type: String,
        required: true,
    },
    exerciseName: {
        type: String,
        required: true,
    },
    sets: [workoutTemplateSetSchema],
    restTime: {
        type: Number,
        default: 60, // default 60 seconds rest
    },
    notes: {
        type: String,
    },
});

const workoutTemplateSchema = new Schema<IWorkoutTemplate>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        name: {
            type: String,
            required: true,
            maxlength: 100,
        },
        description: {
            type: String,
            maxlength: 500,
        },
        exercises: [workoutTemplateExerciseSchema],
        folderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'WorkoutTemplateFolder',
        },
        isPublic: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for efficient querying
workoutTemplateSchema.index({ userId: 1 });
workoutTemplateSchema.index({ folderId: 1 });

const WorkoutTemplate = model<IWorkoutTemplate>(
    'WorkoutTemplate',
    workoutTemplateSchema
);

export default WorkoutTemplate;
