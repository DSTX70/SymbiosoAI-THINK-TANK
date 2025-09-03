import bcrypt from "bcryptjs";
import type { Request, Response, NextFunction } from "express";
import { storage } from "./storage";
import { registerSchema, loginSchema, type RegisterData, type LoginData } from "@shared/schema";

// Middleware to check authentication
export async function requireAuth(req: Request & { userId?: string }, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace('Bearer ', '') || req.headers['x-auth-token'] as string;
    
    if (!token) {
      return res.status(401).json({ error: "No authentication token provided" });
    }

    const userSession = await storage.getUserSession(token);
    if (!userSession) {
      return res.status(401).json({ error: "Invalid or expired authentication token" });
    }

    // Attach user ID to request for downstream handlers
    req.userId = userSession.userId;
    next();
  } catch (error) {
    console.error("Authentication middleware error:", error);
    res.status(500).json({ error: "Internal authentication error" });
  }
}

// Optional auth - user can be authenticated or not
export async function optionalAuth(req: Request & { userId?: string }, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace('Bearer ', '') || req.headers['x-auth-token'] as string;
    
    if (token) {
      const userSession = await storage.getUserSession(token);
      if (userSession) {
        req.userId = userSession.userId;
      }
    }
    
    next();
  } catch (error) {
    // Ignore auth errors for optional auth
    next();
  }
}

// Register new user
export async function registerUser(userData: RegisterData): Promise<{ user: any, token: string }> {
  // Check if username already exists
  const existingUser = await storage.getUserByUsername(userData.username);
  if (existingUser) {
    throw new Error("Username already exists");
  }

  // Hash password
  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

  // Create user
  const user = await storage.createUser({
    username: userData.username,
    email: userData.email,
    password: hashedPassword,
    firstName: userData.firstName,
    lastName: userData.lastName,
  });

  // Create session token
  const userSession = await storage.createUserSession(user.id);

  // Return user (without password) and token
  const { password, ...userWithoutPassword } = user;
  return {
    user: userWithoutPassword,
    token: userSession.token
  };
}

// Login user
export async function loginUser(credentials: LoginData): Promise<{ user: any, token: string }> {
  // Find user
  const user = await storage.getUserByUsername(credentials.username);
  if (!user) {
    throw new Error("Invalid username or password");
  }

  // Check password
  const isValidPassword = await bcrypt.compare(credentials.password, user.password);
  if (!isValidPassword) {
    throw new Error("Invalid username or password");
  }

  // Create session token
  const userSession = await storage.createUserSession(user.id);

  // Return user (without password) and token
  const { password, ...userWithoutPassword } = user;
  return {
    user: userWithoutPassword,
    token: userSession.token
  };
}

// Logout user
export async function logoutUser(token: string): Promise<void> {
  await storage.deleteUserSession(token);
}

// Get current user profile
export async function getCurrentUser(userId: string) {
  const user = await storage.getUser(userId);
  if (!user) {
    throw new Error("User not found");
  }
  
  // Return user without password
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

// Validate registration data
export function validateRegistration(data: any): RegisterData {
  return registerSchema.parse(data);
}

// Validate login data
export function validateLogin(data: any): LoginData {
  return loginSchema.parse(data);
}