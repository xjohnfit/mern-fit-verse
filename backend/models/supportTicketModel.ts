import { Schema, model, Types } from 'mongoose';

export interface ISupportTicket {
    _id: string;
    user?: Types.ObjectId;
    contactEmail?: string;
    subject: string;
    category: 'technical' | 'account' | 'billing' | 'feedback' | 'other';
    priority: 'low' | 'medium' | 'high';
    status: 'open' | 'in-progress' | 'resolved' | 'closed';
    description: string;
    messages: {
        sender: Types.ObjectId;
        senderType: 'user' | 'admin';
        message: string;
        timestamp: Date;
        attachments?: string[];
    }[];
    assignedTo?: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const supportTicketSchema = new Schema<ISupportTicket>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: false,
        },
        contactEmail: {
            type: String,
            trim: true,
            lowercase: true,
        },
        subject: {
            type: String,
            required: [true, 'Subject is required'],
            trim: true,
            maxlength: [200, 'Subject cannot exceed 200 characters'],
        },
        category: {
            type: String,
            enum: ['technical', 'account', 'billing', 'feedback', 'other'],
            default: 'other',
            required: true,
        },
        priority: {
            type: String,
            enum: ['low', 'medium', 'high'],
            default: 'medium',
        },
        status: {
            type: String,
            enum: ['open', 'in-progress', 'resolved', 'closed'],
            default: 'open',
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            trim: true,
            maxlength: [2000, 'Description cannot exceed 2000 characters'],
        },
        messages: [
            {
                sender: {
                    type: Schema.Types.ObjectId,
                    ref: 'User',
                    required: true,
                },
                senderType: {
                    type: String,
                    enum: ['user', 'admin'],
                    required: true,
                },
                message: {
                    type: String,
                    required: true,
                    trim: true,
                    maxlength: [2000, 'Message cannot exceed 2000 characters'],
                },
                timestamp: {
                    type: Date,
                    default: Date.now,
                },
                attachments: [
                    {
                        type: String,
                    },
                ],
            },
        ],
        assignedTo: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    },
);

// Index for faster queries
supportTicketSchema.index({ user: 1, status: 1 });
supportTicketSchema.index({ status: 1, priority: 1 });
supportTicketSchema.index({ createdAt: -1 });

const SupportTicket = model<ISupportTicket>(
    'SupportTicket',
    supportTicketSchema,
);

export default SupportTicket;
