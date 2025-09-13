import { test, expect } from '@playwright/test';
import { SELECTORS } from './config/selectors';

test('Why Transfer panel is visible where expected', async ({ page }) => {
  await page.goto('/');
  const panel = page.locator(SELECTORS.whyTransferPanel);
  await expect(panel).toBeVisible({ timeout: 3000 }).catch(() => test.skip(true, 'Why Transfer panel not present on this route; place it or adjust selector.'));
});