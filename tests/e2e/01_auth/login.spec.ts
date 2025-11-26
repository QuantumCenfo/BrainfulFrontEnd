import { test, expect } from '@playwright/test';

test.describe('Auth', () => {
  test('login with valid credentials', async ({ page }) => {
    await page.goto('/login'); // ajusta a la ruta real
    await page.getByTestId('login-email').fill('super.admin@gmail.com');
    await page.getByTestId('login-password').fill('superadmin123');
    await page.getByTestId('login-submit').click();

    // espera un elemento post-login (navbar usuario, avatar, etc.)
    await expect(page.locator('[data-testid="navbar-user"], .avatar, .logout')).toBeVisible();
  });
});
