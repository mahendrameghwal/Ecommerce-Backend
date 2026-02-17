import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IMobile {
    countryCode: string;
    number: string;
}

export interface IAddress {
    address: string;
    pincode: string;
    isDefault?: boolean;
}

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    role: string;
    mobile?: IMobile;
    addresses?: IAddress[];
    isVerified?: boolean;
    refreshToken?: string;
    lastLogin?: Date;
    isActive?: boolean;
    otp?: string;
    otpExpires?: Date;
    comparePassword(password: string): Promise<boolean>;
}

const AddressSchema = new Schema({
    address: { type: String },
    pincode: { type: String },
    isDefault: { type: Boolean, default: false }
});

const UserSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, default: 'user', enum: ['user', 'admin'] },
        mobile: {
            countryCode: { type: String, default: '+91' },
            number: { type: String }
        },
        addresses: [AddressSchema],
        isVerified: { type: Boolean, default: false },
        refreshToken: { type: String },
        lastLogin: { type: Date },
        isActive: { type: Boolean, default: true },
        otp: { type: String },
        otpExpires: { type: Date }
    },
    { timestamps: true }
);

// Hash password before saving
UserSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password!, salt);
        next();
    } catch (error) {
        next(error as Error);
    }
});

// Compare password method
UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password!);
};

export default mongoose.model<IUser>('User', UserSchema);
