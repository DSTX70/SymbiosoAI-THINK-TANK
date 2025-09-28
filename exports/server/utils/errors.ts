// Sprint 8 - Standard error envelopes and taxonomy
export interface ErrorEnvelope {
  error: {
    code: string;
    message: string;
    type: 'validation' | 'authentication' | 'authorization' | 'not_found' | 'rate_limit' | 'internal' | 'external_service' | 'circuit_breaker';
    details?: Record<string, any>;
    requestId?: string;
    timestamp: string;
  };
}

export class AppError extends Error {
  constructor(
    public code: string,
    public message: string,
    public type: ErrorEnvelope['error']['type'],
    public statusCode: number = 500,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppError';
  }

  toEnvelope(requestId?: string): ErrorEnvelope {
    return {
      error: {
        code: this.code,
        message: this.message,
        type: this.type,
        details: this.details,
        requestId,
        timestamp: new Date().toISOString()
      }
    };
  }
}

// Pre-defined error types
export const ErrorCodes = {
  // Authentication & Authorization
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  ACCESS_DENIED: 'ACCESS_DENIED',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  
  // Validation
  INVALID_INPUT: 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',
  INVALID_FORMAT: 'INVALID_FORMAT',
  
  // Resources
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  RESOURCE_ALREADY_EXISTS: 'RESOURCE_ALREADY_EXISTS',
  RESOURCE_CONFLICT: 'RESOURCE_CONFLICT',
  
  // Rate limiting
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  
  // External services
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
  CIRCUIT_BREAKER_OPEN: 'CIRCUIT_BREAKER_OPEN',
  
  // Internal
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  CONFIGURATION_ERROR: 'CONFIGURATION_ERROR'
} as const;

// Error factory functions
export function createValidationError(message: string, details?: Record<string, any>) {
  return new AppError(ErrorCodes.INVALID_INPUT, message, 'validation', 400, details);
}

export function createAuthenticationError(message: string = 'Authentication required') {
  return new AppError(ErrorCodes.INVALID_CREDENTIALS, message, 'authentication', 401);
}

export function createAuthorizationError(message: string = 'Access denied') {
  return new AppError(ErrorCodes.ACCESS_DENIED, message, 'authorization', 403);
}

export function createNotFoundError(resource: string) {
  return new AppError(ErrorCodes.RESOURCE_NOT_FOUND, `${resource} not found`, 'not_found', 404);
}

export function createRateLimitError(message: string = 'Rate limit exceeded') {
  return new AppError(ErrorCodes.RATE_LIMIT_EXCEEDED, message, 'rate_limit', 429);
}

export function createCircuitBreakerError(service: string) {
  return new AppError(
    ErrorCodes.CIRCUIT_BREAKER_OPEN, 
    `Service ${service} is temporarily unavailable`, 
    'circuit_breaker', 
    503
  );
}

export function createExternalServiceError(service: string, originalError: any) {
  return new AppError(
    ErrorCodes.EXTERNAL_SERVICE_ERROR,
    `External service error from ${service}`,
    'external_service',
    502,
    { service, originalError: originalError.message }
  );
}

export function createInternalError(message: string = 'Internal server error', details?: Record<string, any>) {
  return new AppError(ErrorCodes.INTERNAL_SERVER_ERROR, message, 'internal', 500, details);
}

// PII/Secret redaction for logging
export function redactSensitiveData(obj: any): any {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  const sensitiveKeys = [
    'password', 'token', 'secret', 'key', 'auth', 'credential',
    'ssn', 'social', 'credit', 'card', 'email', 'phone'
  ];

  const result = Array.isArray(obj) ? [] : {};

  for (const [key, value] of Object.entries(obj)) {
    const keyLower = key.toLowerCase();
    const shouldRedact = sensitiveKeys.some(sensitive => keyLower.includes(sensitive));

    if (shouldRedact) {
      (result as any)[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      (result as any)[key] = redactSensitiveData(value);
    } else {
      (result as any)[key] = value;
    }
  }

  return result;
}