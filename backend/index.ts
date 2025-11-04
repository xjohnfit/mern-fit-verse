import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';

// Configurations
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use('/api/users', userRoutes);
// app.use('/api/exercises', exerciseRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});