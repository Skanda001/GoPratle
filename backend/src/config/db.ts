import mongoose from "mongoose";
import { env } from "./env.js";

let isConnected = false;

export async function connectDB(): Promise<void> {
  if (isConnected) return;

  await mongoose.connect(env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
  });

  isConnected = true;
  console.info("✅ MongoDB connected");
}

export async function disconnectDB(): Promise<void> {
  if (!isConnected) return;
  await mongoose.disconnect();
  isConnected = false;
  console.info("🔌 MongoDB disconnected");
}

export function getDBStatus(): "connected" | "disconnected" {
  return mongoose.connection.readyState === 1 ? "connected" : "disconnected";
}

mongoose.connection.on("disconnected", () => {
  isConnected = false;
  console.warn("⚠️  MongoDB disconnected");
});

mongoose.connection.on("reconnected", () => {
  isConnected = true;
  console.info("✅ MongoDB reconnected");
});
