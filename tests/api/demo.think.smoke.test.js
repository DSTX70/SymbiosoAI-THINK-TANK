import fetch from 'node-fetch';

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

async function attemptDemoLogin() {
  const res = await fetch(`${BASE_URL}/api/demo-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'demo', password: 'demo123' })
  });

  if (res.status === 404) {
    return { enabled: false, cookie: '' };
  }

  if (!res.ok) {
    throw new Error(`Demo login failed with status ${res.status}`);
  }

  const cookie = res.headers.get('set-cookie') || '';
  if (!cookie) {
    throw new Error('Demo login succeeded but no session cookie was returned');
  }

  return { enabled: true, cookie };
}

describe('Infra smoke - demo login + /api/think', () => {
  let demoEnabled = false;
  let authCookie = '';

  beforeAll(async () => {
    const result = await attemptDemoLogin();
    demoEnabled = result.enabled;
    authCookie = result.cookie;
  });

  test('demo login is available when enabled', async () => {
    if (!demoEnabled) {
      console.warn('Demo login disabled; skipping demo auth smoke test.');
      return;
    }

    expect(authCookie).toBeTruthy();
  });

  test('/api/think returns a response for simple mode', async () => {
    if (!demoEnabled) {
      console.warn('Demo login disabled; skipping /api/think smoke test.');
      return;
    }

    if (!process.env.OPENAI_API_KEY) {
      console.warn('OPENAI_API_KEY not set; skipping /api/think smoke test.');
      return;
    }

    const res = await fetch(`${BASE_URL}/api/think`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': authCookie
      },
      body: JSON.stringify({
        prompt: 'Smoke test: verify /api/think returns a response.',
        mode: 'simple'
      })
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toBeTruthy();
  }, 60000);
});
