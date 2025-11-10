import mongoose from "mongoose";
import { Schema, model, type Model } from 'mongoose';

interface INotification {
    from: mongoose.Schema.Types.ObjectId;
    to: mongoose.Schema.Types.ObjectId;
    type: string;
    message: string;
    isRead: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const notificationSchema = new Schema<INotification>({
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true },
    message: { type: String, required: true, enum: ['like', 'comment', 'follow', 'message', 'other'] },
    isRead: { type: Boolean, default: false },
}, { timestamps: true });

const Notification: Model<INotification> = model<INotification>('Notification', notificationSchema);

export default Notification;