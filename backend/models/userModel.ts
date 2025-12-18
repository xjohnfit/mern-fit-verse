import { Schema, model, type Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser {
    _id: string;
    name: string;
    username: string;
    email: string;
    password: string;
    gender: string;
    followers: string[];
    following: string[];
    blockedUsers?: string[];
    admin: boolean;
    
    // Optional fields
    dob?: Date;
    height?: number;
    weight?: number;
    weightUnit?: string; // 'kg' or 'lbs'
    restTimer?: number; // Rest timer in seconds (default 120 = 2 minutes)
    goal?: string;
    photo?: string;
    likedPosts?: string[];
    workouts?: string[];

    // Nutrition goals
    nutritionGoals?: {
        calories?: number;
        protein?: number;
        carbs?: number;
        fats?: number;
    };

    // Expo push notification token
    expoPushToken?: string | null;

    // Account status (for reports/moderation)
    isActive?: boolean;
    isBanned?: boolean;
    suspendedUntil?: Date | null;

    // timestamps
    createdAt: Date;
    updatedAt: Date;

    isModified(field: string): boolean;
    matchPassword(enteredPassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        dob: { type: Date, required: false, default: null },
        gender: { type: String, required: true },
        followers: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
        following: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
        blockedUsers: [
            { type: Schema.Types.ObjectId, ref: 'User', default: [] },
        ],
        admin: { type: Boolean, default: false },

        // Optional fields
        goal: { type: String, default: '' },
        photo: { type: String, default: '' },
        height: { type: Number, default: null },
        weight: { type: Number, default: null },
        weightUnit: { type: String, default: 'lbs', enum: ['kg', 'lbs'] },
        restTimer: { type: Number, default: 120 }, // 3 minutes in seconds
        likedPosts: [{ type: Schema.Types.ObjectId, ref: 'Post', default: [] }],
        workouts: [
            { type: Schema.Types.ObjectId, ref: 'Workout', default: [] },
        ],

        // Nutrition goals
        nutritionGoals: {
            calories: { type: Number, default: null },
            protein: { type: Number, default: null },
            carbs: { type: Number, default: null },
            fats: { type: Number, default: null },
        },

        // Expo push notification token
        expoPushToken: { type: String, default: null },

        // Account status (for reports/moderation)
        isActive: { type: Boolean, default: true },
        isBanned: { type: Boolean, default: false },
        suspendedUntil: { type: Date, default: null },
    },
    { timestamps: true }
);

// Pre-save hook to hash password before saving
userSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    next();
});

// Method to compare entered password with hashed password
userSchema.methods.matchPassword = async function (
    enteredPassword: string
): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User: Model<IUser> = model<IUser>('User', userSchema);

export default User;
