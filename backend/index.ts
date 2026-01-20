// Dependencies imports
import express from 'express';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

// Load environment variables FIRST before ANY imports that use them
dotenv.config({
    path:
        process.env.NODE_ENV === 'production'
            ? '.env.production'
            : '.env.development',
});

// Socket.io, app, and server imports (must come after dotenv.config)
import { app, server } from './config/socket.io';

// Config imports
import './config/cloudinary';
import connectDB from './config/dbConnection';

// Middleware imports
import { notFound, errorHandler } from './middlewares/errorMiddleware';

// Routes imports
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import messageRoutes from './routes/messageRoutes';
import postsRoutes from './routes/postRoutes';
import notificationRoutes from './routes/notificationRoutes';
import healthRoutes from './routes/healthRoutes';
import fatSecretRoutes from './routes/fatSecretRoutes';
import nutritionRoutes from './routes/NutritionRoutes';
import exerciseRoutes from './routes/exercisesRoutes';
import customCategoryRoutes from './routes/customCategoryRoutes';
import workoutRoutes from './routes/workoutRoutes';
import workoutTemplateRoutes from './routes/workoutTemplateRoutes';
import workoutTemplateFolderRoutes from './routes/workoutTemplateFolderRoutes';
import reportRoutes from './routes/reportRoutes';
import blockRoutes from './routes/blockRoutes';
import supportRoutes from './routes/supportRoutes';

// API Landing Screen
import apiLandingScreen from './apiLandingScreen';

const PORT: number = parseInt(process.env.PORT || '5004', 10);

// Define allowed origins for CORS (used by both Express and Socket.IO)
const allowedOrigins = [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'https://fitverse.codewithxjohn.com',
].filter(Boolean);

// CORS configuration
const corsOptions = {
    origin: (
        origin: string | undefined,
        callback: (err: Error | null, allow?: boolean) => void,
    ) => {
        // Allow requests with no origin (like mobile apps, Postman, etc.)
        if (!origin) {
            return callback(null, true);
        }

        // In development, allow all localhost and local network IPs
        if (process.env.NODE_ENV !== 'production') {
            const isLocalhost =
                origin.includes('localhost') || origin.includes('127.0.0.1');
            const isLocalNetwork =
                /^http:\/\/192\.168\.\d{1,3}\.\d{1,3}/.test(origin) ||
                /^http:\/\/10\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(origin) ||
                /^http:\/\/172\.(1[6-9]|2[0-9]|3[0-1])\.\d{1,3}\.\d{1,3}/.test(
                    origin,
                );

            if (isLocalhost || isLocalNetwork) {
                return callback(null, true);
            }
        }

        // Check against allowed origins
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    exposedHeaders: ['Set-Cookie'],
    maxAge: 86400, // 24 hours
};

// Middlewares
app.use(cors(corsOptions));

// Body parsers with increased limit for base64 images
app.use(
    express.json({
        limit: '50mb',
    }),
);
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Error handler for JSON parsing errors
app.use((err: any, req: any, res: any, next: any) => {
    if (err instanceof SyntaxError && 'body' in err) {
        console.error('JSON Parse Error:', err);
        return res.status(400).json({
            message: 'Invalid JSON format in request body',
            error: 'PARSING_ERROR',
        });
    }
    next(err);
});

app.use(cookieParser());

// Routes

app.get('/', apiLandingScreen);

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/fatsecret', fatSecretRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/custom-categories', customCategoryRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/workout-templates', workoutTemplateRoutes);
app.use('/api/workout-template-folders', workoutTemplateFolderRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/users', blockRoutes);
app.use('/api/support', supportRoutes);

// Error middlewares (should be placed AFTER all routes)
app.use(notFound);
app.use(errorHandler);

// Server startup with error handling
const startServer = async (): Promise<void> => {
    try {
        await connectDB();

        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log(`Environment: ${process.env.NODE_ENV}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
