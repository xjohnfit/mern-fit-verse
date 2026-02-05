import asyncHandler from 'express-async-handler';
import { v2 as cloudinary } from 'cloudinary';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Message from '../models/messageModel';
import WorkoutTemplate from '../models/workoutTemplateModel';
import { io, getReceiverSocketId } from '../config/socket.io';

import { sendPushNotification } from '../utils/pushNotifications';
import User from '../models/userModel';

export const getMessages = asyncHandler(async (req: Request, res: Response) => {
    const { senderId, receiverId } = req.params;
    const { limit = '50', before } = req.query;

    // Check if there's a block relationship
    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!sender || !receiver) {
        res.status(404);
        throw new Error('User not found');
    }

    // Check if sender blocked receiver or vice versa
    const isBlocked = sender.blockedUsers?.some(
        (id: any) => id.toString() === receiverId,
    );
    const isBlockedBy = receiver.blockedUsers?.some(
        (id: any) => id.toString() === senderId,
    );

    // If blocked, return empty message history
    if (isBlocked || isBlockedBy) {
        res.json({
            messages: [],
            hasMore: false,
        });
        return;
    }

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
        .populate('templateData', 'name description exercises')
        .populate('senderId', 'name username photo')
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

    // Check if there's a block relationship
    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!sender || !receiver) {
        res.status(404);
        throw new Error('User not found');
    }

    // Check if sender blocked receiver or vice versa
    const isBlocked = sender.blockedUsers?.some(
        (id: any) => id.toString() === receiverId,
    );
    const isBlockedBy = receiver.blockedUsers?.some(
        (id: any) => id.toString() === senderId,
    );

    if (isBlocked || isBlockedBy) {
        res.status(403);
        throw new Error('Cannot send messages to this user');
    }

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
    if (receiver?.expoPushToken) {
        await sendPushNotification(
            receiver.expoPushToken,
            sender.name || 'New Message',
            text,
            { senderId, receiverId, text, image: imageUrl },
        );
    }

    // Emit the message to the receiver via Socket.IO
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
        io.to(receiverSocketId).emit('new-message', savedMessage);
    }

    res.status(201).json(savedMessage);
});

// Get all users that have messages with the current user
export const getUsersWithMessages = asyncHandler(
    async (req: Request, res: Response) => {
        const { userId } = req.params;

        // Validate userId format
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            res.status(400);
            throw new Error('Invalid user ID format');
        }

        // Convert to ObjectId
        const userObjectId = new mongoose.Types.ObjectId(userId);

        // Get all messages where user is sender or receiver
        const messages = await Message.find({
            $or: [{ senderId: userObjectId }, { receiverId: userObjectId }],
        })
            .select('senderId receiverId createdAt')
            .lean();

        // Extract unique user IDs with their last message timestamp
        const userLastMessageMap = new Map<string, Date>();
        messages.forEach((msg) => {
            const otherUserId =
                msg.senderId.toString() === userId
                    ? msg.receiverId.toString()
                    : msg.senderId.toString();

            if (otherUserId !== userId && msg.createdAt) {
                const currentLastMessage = userLastMessageMap.get(otherUserId);
                const messageDate = new Date(msg.createdAt);
                if (!currentLastMessage || messageDate > currentLastMessage) {
                    userLastMessageMap.set(otherUserId, messageDate);
                }
            }
        });

        // Get user details for all unique user IDs
        const users = await User.find({
            _id: { $in: Array.from(userLastMessageMap.keys()) },
        }).select('_id name username photo');

        // Add lastMessageAt to each user and sort by latest message
        const usersWithLastMessage = users
            .map((user) => {
                const lastMessageDate = userLastMessageMap.get(
                    user._id.toString(),
                );
                return {
                    _id: user._id,
                    name: user.name,
                    username: user.username,
                    photo: user.photo,
                    lastMessageAt: lastMessageDate
                        ? lastMessageDate.toISOString()
                        : undefined,
                };
            })
            .sort((a, b) => {
                // Sort by most recent message first
                const aTime = a.lastMessageAt
                    ? new Date(a.lastMessageAt).getTime()
                    : 0;
                const bTime = b.lastMessageAt
                    ? new Date(b.lastMessageAt).getTime()
                    : 0;
                return bTime - aTime;
            });

        res.json(usersWithLastMessage);
    },
);

// Share workout template via message
export const shareTemplate = asyncHandler(
    async (req: Request, res: Response) => {
        const { senderId, receiverId, templateId } = req.body;

        // Validate inputs
        if (!senderId || !receiverId || !templateId) {
            res.status(400);
            throw new Error(
                'Sender ID, receiver ID, and template ID are required',
            );
        }

        // Check if users exist
        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId);

        if (!sender || !receiver) {
            res.status(404);
            throw new Error('User not found');
        }

        // Check if there's a block relationship
        const isBlocked = sender.blockedUsers?.some(
            (id: any) => id.toString() === receiverId,
        );
        const isBlockedBy = receiver.blockedUsers?.some(
            (id: any) => id.toString() === senderId,
        );

        if (isBlocked || isBlockedBy) {
            res.status(403);
            throw new Error('Cannot share templates with this user');
        }

        // Check if template exists and belongs to sender
        const template = await WorkoutTemplate.findOne({
            _id: templateId,
            userId: senderId,
        });

        if (!template) {
            res.status(404);
            throw new Error('Template not found or you do not have permission');
        }

        // Create message with template
        const newMessage = new Message({
            senderId,
            receiverId,
            text: `Shared workout template: ${template.name}`,
            messageType: 'template',
            templateData: templateId,
        });

        const savedMessage = await newMessage.save();

        // Populate template data for response
        const populatedMessage = await Message.findById(savedMessage._id)
            .populate('templateData', 'name description exercises')
            .populate('senderId', 'name username photo');

        // Send push notification
        if (receiver?.expoPushToken) {
            await sendPushNotification(
                receiver.expoPushToken,
                sender.name || 'New Template',
                `${sender.name} shared a workout template: ${template.name}`,
                { senderId, receiverId, templateId, messageType: 'template' },
            );
        }

        // Emit the message to the receiver via Socket.IO
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('new-message', populatedMessage);
        }

        res.status(201).json(populatedMessage);
    },
);
