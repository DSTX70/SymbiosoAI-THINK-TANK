import request from 'supertest';
import { app } from '../src/server';

describe('Demo flow smoke', () => {
  const agent = request.agent(app);

  it('logs in as demo', async () => {
    const res = await agent
      .post('/api/demo-login')
      .send({ username: 'demo', password: 'demo123' })
      .expect(200);
    expect(res.body?.user?.email).toBe('demo@example.com');
  });

  it('runs Expert mode without workspace', async () => {
    await agent
      .post('/api/think')
      .send({ mode: 'expert', prompt: 'ping' })
      .expect(200);
  });
});