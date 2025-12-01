import mongoose, { Schema, model, type Model } from 'mongoose';

interface IMessage {
    senderId: mongoose.Schema.Types.ObjectId;
    receiverId: mongoose.Schema.Types.ObjectId;
    text: string;
    image?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const messageSchema = new Schema(
    {
        senderId: { 
            type: Schema.Types.ObjectId, 
            ref: 'User', 
            required: true 
        },
        receiverId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        text: { type: String, required: false },
        image: { type: String , required: false },
    },
    { timestamps: true }
);

export const Message: Model<IMessage> = model<IMessage>('Message', messageSchema);
