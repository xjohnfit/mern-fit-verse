import mongoose, { Schema, model } from 'mongoose';

export interface IWorkoutTemplateFolder {
    userId: mongoose.Types.ObjectId;
    name: string;
    color: string;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}

const workoutTemplateFolderSchema = new Schema<IWorkoutTemplateFolder>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        name: {
            type: String,
            required: true,
            maxlength: 50,
        },
        color: {
            type: String,
            required: true,
            default: '#6366f1', // indigo-500
        },
        order: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Index for efficient querying
workoutTemplateFolderSchema.index({ userId: 1, order: 1 });

const WorkoutTemplateFolder = model<IWorkoutTemplateFolder>(
    'WorkoutTemplateFolder',
    workoutTemplateFolderSchema
);

export default WorkoutTemplateFolder;
