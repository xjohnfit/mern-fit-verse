import mongoose, { Connection } from 'mongoose';

// Define interface for connection options
interface DatabaseConfig {
    uri: string;
    options?: mongoose.ConnectOptions;
}

// Define custom error type for database connection
class DatabaseConnectionError extends Error {
    constructor(message: string, public cause?: Error) {
        super(message);
        this.name = 'DatabaseConnectionError';
    }
}

// Main connection function with enhanced TypeScript
const connectDB = async (): Promise<Connection> => {
    try {
        // Validate environment variable
        const mongoUri: string | undefined = process.env.MONGO_URI;

        if (!mongoUri) {
            throw new DatabaseConnectionError(
                'MONGO_URI environment variable is not defined'
            );
        }

        // Database configuration with proper typing
        const config: DatabaseConfig = {
            uri: mongoUri,
            options: {
                // Add connection options with proper types
                maxPoolSize: 10,
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
            },
        };

        // Connect to MongoDB with typed response
        const conn: mongoose.Mongoose = await mongoose.connect(
            config.uri,
            config.options
        );

        console.log(`MongoDB connected: ${conn.connection.host}`);

        // Return the connection object
        return conn.connection;
    } catch (error: unknown) {
        // Enhanced error handling with proper typing
        if (error instanceof Error) {
            console.error(`Error connecting to MongoDB: ${error.message}`);
            throw new DatabaseConnectionError(
                `Failed to connect to database: ${error.message}`,
                error
            );
        } else {
            console.error(
                'Unknown error occurred while connecting to MongoDB:',
                error
            );
            throw new DatabaseConnectionError(
                'Unknown database connection error'
            );
        }
    }
};

// Function to gracefully disconnect from database
const disconnectDB = async (): Promise<void> => {
    try {
        await mongoose.disconnect();
        console.log('MongoDB disconnected');
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(`Error disconnecting from MongoDB: ${error.message}`);
        }
    }
};

// Export functions and types
export default connectDB;
export { disconnectDB, DatabaseConnectionError, type DatabaseConfig };
