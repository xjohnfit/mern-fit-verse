import mongoose, { Schema, model } from 'mongoose';

export interface ICustomCategory {
    user: mongoose.Types.ObjectId;
    name: string;
    color: string;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}

const customCategorySchema = new Schema<ICustomCategory>({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, maxlength: 20 },
    color: { type: String, required: true },
    order: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

// Ensure user can't have more than 3 custom categories
customCategorySchema.index({ user: 1 });

const CustomCategory = model<ICustomCategory>(
    'CustomCategory',
    customCategorySchema
);

export default CustomCategory;
