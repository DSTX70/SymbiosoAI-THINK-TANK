import fetch from 'node-fetch';
import * as EventSourceModule from 'eventsource';
const EventSource = EventSourceModule.default || EventSourceModule;

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

describe('Sprint 1 - Queue + SSE', () => {
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

  test('enqueue and stream to completion', async () => {
    const enqueueRes = await fetch(`${BASE_URL}/api/debates-async`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': authCookies
      },
      body: JSON.stringify({ sessionId: 'test-session', mode: 'guided', prompt: 'Test prompt' })
    });
    expect(enqueueRes.status).toBe(200);
    const { jobId } = await enqueueRes.json();
    expect(jobId).toBeTruthy();

    const url = `${BASE_URL}/api/debates-async/${jobId}/stream`;
    const es = new EventSource(url, {
      headers: {
        'Cookie': authCookies
      }
    });

    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('SSE timeout')), 40000);
      es.addEventListener('completed', (e) => {
        clearTimeout(timer);
        es.close();
        expect(e.data).toBeTruthy();
        resolve();
      });
      es.addEventListener('failed', (e) => {
        clearTimeout(timer);
        es.close();
        reject(new Error('Job failed'));
      });
      es.onerror = (err) => {
        clearTimeout(timer);
        es.close();
        reject(err);
      };
    });
  });
});