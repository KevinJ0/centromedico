const { test } = require('@playwright/test');

test('Capturar vista movil y tablet del hero', async ({ page }) => {
  // Mobile
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'e2e/screenshots/home-hero-mobile.png', fullPage: false });

  // Tablet
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto('/');
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'e2e/screenshots/home-hero-tablet.png', fullPage: false });
});
