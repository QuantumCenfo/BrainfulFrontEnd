import { test, expect } from '@playwright/test';

test('Home loading', async ({ page }) => {
  await page.goto('/');                
  await expect(page).toHaveTitle(/.+/);
});
