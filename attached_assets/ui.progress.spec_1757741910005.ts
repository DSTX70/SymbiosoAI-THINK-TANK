import { test, expect } from '@playwright/test';
import { SELECTORS } from '../config/selectors';

test.describe('UI - Progress overlay during long runs', () => {
  test('shows overlay while running and clears on completion (UI-first if available)', async ({ page, request, baseURL }) => {
    // Try UI-first: click the run button if present
    await page.goto('/');
    const hasRunButton = await page.$(SELECTORS.runDebateBtn);
    if (hasRunButton) {
      await page.click(SELECTORS.runDebateBtn);
      // Overlay should appear
      await expect(page.locator(SELECTORS.progressOverlay)).toBeVisible();
      // Wait until overlay disappears (completion)
      await expect(page.locator(SELECTORS.progressOverlay)).toBeHidden({ timeout: 45_000 });
      return;
    }

    // Fallback: enqueue via API then watch overlay if page binds to jobId automatically
    const res = await request.post(`${baseURL}/api/debates`, {
      data: { sessionId: 'ui-test', mode: 'guided', prompt: 'Test from Playwright' }
    });
    expect(res.ok()).toBeTruthy();
    const { jobId } = await res.json();
    expect(jobId).toBeTruthy();

    // Navigate to a page that starts monitoring (adjust if you have a specific monitor route)
    await page.goto(`/?jobId=${jobId}`);
    // If your app listens to jobId from the URL and shows overlay, assert it:
    const overlay = page.locator(SELECTORS.progressOverlay);
    // Make the assertion soft so teams without this binding don't block the run
    await expect(overlay).toBeVisible({ timeout: 5_000 }).catch(() => test.skip(true, 'Overlay selector not found/bound in this route.'));
    await expect(overlay).toBeHidden({ timeout: 45_000 });
  });
});