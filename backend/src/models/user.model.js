import mongoose from 'mongoose';
import { use } from 'react';

const userSchema = new mongoose.Schema({
    clerkId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },  
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    profilepic: { type: String, default: '' },
    bannerpic: { type: String, default: '' },
    bio: { type: String, maxLength: 160 },
    location: { type: String, maxLength: 30 },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],


})

export default User;
