import { Schema, model, type Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser {
    _id: string;
    name: string;
    username: string;
    email: string;
    dob: Date;
    password: string;
    gender: string;
    followers: string[];
    following: string[];

    // Optional fields
    height?: number;
    weight?: number;
    goal?: string;
    photo?: string;
    likedPosts?: string[];

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
        dob: { type: Date, required: true },
        gender: { type: String, required: true },
        followers: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
        following: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],

        // Optional fields
        goal: { type: String, default: '' },
        photo: { type: String, default: '' },
        height: { type: Number, default: null },
        weight: { type: Number, default: null },
        likedPosts: [{ type: Schema.Types.ObjectId, ref: 'Post', default: [] }],
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
userSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User: Model<IUser> = model<IUser>('User', userSchema);

export default User;