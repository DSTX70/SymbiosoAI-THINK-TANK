import * as client from "openid-client";
import { Strategy, type VerifyFunction } from "openid-client/passport";

import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";

if (!process.env.REPLIT_DOMAINS) {
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
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  
  // Fix cookie settings for Replit development environment
  const isProduction = process.env.NODE_ENV === "production";
  
  return session({
    secret: process.env.SESSION_SECRET!,
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
  await storage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"],
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  const config = await getOidcConfig();

  const verify: VerifyFunction = async (
    tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers,
    verified: passport.AuthenticateCallback
  ) => {
    const user = {};
    updateUserSession(user, tokens);
    await upsertUser(tokens.claims());
    verified(null, user);
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
  passport.deserializeUser((user: Express.User, cb) => cb(null, user));

  app.get("/api/login", (req, res, next) => {
    // Use the actual request hostname for OAuth consistency
    const domain = req.hostname;
    console.log("🔐 Login request - Using request hostname:", domain);
    
    passport.authenticate(`replitauth:${domain}`, {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"],
    })(req, res, next);
  });

  app.get("/api/callback", (req, res, next) => {
    // Use the actual request hostname for OAuth consistency
    const domain = req.hostname;
    console.log("🔐 Callback request - Using request hostname:", domain);
    
    passport.authenticate(`replitauth:${domain}`, (err: any, user: any, info: any) => {
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

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const user = req.user as any;

  if (!req.isAuthenticated() || !user.expires_at) {
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