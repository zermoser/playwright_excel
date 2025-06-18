import { test, expect } from '@playwright/test';

test('Manual form add, search, sort, delete', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // Add 2 rows
  await page.fill('input[name="firstName"]', 'Kittipoj');
  await page.fill('input[name="lastName"]', 'B');
  await page.fill('input[name="email"]', 'a.b@example.com');
  await page.click('button:has-text("เพิ่ม")');

  await page.fill('input[name="firstName"]', 'C');
  await page.fill('input[name="lastName"]', 'D');
  await page.fill('input[name="email"]', 'c.d@example.com');
  await page.click('button:has-text("เพิ่ม")');

  // Search "A"
  await page.fill('input[placeholder="Search..."]', 'Kittipoj');
  await expect(page.locator('table tbody tr')).toHaveCount(1);

  // Clear search
  await page.fill('input[placeholder="Search..."]', '');
  await page.locator('input[placeholder="Search..."]').press('Tab');
  await expect(page.locator('table tbody tr')).toHaveCount(2);

  // Delete row with "A"
  const rowToDelete = page.locator('table tbody tr').filter({ hasText: 'Kittipoj' });
  await rowToDelete.locator('button[title="Delete"], button:has-text("Delete")').click();

  // Wait until row disappears
  await expect(rowToDelete).toHaveCount(0);

  // Final check
  await expect(page.locator('table tbody tr')).toHaveCount(1);
});
