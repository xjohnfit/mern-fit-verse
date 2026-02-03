import mongoose, { Schema, model, type Model } from 'mongoose';

interface IMessage {
    senderId: mongoose.Schema.Types.ObjectId;
    receiverId: mongoose.Schema.Types.ObjectId;
    text: string;
    image: string;
    messageType: 'text' | 'image' | 'template';
    templateData?: mongoose.Schema.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

const messageSchema = new Schema(
    {
        senderId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        receiverId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        text: { type: String, required: false },
        image: { type: String, required: false },
        messageType: {
            type: String,
            enum: ['text', 'image', 'template'],
            default: 'text',
        },
        templateData: {
            type: Schema.Types.ObjectId,
            ref: 'WorkoutTemplate',
            required: false,
        },
    },
    { timestamps: true },
);

const Message: Model<IMessage> = model<IMessage>('Message', messageSchema);

export default Message;
