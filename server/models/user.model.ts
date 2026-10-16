import mongoose, {Document, Types} from "mongoose";

export interface IUser extends Document {
  fullName: string;
  email: string;
  password?: string; // Optional if you decide to hide it dynamically using select: false
  avatarUrl: {
    url: string | null;
    publicId: string | null;
  };
  household: Types.ObjectId;
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
    avatarUrl: {
        url: {type: String, default: null},
        publicId: {type: String, default: null}
    },
    household: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Household',
        required: true,
        index: true
    }
},
{timestamps: true})

const User = mongoose.model<IUser>('User', userSchema)
export default User