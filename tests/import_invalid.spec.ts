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
    page.click('label:has-text("Import Excel")'),
  ]);
  await fileChooser.setFiles(invalidPath);
  await expect(page.locator('text=is not a valid')).toBeVisible();
  await expect(page.locator('table tbody tr')).toHaveCount(1);
});
