import mongoose, {Document, Schema} from "mongoose";

/** Only platform admins store `role: "admin"`; other users omit this field. */
export type UserRole = "admin";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  otp: string;
  otpExpires: Date;
  isVerified: boolean;
  company: mongoose.Types.ObjectId;
  role?: UserRole;
  refreshToken?: string;
  inviteToken?: string;
  inviteTokenExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      password: {
        type: String,
        required: false,
      },
      refreshToken: {
        type: String,
      },
      otp: { type: String },
      otpExpires: {
        type: Date,
      },
      isVerified: {
        type: Boolean,
        default: false,
      },
      company: {
        type: Schema.Types.ObjectId,
            ref: "Company",
            required: true,
        },
      role: {
        type: String,
        enum: ["admin"],
        required: false,
      },
      inviteToken: {
        type: String,
      },
      inviteTokenExpires: {
        type: Date,
      },
    }, { timestamps: true });

export const User = mongoose.model<IUser>("User", userSchema);