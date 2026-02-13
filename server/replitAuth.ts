import * as client from "openid-client";
import { Strategy, type VerifyFunction } from "openid-client/passport";

import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";
import type { SystemUserRole } from "@shared/schema";

const shouldBypassAuth = process.env.BYPASS_AUTH === "true";
if (!process.env.REPLIT_DOMAINS && !shouldBypassAuth) {
  throw new Error("Environment variable REPLIT_DOMAINS not provided");
}

const getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID!
    );
  },
  { maxAge: 3600 * 1000 }
);

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const isProduction = process.env.NODE_ENV === "production";
  
  // Generate a session secret if not provided
  const sessionSecret = process.env.SESSION_SECRET || 'development-secret-key-' + Math.random().toString(36);
  if (!process.env.SESSION_SECRET) {
    console.log("⚠️ Using auto-generated session secret for development");
  }
  
  let sessionStore;
  
  // Try to use PostgreSQL store if DATABASE_URL is available, fallback to MemoryStore
  if (process.env.DATABASE_URL) {
    try {
      const pgStore = connectPg(session);
      sessionStore = new pgStore({
        conString: process.env.DATABASE_URL,
        createTableIfMissing: true, // Allow table creation in development
        ttl: sessionTtl,
        tableName: "sessions",
      });
      console.log("✅ Using PostgreSQL session store");
    } catch (error) {
      console.warn("⚠️ Failed to create PostgreSQL session store, falling back to MemoryStore:", error);
      // Use default MemoryStore
      sessionStore = undefined;
    }
  } else {
    console.log("📝 Using MemoryStore for sessions (development)");
    // Use default MemoryStore
    sessionStore = undefined;
  }
  
  return session({
    secret: sessionSecret,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: isProduction, // Only require HTTPS in production
      sameSite: isProduction ? "strict" : "lax", // More permissive in development
      maxAge: sessionTtl,
    },
  });
}

function updateUserSession(
  user: any,
  tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers
) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}

async function upsertUser(
  claims: any,
) {
  try {
    console.log("🔄 Creating/updating user with claims:", {
      id: claims["sub"],
      email: claims["email"],
      firstName: claims["first_name"],
      lastName: claims["last_name"]
    });
    
    const user = await storage.upsertUser({
      id: claims["sub"],
      email: claims["email"],
      firstName: claims["first_name"],
      lastName: claims["last_name"],
      profileImageUrl: claims["profile_image_url"],
    });
    
    console.log("✅ User upserted successfully:", user.id);
    return user;
  } catch (error) {
    console.error("❌ Failed to upsert user:", error);
    throw error;
  }
}

/**
 * Parse comma-separated allowlist from environment variable
 * @param envVar Environment variable name
 * @returns Array of user IDs or empty array if not set
 */
function parseAllowlist(envVar: string): string[] {
  const value = process.env[envVar];
  if (!value || value.trim() === '') {
    return [];
  }
  
  return value
    .split(',')
    .map(id => id.trim())
    .filter(id => id.length > 0);
}

/**
 * Auto-elevate user role based on allowlists
 * Only upgrades roles, never downgrades
 * @param userId User ID to check
 * @param claims OAuth claims containing user information
 */
async function maybeElevateRole(userId: string, claims: any): Promise<void> {
  try {
    const userSub = claims.sub;
    if (!userSub) {
      console.warn("⚠️ No sub claim found, skipping role elevation for user:", userId);
      return;
    }

    // Parse allowlists from environment variables
    const systemAdminAllowlist = parseAllowlist('SYSTEM_ADMIN_ALLOWLIST_SUBS');
    const adminAllowlist = parseAllowlist('ADMIN_ALLOWLIST_SUBS');

    if (systemAdminAllowlist.length === 0 && adminAllowlist.length === 0) {
      console.log("📝 No role allowlists configured, skipping auto-elevation");
      return;
    }

    // Get current user to check existing role
    const currentUser = await storage.getUser(userId);
    if (!currentUser) {
      console.warn("⚠️ User not found during role elevation:", userId);
      return;
    }

    const currentRole = currentUser.role as SystemUserRole;
    
    // Define role hierarchy (higher values = higher privilege)
    const roleHierarchy: Record<SystemUserRole, number> = {
      'user': 0,
      'premium_user': 1,
      'admin': 2,
      'system_admin': 3
    };

    let targetRole: SystemUserRole | null = null;

    // Check for system_admin elevation (highest priority)
    if (systemAdminAllowlist.includes(userSub)) {
      targetRole = 'system_admin';
      console.log("🔍 User sub found in SYSTEM_ADMIN_ALLOWLIST_SUBS:", userSub);
    }
    // Check for admin elevation (only if not already system_admin or higher)
    else if (adminAllowlist.includes(userSub) && roleHierarchy[currentRole] < roleHierarchy['admin']) {
      targetRole = 'admin';
      console.log("🔍 User sub found in ADMIN_ALLOWLIST_SUBS:", userSub);
    }

    // Only elevate if target role is higher than current role
    if (targetRole && roleHierarchy[targetRole] > roleHierarchy[currentRole]) {
      console.log(`🚀 Auto-elevating user ${userId} from ${currentRole} to ${targetRole}`);
      
      await storage.setUserRole(userId, targetRole);
      
      // Log elevation event for audit purposes
      console.log("✅ Role elevation successful", {
        userId,
        userSub,
        email: claims.email,
        fromRole: currentRole,
        toRole: targetRole,
        elevatedAt: new Date().toISOString(),
        source: 'oauth_allowlist'
      });
    } else if (targetRole && roleHierarchy[targetRole] <= roleHierarchy[currentRole]) {
      console.log(`📋 User ${userId} already has equal or higher role (${currentRole}), no elevation needed`);
    } else {
      console.log(`📝 User sub ${userSub} not found in any allowlists, keeping current role: ${currentRole}`);
    }
  } catch (error) {
    // Log error but don't throw - we don't want to break login flow
    console.error("❌ Error during role elevation (login will continue):", error, {
      userId,
      userSub: claims.sub,
      email: claims.email
    });
  }
}

export async function setupAuth(app: Express) {
  if (process.env.BYPASS_AUTH === "true") {
    console.log("🔓 Auth bypass enabled - skipping OIDC setup");
    return;
  }

  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  const config = await getOidcConfig();

  const verify: VerifyFunction = async (
    tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers,
    verified: passport.AuthenticateCallback
  ) => {
    try {
      const user = {};
      updateUserSession(user, tokens);
      const upsertedUser = await upsertUser(tokens.claims());
      
      // Auto-elevate role based on allowlists after user is created/updated
      await maybeElevateRole(upsertedUser.id, tokens.claims());
      
      verified(null, user);
    } catch (error) {
      console.error("❌ Verification failed:", error);
      verified(error, null);
    }
  };

  // Use REPLIT_DEV_DOMAIN for correct domain or fallback to REPLIT_DOMAINS
  const currentDomain = process.env.REPLIT_DEV_DOMAIN || process.env.REPLIT_DOMAINS!.split(",")[0];
  const domains = [currentDomain];
  
  for (const domain of domains) {
    console.log("🔐 Setting up OAuth strategy for domain:", domain);
    const strategy = new Strategy(
      {
        name: `replitauth:${domain}`,
        config,
        scope: "openid email profile offline_access",
        callbackURL: `https://${domain}/api/callback`,
      },
      verify,
    );
    passport.use(strategy);
  }

  passport.serializeUser((user: Express.User, cb) => cb(null, user));
  passport.deserializeUser(async (sessionData: any, cb) => {
    try {
      // If we have session data with claims, try to load the current user from database
      if (sessionData && sessionData.claims && sessionData.claims.sub) {
        const userId = sessionData.claims.sub;
        console.log("🔄 Deserializing user session for ID:", userId);
        
        // Load current user data from database
        let user = await storage.getUser(userId);
        
        // If user doesn't exist in database, auto-provision from claims
        if (!user) {
          console.log("🔄 Auto-provisioning user during session deserialization");
          try {
            user = await storage.upsertUser({
              id: sessionData.claims.sub,
              email: sessionData.claims.email,
              firstName: sessionData.claims.first_name,
              lastName: sessionData.claims.last_name,
              profileImageUrl: sessionData.claims.profile_image_url,
            });
            console.log("✅ User auto-provisioned during deserialization:", user.id);
            
            // Auto-elevate role for newly provisioned user
            await maybeElevateRole(user.id, sessionData.claims);
          } catch (error) {
            console.error("❌ Failed to auto-provision user during deserialization:", error);
            return cb(error, null);
          }
        } else {
          // For existing users, also check for role elevation on each session load
          // This ensures role changes take effect even for users with existing sessions
          await maybeElevateRole(user.id, sessionData.claims);
        }
        
        // Attach the fresh user data and preserve session tokens
        const enhancedUser = {
          ...user,
          claims: sessionData.claims,
          access_token: sessionData.access_token,
          refresh_token: sessionData.refresh_token,
          expires_at: sessionData.expires_at
        };
        
        console.log("✅ Session deserialized successfully for user:", user.id);
        return cb(null, enhancedUser);
      }
      
      // Fallback to original behavior if no claims found
      cb(null, sessionData);
    } catch (error) {
      console.error("❌ Session deserialization error:", error);
      cb(error, null);
    }
  });

  app.get("/api/login", (req, res, next) => {
    // Use the configured domain for OAuth consistency
    const configuredDomain = currentDomain;
    console.log("🔐 Login request - Using configured domain:", configuredDomain);
    
    passport.authenticate(`replitauth:${configuredDomain}`, {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"],
    })(req, res, next);
  });

  app.get("/api/callback", (req, res, next) => {
    // Use the configured domain for OAuth consistency
    const configuredDomain = currentDomain;
    console.log("🔐 Callback request - Using configured domain:", configuredDomain);
    
    passport.authenticate(`replitauth:${configuredDomain}`, (err: any, user: any, info: any) => {
      if (err) {
        console.error("OAuth authentication error:", err);
        return res.redirect("/api/login");
      }
      if (!user) {
        console.error("OAuth authentication failed:", info);
        return res.redirect("/api/login");
      }
      
      req.logIn(user, (err) => {
        if (err) {
          console.error("Session login error:", err);
          return res.redirect("/api/login");
        }
        
        console.log("OAuth authentication successful, redirecting to /");
        return res.redirect("/");
      });
    })(req, res, next);
  });

  app.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect(
        client.buildEndSessionUrl(config, {
          client_id: process.env.REPL_ID!,
          post_logout_redirect_uri: `${req.protocol}://${req.hostname}`,
        }).href
      );
    });
  });
}

// DEPRECATED: Use requireAuth from middleware/rbac.ts instead
// This function is kept for backward compatibility only and should not be used
export const isAuthenticated: RequestHandler = async (req, res, next) => {
  console.warn("DEPRECATED: isAuthenticated middleware is deprecated. Use requireAuth from middleware/rbac.ts instead");
  
  // Temporary bypass for development if BYPASS_AUTH is set
  if (process.env.BYPASS_AUTH === 'true') {
    console.log("🔓 Auth bypassed for development");
    return next();
  }
  
  const user = req.user as any;

  if (!req.isAuthenticated() || !user?.expires_at) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const now = Math.floor(Date.now() / 1000);
  if (now <= user.expires_at) {
    return next();
  }

  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    updateUserSession(user, tokenResponse);
    return next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};

// Optional authentication - allows both authenticated and unauthenticated requests
export const optionalAuth: RequestHandler = async (req, res, next) => {
  // Temporary bypass for development if BYPASS_AUTH is set
  if (process.env.BYPASS_AUTH === 'true') {
    console.log("🔓 Optional auth bypassed for development");
    return next();
  }
  
  const user = req.user as any;

  if (!req.isAuthenticated() || !user?.expires_at) {
    // Allow unauthenticated access
    return next();
  }

  const now = Math.floor(Date.now() / 1000);
  if (now <= user.expires_at) {
    return next();
  }

  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    // Allow access but user is not authenticated
    return next();
  }

  try {
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    updateUserSession(user, tokenResponse);
    return next();
  } catch (error) {
    // Allow access but user is not authenticated
    return next();
  }
};

// Organization-aware role-based access control middleware
export const requireOrganizationRole = (allowedRoles: string[], organizationId?: string): RequestHandler => {
  return async (req, res, next) => {
    const user = req.user as any;
    
    if (!req.isAuthenticated() || !user?.claims?.sub) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const userId = user.claims.sub;
      const orgId = organizationId || req.params.organizationId || req.query.organizationId || req.body.organizationId;
      
      if (orgId) {
        // Check organization-specific role
        const membership = await storage.getOrganizationMembership(orgId, userId);
        if (!membership || !allowedRoles.includes(membership.role)) {
          return res.status(403).json({ message: "Insufficient organization permissions" });
        }
        
        // Attach organization context to request
        (req as any).organizationId = orgId;
        (req as any).organizationMembership = membership;
      } else {
        // Check if user has required role in any organization (for super admins)
        const memberships = await storage.getUserOrganizationMemberships(userId);
        const hasRequiredRole = memberships.some((m: any) => allowedRoles.includes(m.role));
        
        if (!hasRequiredRole) {
          return res.status(403).json({ message: "Insufficient permissions" });
        }
        
        // Attach primary organization context
        if (memberships.length > 0) {
          (req as any).organizationId = memberships[0].organizationId;
          (req as any).organizationMembership = memberships[0];
        }
      }
      
      next();
    } catch (error) {
      console.error("Organization role check error:", error);
      return res.status(500).json({ message: "Permission check failed" });
    }
  };
};

// Legacy role-based access control (deprecated in favor of organization-aware version)
export const requireRole = (allowedRoles: string[]): RequestHandler => {
  return requireOrganizationRole(allowedRoles);
};

// Workspace-level access control
export const requireWorkspaceAccess = (minRole: "owner" | "admin" | "member" | "viewer" = "member"): RequestHandler => {
  return async (req, res, next) => {
    const user = req.user as any;
    const workspaceId = req.params.workspaceId;
    
    if (!req.isAuthenticated() || !user?.claims?.sub) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const membership = await storage.getWorkspaceMembership(workspaceId, user.claims.sub);
      if (!membership) {
        return res.status(403).json({ message: "Not a member of this workspace" });
      }

      // Check role hierarchy: owner > admin > member > viewer
      const roleHierarchy = ["viewer", "member", "admin", "owner"];
      const userRoleLevel = roleHierarchy.indexOf(membership.role);
      const requiredRoleLevel = roleHierarchy.indexOf(minRole);
      
      if (userRoleLevel < requiredRoleLevel) {
        return res.status(403).json({ message: "Insufficient workspace permissions" });
      }

      // Attach workspace info to request
      (req as any).workspaceMembership = membership;
      next();
    } catch (error) {
      console.error("Workspace access check error:", error);
      return res.status(500).json({ message: "Permission check failed" });
    }
  };
};
