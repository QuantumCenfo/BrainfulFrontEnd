import { test, expect } from '@playwright/test';

test.describe('Forums CRUD', () => {
  test.beforeEach(async ({ page }) => {
    // Si no usas storageState aún, inicia sesión vía UI:
    await page.goto('/login');
    await page.getByTestId('login-email').fill('user@example.com');
    await page.getByTestId('login-password').fill('Password123!');
    await page.getByTestId('login-submit').click();
    await expect(page.locator('[data-testid="navbar-user"]')).toBeVisible();
  });

  test('create, read, update, delete post', async ({ page }) => {
    await page.goto('/forums');

    // CREATE
    await page.getByTestId('forum-new').click();
    const title = `Post ${Date.now()}`;
    await page.getByTestId('forum-title').fill(title);
    await page.getByTestId('forum-body').fill('Contenido inicial');
    await page.getByTestId('forum-save').click();

    // READ (ver en lista)
    const row = page.getByRole('row', { name: new RegExp(title, 'i') });
    await expect(row).toBeVisible();

    // UPDATE
    await row.getByTestId('forum-edit').click();
    await page.getByTestId('forum-body').fill('Contenido actualizado');
    await page.getByTestId('forum-save').click();
    await expect(page.getByText('Contenido actualizado')).toBeVisible();

    // DELETE
    await row.getByTestId('forum-delete').click();
    await page.getByRole('button', { name: /confirmar|sí|ok/i }).click(); // ajusta al diálogo real
    await expect(page.getByText(title)).toHaveCount(0);
  });
});
