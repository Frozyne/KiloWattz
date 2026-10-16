import mongoose, {Document, Types} from "mongoose";

export interface ISession extends Document {
  userId: Types.ObjectId;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema = new mongoose.Schema<ISession>({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    token:{
        type: String,
        required: true
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    expiresAt: { 
        type: Date, 
        required: true 
    }
},
{timestamps: true})

sessionSchema.index({expiresAt : 1 }, {expireAfterSeconds: 0})

const Session= mongoose.model<ISession>('Session', sessionSchema)
export default Session