const { test, expect } = require('@playwright/test');

test('Hero search and chips navigation works properly', async ({ page }) => {
  await page.goto('/');

  // Check that the Hero search input is present
  const searchInput = page.locator('#hero-search-name');
  await expect(searchInput).toBeVisible();

  // Test typing a name and clicking Buscar
  await searchInput.fill('Martínez');
  const searchBtn = page.locator('.hero-search-dock__btn');
  await searchBtn.click();

  // Verify navigation to /medicos with query params
  await page.waitForURL(/.*medicos.*/);
  expect(page.url()).toContain('nombre=Mart%C3%ADnez');

  // Navigate back to home
  await page.goto('/');

  // Test clicking a quick chip (e.g. first specialty chip)
  const firstChip = page.locator('.hero-chip').first();
  await expect(firstChip).toBeVisible();
  await firstChip.click();

  // Verify navigation to /medicos with especialidad param
  await page.waitForURL(/.*medicos.*/);
  expect(page.url()).toContain('especialidad=');
});
