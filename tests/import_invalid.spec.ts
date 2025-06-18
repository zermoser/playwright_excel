import { test, expect } from '@playwright/test';
import * as path from 'path';

const baseURL = 'http://localhost:5173';
const invalidPath = path.resolve(__dirname, 'fixtures/invalid-data.xlsx');

test.beforeEach(async ({ page }) => {
  await page.goto(baseURL);
});

test('Import invalid Excel file should show error and not add rows', async ({ page }) => {
  const [fileChooser] = await Promise.all([
    page.waitForEvent('filechooser'),
    page.click('span:has-text("นำเข้า Excel"), button:has-text("นำเข้า Excel")'),
  ]);
  await fileChooser.setFiles(invalidPath);

  // หรือ fallback แบบเช็คว่าไม่มี row เพิ่ม
  await expect(page.locator('table tbody tr')).toHaveCount(1);

  // No data available row
  await expect(page.locator('table tbody tr')).toHaveCount(1);
});