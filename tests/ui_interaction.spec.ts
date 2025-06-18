import { test, expect } from '@playwright/test';

test('Manual form add, search, sort, delete', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await page.fill('input[name="firstName"]', 'A');
  await page.fill('input[name="lastName"]', 'B');
  await page.fill('input[name="email"]', 'a.b@example.com');
  await page.click('button:has-text("Submit")');
  await page.fill('input[name="firstName"]', 'C');
  await page.fill('input[name="lastName"]', 'D');
  await page.fill('input[name="email"]', 'c.d@example.com');
  await page.click('button:has-text("Submit")');
  await page.fill('input[placeholder="Search..."]', 'A');
  await expect(page.locator('table tbody tr')).toHaveCount(1);
  await page.click('th:has-text("First Name")');
  await page.click('button:has-text("Delete")');
  await expect(page.locator('table tbody tr')).toHaveCount(1);
});
