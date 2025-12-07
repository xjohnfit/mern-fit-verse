import asyncHandler from 'express-async-handler';
import { v2 as cloudinary } from 'cloudinary';
import { Request, Response } from 'express';
import { Message } from '../models/messageModel';
import { io, getReceiverSocketId } from '../config/socket.io';

import { sendPushNotification } from '../utils/pushNotifications';
import User from '../models/userModel';

export const getMessages = asyncHandler(async (req: Request, res: Response) => {
    const { senderId, receiverId } = req.params;
    const { limit = '50', before } = req.query;

    const query: any = {
        $or: [
            { senderId, receiverId },
            { senderId: receiverId, receiverId: senderId },
        ],
    };

    // If 'before' timestamp is provided, only fetch messages before that timestamp
    if (before) {
        query.createdAt = { $lt: new Date(before as string) };
    }

    const messages = await Message.find(query)
        .sort({ createdAt: -1 }) // Sort descending to get latest first
        .limit(parseInt(limit as string))
        .exec();

    // Reverse to get chronological order (oldest to newest)
    const orderedMessages = messages.reverse();

    res.json({
        messages: orderedMessages,
        hasMore: messages.length === parseInt(limit as string),
    });
});

export const sendMessage = asyncHandler(async (req: Request, res: Response) => {
    const { senderId, receiverId, text, image } = req.body;

    let imageUrl: string | undefined;
    if (image) {
        const uploadedImage = await cloudinary.uploader.upload(image);
        imageUrl = uploadedImage.secure_url;
    }
    const newMessage = new Message({
        senderId,
        receiverId,
        text,
        image: imageUrl,
    });
    const savedMessage = await newMessage.save();

    // Send push notification to receiver if they have a push token
    const receiver = await User.findById(receiverId);
    if (receiver?.expoPushToken) {
        const sender = await User.findById(senderId);
        if (sender) {
            await sendPushNotification(
                receiver.expoPushToken,
                sender.name || 'New Message',
                text,
                { senderId, receiverId, text, image: imageUrl }
            );
        }
    }

    // Emit the message to the receiver via Socket.IO
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
        io.to(receiverSocketId).emit('new-message', savedMessage);
    }

    res.status(201).json(savedMessage);
});
