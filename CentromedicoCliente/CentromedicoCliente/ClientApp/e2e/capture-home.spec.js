const { test } = require('@playwright/test');

test('Capturar pantalla completa de Home', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'e2e/screenshots/home-hero.png', fullPage: false });
  await page.screenshot({ path: 'e2e/screenshots/home-full.png', fullPage: true });
});
