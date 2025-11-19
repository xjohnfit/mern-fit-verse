import mongoose, { Schema, Document } from 'mongoose';

export interface IWorkoutSet {
    setNumber: number;
    weight: number;
    reps: number;
    completed: boolean;
}

export interface IWorkoutExercise {
    exerciseId: string;
    exerciseName: string;
    sets: IWorkoutSet[];
}

export interface IWorkout extends Document {
    userId: mongoose.Types.ObjectId;
    workoutType: 'freestyle' | 'template';
    templateId?: mongoose.Types.ObjectId;
    duration: number; // in seconds
    exercises: IWorkoutExercise[];
    completedAt: Date;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const workoutSetSchema = new Schema<IWorkoutSet>({
    setNumber: {
        type: Number,
        required: true,
    },
    weight: {
        type: Number,
        required: true,
        default: 0,
    },
    reps: {
        type: Number,
        required: true,
        default: 0,
    },
    completed: {
        type: Boolean,
        required: true,
        default: false,
    },
});

const workoutExerciseSchema = new Schema<IWorkoutExercise>({
    exerciseId: {
        type: String,
        required: true,
    },
    exerciseName: {
        type: String,
        required: true,
    },
    sets: [workoutSetSchema],
});

const workoutSchema = new Schema<IWorkout>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        workoutType: {
            type: String,
            enum: ['freestyle', 'template'],
            required: true,
            default: 'freestyle',
        },
        templateId: {
            type: Schema.Types.ObjectId,
            ref: 'Template',
        },
        duration: {
            type: Number,
            required: true,
        },
        exercises: [workoutExerciseSchema],
        completedAt: {
            type: Date,
            required: true,
            default: Date.now,
        },
        notes: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const Workout = mongoose.model<IWorkout>('Workout', workoutSchema);

export default Workout;
