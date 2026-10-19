import mongoose, { Schema, Document, Model } from "mongoose";
import crypto from "node:crypto";

export interface UserDocument extends Document {
  name: string;
  email: string;
  passwordHash: string;
  salt: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export function hashPassword(password: string): { salt: string; hash: string } {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return { salt, hash };
}

export function verifyPassword(password: string, salt: string, hash: string): boolean {
  try {
    const testHash = crypto.scryptSync(password, salt, 64).toString("hex");
    return crypto.timingSafeEqual(Buffer.from(testHash, "hex"), Buffer.from(hash, "hex"));
  } catch {
    return false;
  }
}

const userSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "Event Host",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.set("toJSON", {
  transform: (_doc, ret) => {
    return {
      id: ret._id.toString(),
      name: ret.name,
      email: ret.email,
      role: ret.role,
      createdAt: ret.createdAt,
    };
  },
});

export const UserModel: Model<UserDocument> =
  mongoose.models["User"] ?? mongoose.model<UserDocument>("User", userSchema, "users");

export default UserModel;
