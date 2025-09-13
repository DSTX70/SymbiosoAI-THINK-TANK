const fetch = require('node-fetch');
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

describe('Sprint 1 - Export + DLP', () => {
  test('clean export downloads with attachment header', async () => {
    const res = await fetch(`${BASE_URL}/api/export`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
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
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ filename: 'bad.txt', content: 'BEGIN RSA PRIVATE KEY' })
    });
    expect(res.status).toBe(400);
    const json = await res.json().catch(() => ({}));
    expect(json.error).toBe('DLP_BLOCK');
    expect(Array.isArray(json.hits)).toBe(true);
  });
});
