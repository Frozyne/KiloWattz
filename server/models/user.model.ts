import mongoose, {Document, Types, type PopulatedDoc} from "mongoose";
import type { IHousehold } from "./household.model.js";

export interface IUser extends Document {
  fullName: string;
  email: string;
  password?: string; // Optional if you decide to hide it dynamically using select: false
  role: 'User' | 'Admin';
  households: Types.ObjectId[] | PopulatedDoc<IHousehold>[]; // Reference to Household model
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>({
    fullName: {
        type: String,
        required: [true, 'Please enter your Name'],
        trim: true,
        minLength: [2, 'Name must be at least 2 characters long'],
        maxLength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
        type: String,
        required:[true, 'insert your email'],
        unique:[true, 'the email is currently in the data base '], 
        trim:true,
        lowercase: true,
        match:[/\S+@\S+\.\S+/, "Please provide a valid email address"]
    },
    password: {
        type: String,
        match: [/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z\d]).{6,}$/]
    },
    role: {
        type: String,
        enum: ['User', 'Admin'],
        default: 'User'
    },
    households: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Household',
        required: true,
        index: true
    }]
}, {timestamps: true})

const User = mongoose.model<IUser>('User', userSchema)
export default User