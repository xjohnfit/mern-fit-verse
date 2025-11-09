// Dependencies imports
import express, { Application } from 'express';
import cors from 'cors';
import path from 'path';
import connectDB from './config/dbConnection';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { notFound, errorHandler } from './middlewares/errorMiddleware';

// Routes imports
import userRoutes from './routes/userRoutes';
import healthRoutes from './routes/healthRoutes';

// Configurations
dotenv.config({
    path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development',
});

const app: Application = express();
const PORT: number = parseInt(process.env.PORT || '5003', 10);

// Middlewares
app.use(
    cors({
        origin: [process.env.FRONTEND_URL as string],
        credentials: true,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/health', healthRoutes);
// app.use('/api/exercises', exerciseRoutes);
// app.use('/api/food', foodRoutes);

if (process.env.NODE_ENV === 'production') {
    // Serve static files from the React app
    // In container, frontend files are at /app/frontend/dist
    // Backend compiled files are at /app/dist/backend/
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
