import { test, expect } from '@playwright/test';
import * as XLSX from 'xlsx';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:5173');
});

test('Export when table has data', async ({ page }) => {
  await page.fill('input[name="firstName"]', 'Test');
  await page.fill('input[name="lastName"]', 'User');
  await page.fill('input[name="email"]', 'test.user@example.com');
  await page.click('button:has-text("เพิ่ม")');
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.click('button:has-text("ส่งออก Excel"), button:has-text("Export Excel")'),
  ]);
  const pathDownloaded = await download.path();
  const workbook = XLSX.readFile(pathDownloaded!);
  const rows = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
  expect(rows.length).toBeGreaterThan(0);
  expect(rows[0].firstName).toBe('Test');
});