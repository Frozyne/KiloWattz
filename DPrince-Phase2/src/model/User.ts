
import mongoose, { Schema, Types } from "mongoose";

export interface IUser {
  fullName: string;
  email: string;
  password: string;
  role: "admin" | "user";
  households: Types.ObjectId[];
  avatarUrl: {
    url: string | null;
    publicId: string | null;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /\S+@\S+\.\S+/,
    },

    password: {
      type: String,
      required: true,
      select: false,
      match: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z\d]).{6,}$/,
    },

    role: {
      type: String,
      enum: ["admin", "user"],
      required: true,
      default: "user",
    },

    households: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Household",
        },
      ],
      default: [],
    },

    avatarUrl: {
      url: {
        type: String,
        default: null,
      },
      publicId: {
        type: String,
        default: null,
      },
    },
  },
  {
    timestamps: true,
  }
);

const User =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
