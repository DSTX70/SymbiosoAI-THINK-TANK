const fetch = require('node-fetch');
const EventSource = require('eventsource');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

describe('Sprint 1 - Queue + SSE', () => {
  test('enqueue and stream to completion', async () => {
    const enqueueRes = await fetch(`${BASE_URL}/api/debates`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ sessionId: 'test-session', mode: 'guided', prompt: 'Test prompt' })
    });
    expect(enqueueRes.status).toBe(200);
    const { jobId } = await enqueueRes.json();
    expect(jobId).toBeTruthy();

    const url = `${BASE_URL}/api/debates/${jobId}/stream`;
    const es = new EventSource(url);

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
