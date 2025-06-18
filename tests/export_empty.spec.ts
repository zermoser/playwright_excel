import { test, expect } from '@playwright/test';

test('Export when no data shows warning', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await page.click('button:has-text("Export Excel")');
  await expect(page.locator('text=ไม่มีข้อมูล')).toBeVisible();
});
