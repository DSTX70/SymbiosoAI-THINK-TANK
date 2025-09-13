import { test, expect } from '@playwright/test';

test('Demo gate blocks demo route in prod', async ({ page, baseURL }) => {
  const res = await page.goto('/auth/demo');
  expect([403,404]).toContain(res?.status() ?? 0);
});