import type { Request, Response, NextFunction } from "express";
import type { SecurityEvent } from "@shared/schema";

interface SecurityConfig {
  enablePiiRedaction: boolean;
  enableAuditLogging: boolean;
  piiPatterns: {
    email: RegExp;
    phone: RegExp;
    ssn: RegExp;
    creditCard: RegExp;
    ipAddress: RegExp;
  };
  redactionMask: string;
}

const DEFAULT_SECURITY_CONFIG: SecurityConfig = {
  enablePiiRedaction: true,
  enableAuditLogging: true,
  piiPatterns: {
    // Email pattern
    email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    // Phone patterns (US and international)
    phone: /(?:\+?1[-.\s]?)?(?:\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}|\b[0-9]{3}[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}\b)/g,
    // SSN pattern
    ssn: /\b\d{3}-?\d{2}-?\d{4}\b/g,
    // Credit card patterns (16 digits, with or without separators)
    creditCard: /\b(?:\d{4}[\s-]?){3}\d{4}\b/g,
    // IP Address pattern
    ipAddress: /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g,
  },
  redactionMask: "[REDACTED]"
};

class SecurityMiddleware {
  private config: SecurityConfig;

  constructor(config?: Partial<SecurityConfig>) {
    this.config = { ...DEFAULT_SECURITY_CONFIG, ...config };
  }

  /**
   * PII Detection and Redaction System
   */
  private detectPii(text: string): { type: string; matches: string[] }[] {
    const detectedPii: { type: string; matches: string[] }[] = [];
    
    Object.entries(this.config.piiPatterns).forEach(([type, pattern]) => {
      const matches = text.match(pattern);
      if (matches && matches.length > 0) {
        detectedPii.push({ type, matches: Array.from(new Set(matches)) });
      }
    });
    
    return detectedPii;
  }

  private redactPii(obj: any): { redacted: any; piiDetected: { type: string; count: number }[] } {
    if (!this.config.enablePiiRedaction) {
      return { redacted: obj, piiDetected: [] };
    }

    const piiDetected: { type: string; count: number }[] = [];
    
    const redactRecursive = (item: any): any => {
      if (typeof item === 'string') {
        let redactedString = item;
        
        Object.entries(this.config.piiPatterns).forEach(([type, pattern]) => {
          const matches = item.match(pattern);
          if (matches && matches.length > 0) {
            const existingType = piiDetected.find(p => p.type === type);
            if (existingType) {
              existingType.count += matches.length;
            } else {
              piiDetected.push({ type, count: matches.length });
            }
            redactedString = redactedString.replace(pattern, this.config.redactionMask);
          }
        });
        
        return redactedString;
      } else if (Array.isArray(item)) {
        return item.map(redactRecursive);
      } else if (item && typeof item === 'object') {
        const redactedObj: any = {};
        Object.keys(item).forEach(key => {
          redactedObj[key] = redactRecursive(item[key]);
        });
        return redactedObj;
      }
      
      return item;
    };

    const redacted = redactRecursive(obj);
    return { redacted, piiDetected };
  }

  /**
   * Security Event Detection and Response
   */
  private async detectSecurityThreats(req: Request): Promise<SecurityEvent[]> {
    const events: SecurityEvent[] = [];
    const suspiciousPatterns = [
      // SQL Injection patterns
      /(\bSELECT\b|\bUNION\b|\bINSERT\b|\bUPDATE\b|\bDELETE\b|\bDROP\b).*(\bFROM\b|\bWHERE\b|\bOR\b|\bAND\b)/i,
      // XSS patterns
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      // Path traversal
      /\.\.\/|\.\.\\|%2e%2e%2f|%2e%2e%5c/i,
      // Command injection
      /(\b(cat|ls|pwd|whoami|id|uname|netstat|ps|kill|rm|cp|mv|chmod|chown|su|sudo|wget|curl)\b)|[;&|`$()]/i
    ];

    // Check request body for threats
    if (req.body) {
      const bodyStr = JSON.stringify(req.body);
      suspiciousPatterns.forEach((pattern, index) => {
        if (pattern.test(bodyStr)) {
          events.push({
            id: `evt_${Date.now()}_${index}`,
            organizationId: (req as any).organizationId || null,
            eventType: 'security_threat',
            severity: 'high',
            description: `Security threat detected: ${this.getThreatType(index)}`,
            metadata: {
              threat_type: this.getThreatType(index),
              pattern_matched: pattern.toString(),
              request_path: req.path,
              user_agent: req.get('User-Agent'),
              ip_address: req.ip
            },
            resolved: false,
            resolvedAt: null,
            resolvedBy: null,
            timestamp: new Date()
          } as SecurityEvent);
        }
      });
    }

    // Check query parameters for threats
    if (req.query) {
      const queryStr = JSON.stringify(req.query);
      suspiciousPatterns.forEach((pattern, index) => {
        if (pattern.test(queryStr)) {
          events.push({
            id: `evt_${Date.now()}_${index}_query`,
            organizationId: (req as any).organizationId || null,
            eventType: 'security_threat',
            severity: 'high',
            description: `Query security threat detected: ${this.getThreatType(index)}`,
            metadata: {
              threat_type: this.getThreatType(index),
              pattern_matched: pattern.toString(),
              request_path: req.path,
              user_agent: req.get('User-Agent'),
              ip_address: req.ip
            },
            resolved: false,
            resolvedAt: null,
            resolvedBy: null,
            timestamp: new Date()
          } as SecurityEvent);
        }
      });
    }

    return events;
  }

  private getThreatType(patternIndex: number): string {
    const threatTypes = ['sql_injection', 'xss_attack', 'path_traversal', 'command_injection'];
    return threatTypes[patternIndex] || 'unknown_threat';
  }

  /**
   * Rate Limiting with Anomaly Detection
   */
  private rateLimitTracker = new Map<string, { requests: number; firstRequest: number; blocked: boolean }>();

  private checkRateLimit(req: Request, limit = 100, windowMs = 60000): boolean {
    const key = `${req.ip}_${(req as any).user?.claims?.sub || 'anonymous'}`;
    const now = Date.now();
    
    const tracker = this.rateLimitTracker.get(key);
    
    if (!tracker) {
      this.rateLimitTracker.set(key, { requests: 1, firstRequest: now, blocked: false });
      return true;
    }
    
    // Reset window if expired
    if (now - tracker.firstRequest > windowMs) {
      this.rateLimitTracker.set(key, { requests: 1, firstRequest: now, blocked: false });
      return true;
    }
    
    // Check if rate limit exceeded
    if (tracker.requests >= limit) {
      tracker.blocked = true;
      return false;
    }
    
    tracker.requests++;
    return true;
  }

  /**
   * Main Security Middleware
   */
  securityMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        // 1. Rate Limiting Check
        if (!this.checkRateLimit(req)) {
          return res.status(429).json({ 
            error: "Rate limit exceeded", 
            retryAfter: 60 
          });
        }

        // 2. Security Threat Detection
        const securityEvents = await this.detectSecurityThreats(req);
        
        if (securityEvents.length > 0) {
          // Log security events (would integrate with audit system)
          console.warn('Security threats detected:', securityEvents.length);
          
          // Block high-severity threats
          const highSeverityEvents = securityEvents.filter(e => e.severity === 'high');
          if (highSeverityEvents.length > 0) {
            return res.status(403).json({ 
              error: "Request blocked due to security policy",
              eventId: highSeverityEvents[0].id
            });
          }
        }

        // 3. PII Redaction for request body
        if (req.body) {
          const { redacted, piiDetected } = this.redactPii(req.body);
          
          if (piiDetected.length > 0) {
            // Store original body for audit
            (req as any).originalBody = req.body;
            (req as any).piiDetected = piiDetected;
            req.body = redacted;
            
            // Log PII detection
            console.info('PII detected and redacted:', piiDetected);
          }
        }

        // 4. Security headers
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Frame-Options', 'DENY');
        res.setHeader('X-XSS-Protection', '1; mode=block');
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

        next();
        
      } catch (error) {
        console.error('Security middleware error:', error);
        next(error);
      }
    };
  }

  /**
   * Response PII Redaction Middleware
   */
  responseSecurityMiddleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      const originalJson = res.json;
      
      res.json = function(body: any) {
        if (body && typeof body === 'object') {
          const { redacted, piiDetected } = (req as any).securityMiddleware?.redactPii(body) || { redacted: body, piiDetected: [] };
          
          if (piiDetected.length > 0) {
            console.info('PII detected in response and redacted:', piiDetected);
            // Could add audit log entry here
          }
          
          return originalJson.call(this, redacted);
        }
        
        return originalJson.call(this, body);
      };
      
      next();
    };
  }

  /**
   * Audit Logging Middleware
   */
  auditMiddleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!this.config.enableAuditLogging) {
        return next();
      }

      const startTime = Date.now();
      
      // Capture response for logging
      const originalJson = res.json;
      let responseBody: any;
      
      res.json = function(body: any) {
        responseBody = body;
        return originalJson.call(this, body);
      };

      res.on('finish', () => {
        const duration = Date.now() - startTime;
        
        // Create audit log entry
        const auditLog = {
          organizationId: (req as any).organizationId || null,
          userId: (req as any).user?.claims?.sub || null,
          action: `${req.method} ${req.path}`,
          resourceType: 'api_endpoint',
          resourceId: req.path,
          details: {
            method: req.method,
            path: req.path,
            query: req.query,
            status_code: res.statusCode,
            response_time_ms: duration,
            user_agent: req.get('User-Agent'),
            pii_detected: (req as any).piiDetected || [],
            ip_address: req.ip
          },
          ipAddress: req.ip,
          userAgent: req.get('User-Agent') || null,
          createdAt: new Date()
        };
        
        // In a real implementation, this would be saved to database
        if (res.statusCode >= 400 || (req as any).piiDetected?.length > 0) {
          console.log('Audit log (important):', auditLog);
        }
      });

      next();
    };
  }
}

export { SecurityMiddleware, type SecurityConfig };