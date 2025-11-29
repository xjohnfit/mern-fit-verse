import asyncHandler from 'express-async-handler';
import { v2 as cloudinary } from 'cloudinary';
import { Request, Response } from 'express';
import { Message } from '../models/messageModel';

export const getMessages = asyncHandler(async (req: Request, res: Response) => {
    const { senderId, receiverId } = req.params;

    const messages = await Message.find({
        $or: [
            { senderId, receiverId },
            { senderId: receiverId, receiverId: senderId },
        ],
    }).sort({ createdAt: 1 });

    res.json(messages);
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
    res.status(201).json(savedMessage);
});