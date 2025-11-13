import mongoose, { Schema, model, type Model } from 'mongoose';

export interface IComment {
    user: mongoose.Types.ObjectId;
    comment: string;
    createdAt: Date;
}

export interface IPost {
    _id: string;
    title?: string;
    content: string;
    author: mongoose.Types.ObjectId;
    image?: string;
    likes: mongoose.Types.ObjectId[];
    comments: IComment[];
    createdAt: Date;
    updatedAt: Date;
}

const postSchema = new Schema<IPost>({
    title: { type: String, required: false },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    image: { type: String, required: false },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        comment: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
    }],
}, { timestamps: true });

export const PostModel = model<IPost>('Post', postSchema);

export default PostModel;