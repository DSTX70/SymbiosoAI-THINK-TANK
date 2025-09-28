// Sprint 8 - Security Headers Middleware for SOC2 compliance
import type { Request, Response, NextFunction } from 'express';

export interface SecurityHeadersOptions {
  contentSecurityPolicy?: {
    directives?: Record<string, string[]>;
    reportOnly?: boolean;
  };
  strictTransportSecurity?: {
    maxAge?: number;
    includeSubDomains?: boolean;
    preload?: boolean;
  };
  referrerPolicy?: string;
  frameOptions?: string;
  contentTypeOptions?: boolean;
  permissionsPolicy?: Record<string, string[]>;
}

const DEFAULT_CSP_DIRECTIVES = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'", // Required for Vite dev mode and some UI libraries
    "'unsafe-eval'", // Required for Vite dev mode
    "https://cdn.jsdelivr.net", // For external libraries
    "https://*.replit.dev", // For Replit WebView integration
    "https://*.replit.co"
  ],
  'style-src': [
    "'self'",
    "'unsafe-inline'", // Required for CSS-in-JS and inline styles
    "https://fonts.googleapis.com",
    "https://cdn.jsdelivr.net"
  ],
  'img-src': [
    "'self'",
    "data:", // For base64 images
    "blob:", // For generated images
    "https:", // For external images
    "*.replit.dev",
    "*.replit.co"
  ],
  'font-src': [
    "'self'",
    "https://fonts.gstatic.com",
    "https://cdn.jsdelivr.net",
    "data:" // For embedded fonts
  ],
  'connect-src': [
    "'self'",
    "https://*.replit.dev",
    "https://*.replit.co",
    "wss://*.replit.dev", // For WebSocket connections
    "wss://*.replit.co",
    "https://api.openai.com", // External AI services
    "https://api.anthropic.com",
    "https://api.perplexity.ai"
  ],
  'frame-ancestors': ["'none'"], // Prevent embedding
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'upgrade-insecure-requests': []
};

export function securityHeadersMiddleware(options: SecurityHeadersOptions = {}) {
  return (req: Request, res: Response, next: NextFunction) => {
    // Content Security Policy
    if (options.contentSecurityPolicy !== false) {
      const cspDirectives = {
        ...DEFAULT_CSP_DIRECTIVES,
        ...options.contentSecurityPolicy?.directives
      };
      
      const cspHeader = Object.entries(cspDirectives)
        .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
        .join('; ');
      
      const headerName = options.contentSecurityPolicy?.reportOnly 
        ? 'Content-Security-Policy-Report-Only'
        : 'Content-Security-Policy';
      
      res.setHeader(headerName, cspHeader);
    }

    // Strict Transport Security (HTTPS only)
    if (req.secure || req.get('x-forwarded-proto') === 'https') {
      const hsts = options.strictTransportSecurity || {};
      const maxAge = hsts.maxAge || 31536000; // 1 year default
      const includeSubDomains = hsts.includeSubDomains !== false;
      const preload = hsts.preload === true;
      
      let hstsValue = `max-age=${maxAge}`;
      if (includeSubDomains) hstsValue += '; includeSubDomains';
      if (preload) hstsValue += '; preload';
      
      res.setHeader('Strict-Transport-Security', hstsValue);
    }

    // X-Frame-Options
    const frameOptions = options.frameOptions || 'DENY';
    res.setHeader('X-Frame-Options', frameOptions);

    // X-Content-Type-Options
    if (options.contentTypeOptions !== false) {
      res.setHeader('X-Content-Type-Options', 'nosniff');
    }

    // Referrer Policy
    const referrerPolicy = options.referrerPolicy || 'strict-origin-when-cross-origin';
    res.setHeader('Referrer-Policy', referrerPolicy);

    // X-XSS-Protection (legacy but still useful)
    res.setHeader('X-XSS-Protection', '1; mode=block');

    // Permissions Policy (Feature Policy replacement)
    if (options.permissionsPolicy) {
      const permissionsPolicy = Object.entries(options.permissionsPolicy)
        .map(([feature, allowlist]) => `${feature}=(${allowlist.join(' ')})`)
        .join(', ');
      
      res.setHeader('Permissions-Policy', permissionsPolicy);
    }

    // Security-related headers for API responses
    res.setHeader('X-Powered-By', 'SymbiosoAI'); // Remove framework fingerprinting
    res.setHeader('X-Robots-Tag', 'noindex, nofollow'); // Prevent search engine indexing of API
    
    // CORS security for API endpoints
    if (req.path.startsWith('/api/')) {
      res.setHeader('X-API-Version', '1.0');
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }

    next();
  };
}

// Development-friendly CSP for Vite
export function developmentSecurityHeaders() {
  return securityHeadersMiddleware({
    contentSecurityPolicy: {
      directives: {
        ...DEFAULT_CSP_DIRECTIVES,
        'script-src': [
          "'self'",
          "'unsafe-inline'",
          "'unsafe-eval'", // Required for Vite HMR
          "https://cdn.jsdelivr.net",
          "https://*.replit.dev",
          "https://*.replit.co"
        ]
      }
    },
    strictTransportSecurity: {
      maxAge: 0 // Disable HSTS in development
    }
  });
}

// Production-hardened CSP
export function productionSecurityHeaders() {
  return securityHeadersMiddleware({
    contentSecurityPolicy: {
      directives: {
        'default-src': ["'self'"],
        'script-src': ["'self'", "https://cdn.jsdelivr.net"],
        'style-src': ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        'img-src': ["'self'", "data:", "https:"],
        'font-src': ["'self'", "https://fonts.gstatic.com"],
        'connect-src': [
          "'self'",
          "https://api.openai.com",
          "https://api.anthropic.com",
          "https://api.perplexity.ai"
        ],
        'frame-ancestors': ["'none'"],
        'base-uri': ["'self'"],
        'form-action': ["'self'"],
        'upgrade-insecure-requests': []
      }
    },
    strictTransportSecurity: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    },
    permissionsPolicy: {
      'camera': ['none'],
      'microphone': ['none'],
      'geolocation': ['none'],
      'notifications': ['self'],
      'payment': ['none']
    }
  });
}