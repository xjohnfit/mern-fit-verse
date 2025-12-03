import { Server } from 'socket.io';
import http from 'http';
import express, { type Application } from 'express';

const app: Application = express();

const server = http.createServer(app);

// Socket.IO CORS will be configured after origins are defined in index.ts
const io = new Server(server, {
    cors: {
        origin: [
            process.env.FRONTEND_URL || 'http://localhost:5173',
            'https://fitverse.codewithxjohn.com',
        ].filter(Boolean),
        credentials: true,
    },
});

// Store online users with their socket IDs
const userSocketMap = new Map<string, string>(); // userId -> socketId

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Handle user login/authentication
    socket.on('user-online', (userId: string) => {
        userSocketMap.set(userId, socket.id);
        console.log(`User ${userId} is online with socket ${socket.id}`);

        // Broadcast updated online users list
        io.emit('online-users', Array.from(userSocketMap.keys()));
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);

        // Remove user from online users map
        for (const [userId, socketId] of userSocketMap.entries()) {
            if (socketId === socket.id) {
                userSocketMap.delete(userId);
                console.log(`User ${userId} is now offline`);
                break;
            }
        }

        // Broadcast updated online users list
        io.emit('online-users', Array.from(userSocketMap.keys()));
    });
});

// Helper function to get socket ID for a user
export const getReceiverSocketId = (userId: string): string | undefined => {
    return userSocketMap.get(userId);
};

export { io, app, server };
