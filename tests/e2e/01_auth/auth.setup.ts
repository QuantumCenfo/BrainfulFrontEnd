// tests/e2e/01_auth/auth.setup.ts
import { test, expect } from '@playwright/test';
import fs from 'node:fs/promises';

// Ajusta estas credenciales a un usuario válido de tu app:
const EMAIL = process.env.E2E_EMAIL || 'user@example.com';
const PASS  = process.env.E2E_PASS  || 'Password123!';

// Utilitarios de selectores “resistentes”: intentan varias estrategias.
async function fillEmail(page, value: string) {
  const candidates = [
    page.getByTestId('login-email'),
    page.getByLabel(/email|correo/i),
    page.getByPlaceholder(/email|correo/i),
    page.locator('input[type="email"]'),
    page.locator('input[name*="email" i]'),
  ];
  for (const c of candidates) {
    if (await c.first().isVisible().catch(() => false)) { await c.fill(value); return; }
    // intenta esperar unos ms por si aparece tarde
    try { await c.first().waitFor({ timeout: 1000 }); await c.fill(value); return; } catch {}
  }
  throw new Error('No encontré el input de email en la pantalla de login');
}

async function fillPassword(page, value: string) {
  const candidates = [
    page.getByTestId('login-password'),
    page.getByLabel(/contraseña|password|clave/i),
    page.getByPlaceholder(/contraseña|password|clave/i),
    page.locator('input[type="password"]'),
    page.locator('input[name*="pass" i]'),
  ];
  for (const c of candidates) {
    if (await c.first().isVisible().catch(() => false)) { await c.fill(value); return; }
    try { await c.first().waitFor({ timeout: 1000 }); await c.fill(value); return; } catch {}
  }
  throw new Error('No encontré el input de contraseña en la pantalla de login');
}

async function clickLogin(page) {
  const candidates = [
    page.getByTestId('login-submit'),
    page.getByRole('button', { name: /iniciar sesión|entrar|acceder|login/i }),
    page.locator('button[type="submit"]'),
    page.locator('button:has-text("Login"), button:has-text("Sign In")'),
  ];
  for (const c of candidates) {
    if (await c.first().isVisible().catch(() => false)) { await c.click(); return; }
    try { await c.first().waitFor({ timeout: 1000 }); await c.click(); return; } catch {}
  }
  throw new Error('No encontré el botón para iniciar sesión');
}

test('bootstrap session', async ({ page, context, baseURL }) => {
  // 1) Ir al login (si no sabes la ruta exacta, navega al home y busca un enlace de login)
  await page.goto(baseURL!);
  // intenta ir directo a /login; si 404, ignora
  try { await page.goto('/login'); } catch {}

  // Si no estamos en login, intenta abrirlo desde la navbar
  if (!/login/i.test(await page.url())) {
    const navLogin = page.getByRole('link', { name: /login|iniciar sesión|acceder/i });
    if (await navLogin.isVisible().catch(() => false)) {
      await navLogin.click();
    }
  }

  // 2) Completar credenciales y enviar
  await fillEmail(page, EMAIL);
  await fillPassword(page, PASS);
  await clickLogin(page);

  // 3) Espera una señal inequívoca de sesión iniciada (ajusta a tu UI)
  // Navbar con usuario, botón logout, o redirección a ruta protegida:
  const loggedInMarker = [
    page.getByTestId('navbar-user'),
    page.getByRole('button', { name: /logout|salir/i }),
    page.getByRole('link', { name: /forums|foros/i }),
  ];
  let ok = false;
  for (const m of loggedInMarker) {
    try { await m.first().waitFor({ timeout: 5000 }); ok = true; break; } catch {}
  }
  if (!ok) throw new Error('No pude confirmar que el login fue exitoso');

  // 4) Guardar estado para todos los proyectos
  await context.storageState({ path: 'storage/state.json' });
  await fs.mkdir('storage', { recursive: true });
});
