import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Notification from '../models/notificationModel';

// Get notifications
export const getNotifications = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = req.user?._id;

        const notifications = await Notification.find({ to: userId })
            .populate('from', 'username photo')
            .sort({ createdAt: -1 });

        await Notification.updateMany(
            { to: userId, isRead: false },
            { isRead: true }
        );

        res.status(200).json(notifications);
    }
);

// Delete notifications
export const deleteNotifications = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = req.user?._id;
        await Notification.deleteMany({ to: userId });
        res.status(200).json({ message: 'Notifications deleted' });
    }
);
