// Dependencies imports
import express, { Application } from 'express';
import cors from 'cors';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import connectDB from './config/dbConnection';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { notFound, errorHandler } from './middlewares/errorMiddleware';

// Routes imports
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import postsRoutes from './routes/postRoutes';
import notificationRoutes from './routes/notificationRoutes';
import healthRoutes from './routes/healthRoutes';
import fatSecretRoutes from './routes/fatSecretRoutes';
import nutritionRoutes from './routes/NutritionRoutes';
import customCategoryRoutes from './routes/customCategoryRoutes';
// import exerciseRoutes from './routes/exerciseRoutes';

// Configurations
dotenv.config({
    path:
        process.env.NODE_ENV === 'production'
            ? '.env.production'
            : '.env.development',
});

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

const app: Application = express();
const PORT: number = parseInt(process.env.PORT || '5003', 10);

// Configure CORS origins
const allowedOrigins = process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(',').map((url) => url.trim())
    : ['http://localhost:5173', 'http://localhost:3000'];

console.log('Allowed CORS origins:', allowedOrigins);

// Middlewares
app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (mobile apps, Postman, etc.)
            if (!origin) {
                return callback(null, true);
            }

            // Check if origin is allowed
            if (
                allowedOrigins.indexOf(origin) !== -1 ||
                allowedOrigins.includes('*')
            ) {
                callback(null, true);
            } else {
                console.warn('Blocked by CORS:', origin);
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'Cookie',
            'X-Requested-With',
        ],
        exposedHeaders: ['Set-Cookie'],
        maxAge: 86400, // 24 hours
    })
);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/fatsecret', fatSecretRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/custom-categories', customCategoryRoutes);

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
