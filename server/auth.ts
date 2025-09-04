import type { Request, Response, NextFunction } from "express";
import { storage } from "./storage";

// Legacy auth middleware - deprecated, use Replit OpenID Connect instead
export async function requireAuth(req: Request & { userId?: string }, res: Response, next: NextFunction) {
  return res.status(501).json({ error: "Legacy authentication deprecated. Please use Replit OpenID Connect." });
}

// Legacy optional auth - deprecated
export async function optionalAuth(req: Request & { userId?: string }, res: Response, next: NextFunction) {
  next(); // Just pass through for now
}

// Legacy registration - deprecated
export async function registerUser(): Promise<any> {
  throw new Error("Registration deprecated. Use Replit OpenID Connect.");
}

// Legacy login - deprecated
export async function loginUser(): Promise<any> {
  throw new Error("Login deprecated. Use Replit OpenID Connect.");
}

// Legacy logout - deprecated
export async function logoutUser(): Promise<void> {
  throw new Error("Logout deprecated. Use Replit OpenID Connect.");
}

// Get current user profile
export async function getCurrentUser(userId: string) {
  const user = await storage.getUser(userId);
  if (!user) {
    throw new Error("User not found");
  }
  
  return user;
}