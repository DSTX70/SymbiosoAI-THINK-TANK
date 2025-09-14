import request from 'supertest';
import { app } from '../src/server';

describe('Health endpoint', () => {
  it('returns 200 OK with { ok: true }', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });
});