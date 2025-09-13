import fetch from 'node-fetch';
const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

describe('Sprint 1 - Export + DLP', () => {
  let authCookies = '';

  beforeAll(async () => {
    // Login with demo credentials to get auth cookies
    const loginRes = await fetch(`${BASE_URL}/api/demo-login`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ username: 'demo', password: 'demo123' })
    });
    
    if (loginRes.ok) {
      const setCookieHeader = loginRes.headers.get('set-cookie');
      if (setCookieHeader) {
        authCookies = setCookieHeader;
      }
    }
  });

  test('clean export downloads with attachment header', async () => {
    const res = await fetch(`${BASE_URL}/api/export`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': authCookies
      },
      body: JSON.stringify({ filename: 'ok-name.txt', content: 'hello world' })
    });
    expect(res.status).toBe(200);
    const disp = res.headers.get('content-disposition') || '';
    expect(disp.toLowerCase()).toContain('attachment;');
    const buf = await res.buffer();
    expect(buf.length).toBeGreaterThan(0);
  });

  test('DLP blocks P0 content', async () => {
    const res = await fetch(`${BASE_URL}/api/export`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': authCookies
      },
      body: JSON.stringify({ filename: 'bad.txt', content: 'BEGIN RSA PRIVATE KEY' })
    });
    expect(res.status).toBe(400);
    const json = await res.json().catch(() => ({}));
    expect(json.error).toBe('DLP_BLOCK');
    expect(Array.isArray(json.hits)).toBe(true);
  });
});