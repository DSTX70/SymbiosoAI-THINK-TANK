import { Request, Response, NextFunction } from 'express';

/**
 * Baseline DLP check:
 * - Blocks obvious P0 patterns: SSNs, credit cards, secrets keywords, emails (optional)
 * Adjust to your policy. Returns 400 with matches if blocked.
 */
const P0_PATTERNS: Array<[string, RegExp]> = [
  ['ssn', /\b\d{3}-\d{2}-\d{4}\b/],
  ['credit_card', /\b(?:\d[ -]*?){13,16}\b/],
  ['secret_keyword', /\b(AWS_SECRET_ACCESS_KEY|PRIVATE_KEY|BEGIN RSA PRIVATE KEY)\b/],
];

export function dlpScan(content: string) {
  const hits: string[] = [];
  for (const [name, rx] of P0_PATTERNS) {
    if (rx.test(content)) hits.push(name);
  }
  return hits;
}

export function dlpMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    const hits = dlpScan(body || '');
    if (hits.length) {
      return res.status(400).json({ error: 'DLP_BLOCK', hits });
    }
    next();
  } catch (e) {
    next();
  }
}
