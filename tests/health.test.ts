import request from 'supertest';
import express from 'express';
import { registerHealth } from '../server/health';

describe('Health Endpoint', () => {
  let app: express.Express;

  beforeAll(() => {
    app = express();
    registerHealth(app);
  });

  it('should return healthy status', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);

    expect(response.body).toEqual({ ok: true });
  });

  it('should respond quickly', async () => {
    const start = Date.now();
    await request(app).get('/health');
    const duration = Date.now() - start;
    
    expect(duration).toBeLessThan(100); // Should respond in under 100ms
  });
});