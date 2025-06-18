import { test, expect } from '@playwright/test';
import * as path from 'path';
import * as XLSX from 'xlsx';

const baseURL = 'http://localhost:5173';
const fixturePath = path.resolve(__dirname, 'fixtures/sample-data.xlsx');

test.beforeEach(async ({ page }) => {
  await page.goto(baseURL);
});

test('Import valid Excel file', async ({ page }) => {
  const [fileChooser] = await Promise.all([
    page.waitForEvent('filechooser'),
    page.click('label:has-text("Import Excel")'),
  ]);
  await fileChooser.setFiles(fixturePath);
  await expect(page.locator('text=นำเข้า')).toBeVisible();
  const workbook = XLSX.readFile(fixturePath);
  const rows = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
  await expect(page.locator('table tbody tr')).toHaveCount(rows.length);
});
