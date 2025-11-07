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

// Configurations
dotenv.config({
    path: process.env.NODE_ENV === 'production' ? '.env' : '.env.example'
});

const app: Application = express();
const PORT: number = parseInt(process.env.PORT || '5003', 10);

// Middlewares
app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/users', userRoutes);
// app.use('/api/exercises', exerciseRoutes);
// app.use('/api/food', foodRoutes);

// Error middlewares (should be placed AFTER routes)
app.use(notFound);
app.use(errorHandler);

if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html'));
    });
}


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