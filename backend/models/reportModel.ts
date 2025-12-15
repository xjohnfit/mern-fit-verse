import mongoose, { Schema, Document } from 'mongoose';

export interface IReport extends Document {
    reporter: mongoose.Types.ObjectId;
    reportedUser: mongoose.Types.ObjectId;
    reportedPost?: mongoose.Types.ObjectId;
    reason:
        | 'harassment'
        | 'hate_speech'
        | 'spam'
        | 'inappropriate_content'
        | 'violence'
        | 'other';
    description?: string;
    status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
    actionTaken?:
        | 'warning'
        | 'suspend'
        | 'ban'
        | 'content_removed'
        | 'no_action';
    reviewedBy?: mongoose.Types.ObjectId;
    reviewedAt?: Date;
    adminNotes?: string;
    createdAt: Date;
}

const reportSchema = new Schema<IReport>({
    reporter: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    reportedUser: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    reportedPost: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: false,
    },
    reason: {
        type: String,
        enum: [
            'harassment',
            'hate_speech',
            'spam',
            'inappropriate_content',
            'violence',
            'other',
        ],
        required: true,
    },
    description: {
        type: String,
        maxlength: 500,
    },
    status: {
        type: String,
        enum: ['pending', 'reviewed', 'resolved', 'dismissed'],
        default: 'pending',
    },
    actionTaken: {
        type: String,
        enum: ['warning', 'suspend', 'ban', 'content_removed', 'no_action'],
    },
    reviewedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    reviewedAt: Date,
    adminNotes: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Index for faster queries
reportSchema.index({ reporter: 1, reportedUser: 1, status: 1 });
reportSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model<IReport>('Report', reportSchema);
