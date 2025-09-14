import request from 'supertest';
import express from 'express';
import { registerHealth } from '../server/health';

describe('Health endpoint', () => {
  let app: express.Express;

  beforeAll(() => {
    app = express();
    registerHealth(app);
  });

  it('responds 200 OK with { ok: true }', async () => {
    const res = await request(app).get('/health').expect(200);
    expect(res.body).toEqual({ ok: true });
  });

  it('should respond quickly for health checks', async () => {
    const start = Date.now();
    await request(app).get('/health');
    const duration = Date.now() - start;
    
    expect(duration).toBeLessThan(100); // Should respond in under 100ms
  });
});