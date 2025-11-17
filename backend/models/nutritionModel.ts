import mongoose, { Schema, model } from 'mongoose';

export interface INutritionEntry {
    user: mongoose.Types.ObjectId;
    date: Date;
    mealCategory: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'custom';
    customCategoryId?: mongoose.Types.ObjectId;
    foodItem: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    createdAt: Date;
    updatedAt: Date;
}

const nutritionEntrySchema = new Schema<INutritionEntry>({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    mealCategory: {
        type: String,
        enum: ['breakfast', 'lunch', 'dinner', 'snack', 'custom'],
        required: true,
    },
    customCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CustomCategory',
        required: false,
    },
    foodItem: { type: String, required: true },
    calories: { type: Number, required: true },
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fats: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const NutritionEntry = model<INutritionEntry>(
    'NutritionEntry',
    nutritionEntrySchema
);

export default NutritionEntry;
