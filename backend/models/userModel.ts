import { Schema, model, type Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser {
    _id: string;
    name: string;
    username: string;
    email: string;
    password: string;
    gender: string;
    goal?: string;
    photo?: string;
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
        gender: { type: String, required: true },
        goal: { type: String, required: true },
        photo: { type: String },
    },
    { timestamps: true }
);

userSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    next();
});

userSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User: Model<IUser> = model<IUser>('User', userSchema);

export default User;