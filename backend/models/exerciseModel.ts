import { type Model, Schema, model } from 'mongoose';

interface IExercise {
    name: string;
    description: string;
    instructions: string;
    image: string;
    category: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const ExerciseSchema = new Schema<IExercise>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    instructions: { type: String, required: true },
    image: { type: String, required: true, default: '' },
    category: { type: String, required: true },
}, { timestamps: true });

const ExerciseModel: Model<IExercise> = model<IExercise>('Exercise', ExerciseSchema);

export default ExerciseModel;