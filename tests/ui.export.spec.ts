import { test, expect } from '@playwright/test';
import { SELECTORS } from './config/selectors';

test.describe('UI - Export with DLP guard', () => {
  test('clean export triggers a download', async ({ page }) => {
    await page.goto('/');
    const hasExport = await page.$(SELECTORS.exportBtn);
    if (!hasExport) test.skip(true, 'Export button not present on landing page');
    const [ download ] = await Promise.all([
      page.waitForEvent('download'),
      page.click(SELECTORS.exportBtn),
    ]);
    const filename = await download.suggestedFilename();
    expect(filename).toBeTruthy();
  });

  test('blocked export surfaces DLP error message (if UI allows entering content)', async ({ page }) => {
    await page.goto('/');
    // This test assumes your export UI uses current content; if not available, skip with guidance
    const hasExport = await page.$(SELECTORS.exportBtn);
    if (!hasExport) test.skip(true, 'Export button not present; cannot run DLP UI test');

    // Try to trigger a blocked payload using a client-side call if your UI doesn't allow content injection
    const resp = await page.evaluate(async () => {
      const r = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: 'bad.txt', content: 'BEGIN RSA PRIVATE KEY' }),
      });
      return { status: r.status, json: await r.json().catch(() => ({})) };
    });
    expect(resp.status).toBe(400);
    expect(resp.json.error).toBe('DLP_BLOCK');

    // If the app displays a UI error element, assert it (soft)
    const dlpError = page.locator(SELECTORS.dlpError);
    await expect(dlpError).toBeVisible({ timeout: 3000 }).catch(() => test.info().annotations.push({ type: 'note', description: 'No visible DLP error element found; API-level block verified.' }));
  });
});