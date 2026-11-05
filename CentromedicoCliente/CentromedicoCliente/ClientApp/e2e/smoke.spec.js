const { test, expect } = require('@playwright/test');

test.describe('Hospital Salvador - Smoke Test', () => {
  test('Home page carga con título y elementos clave', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Hospital Salvador/i);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('Directorio Médico carga especialistas', async ({ page }) => {
    await page.goto('/medicos');
    await expect(page.locator('h1')).toContainText(/Directorio/i);
  });
});
