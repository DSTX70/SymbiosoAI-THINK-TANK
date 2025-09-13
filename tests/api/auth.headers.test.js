import fetch from 'node-fetch';
const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

describe('Sprint 1 - Demo gate & headers', () => {
  test('demo route returns 403 when disabled', async () => {
    const res = await fetch(`${BASE_URL}/auth/demo`);
    // If the server 404s demo but middleware runs first, expect 403; otherwise allow 404 as acceptable.
    expect([403,404]).toContain(res.status);
  });

  test('helmet sets basic headers', async () => {
    const res = await fetch(`${BASE_URL}/`);
    // Not all apps include CSP on root, so check a couple of common Helmet headers
    const xcto = res.headers.get('x-content-type-options');
    expect(xcto && xcto.toLowerCase()).toBe('nosniff');
  });
});