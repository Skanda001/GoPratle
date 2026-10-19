import type { Request, Response } from "express";
import { z } from "zod";
import { UserModel, hashPassword, verifyPassword } from "../models/User.js";
import { createToken } from "../utils/jwt.js";
import { sendSuccess, sendError, sendValidationError } from "../utils/response.js";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address").toLowerCase().trim(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address").toLowerCase().trim(),
  password: z.string().min(1, "Password is required"),
});

export async function register(req: Request, res: Response): Promise<void> {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json(sendValidationError(parsed.error.issues));
    return;
  }

  const { name, email, password } = parsed.data;

  // Check if user already exists
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    res.status(409).json(sendError("An account with this email address already exists."));
    return;
  }

  const { salt, hash } = hashPassword(password);
  const user = await UserModel.create({
    name,
    email,
    salt,
    passwordHash: hash,
    role: "Event Host",
  });

  const token = createToken({
    userId: user._id.toString(),
    email: user.email,
    name: user.name,
    role: user.role,
  });

  res.status(201).json(
    sendSuccess("Account created successfully", {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    })
  );
}

export async function login(req: Request, res: Response): Promise<void> {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json(sendValidationError(parsed.error.issues));
    return;
  }

  const { email, password } = parsed.data;

  const user = await UserModel.findOne({ email });
  if (!user) {
    res.status(401).json(sendError("Invalid email or password."));
    return;
  }

  const valid = verifyPassword(password, user.salt, user.passwordHash);
  if (!valid) {
    res.status(401).json(sendError("Invalid email or password."));
    return;
  }

  const token = createToken({
    userId: user._id.toString(),
    email: user.email,
    name: user.name,
    role: user.role,
  });

  res.status(200).json(
    sendSuccess("Signed in successfully", {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    })
  );
}

export async function getMe(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json(sendError("Authentication required"));
    return;
  }

  const user = await UserModel.findById(req.user.userId);
  if (!user) {
    res.status(404).json(sendError("User not found"));
    return;
  }

  res.status(200).json(
    sendSuccess("User profile retrieved", {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  );
}
