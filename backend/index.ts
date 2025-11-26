// Dependencies imports
import express, { type Application } from 'express';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

// Middleware imports
import { notFound, errorHandler } from './middlewares/errorMiddleware';

// Config imports
import './config/cloudinary'
import connectDB from './config/dbConnection';

// Routes imports
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
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

// Configurations
dotenv.config({
    path:
        process.env.NODE_ENV === 'production'
            ? '.env.production'
            : '.env.development',
});

const app: Application = express();
const PORT: number = parseInt(process.env.PORT || '5003', 10);

// Middlewares
app.use(
    cors({
        origin: ['process.env.FRONTEND_URL'],
        credentials: true,
        exposedHeaders: ['Set-Cookie'],
        maxAge: 86400, // 24 hours
    })
);

// Body parsers with increased limit for base64 images
app.use(
    express.json({
        limit: '50mb',
        verify: (req, res, buf, encoding) => {
            // Add raw body for debugging if needed
            if (buf && buf.length) {
                (req as any).rawBody = buf.toString(encoding as BufferEncoding);
            }
        },
    })
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
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
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

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
    const staticPath = path.join(__dirname, '../../frontend/dist');
    const indexPath = path.resolve(
        __dirname,
        '../../frontend',
        'dist',
        'index.html'
    );

    console.log('Static files path:', staticPath);
    console.log('Index.html path:', indexPath);
    console.log('Current __dirname:', __dirname);

    app.use(express.static(staticPath));

    // Catch all handler: send back React's index.html file for SPA routing
    app.use((req, res) => {
        res.sendFile(indexPath);
    });
} else {
    // In development, provide a simple root route
    app.get('/', (req, res) => {
        res.json({ message: 'API is running in development mode' });
    });
}

// Error middlewares (should be placed AFTER all routes)
app.use(notFound);
app.use(errorHandler);

// Server startup with error handling
const startServer = async (): Promise<void> => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log(`Environment: ${process.env.NODE_ENV}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
