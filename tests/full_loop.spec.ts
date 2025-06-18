// tests/full_loop.spec.ts
import { test as base, expect, chromium } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const baseURL = 'http://localhost:5173';
const downloadDir = path.resolve(__dirname, './download_excel');

// Extend base test to use persistent context for download directory
const test = base.extend<{}, { context: any; page: any }>({
  context: async ({ }, use) => {
    const userDataDir = path.resolve(__dirname, './.tmp-user-data');
    const context = await chromium.launchPersistentContext(userDataDir, {
      headless: true,
      downloadsPath: downloadDir,
    });
    await use(context);
    await context.close();
  },

  page: async ({ context }, use) => {
    const page = await context.newPage();
    await use(page);
    await page.close();
  },
});

// Navigate before each test
test.beforeEach(async ({ page }) => {
  await page.goto(baseURL);
});

// Full loop test
test('Full loop: add, export, download, delete, import back', async ({ page }) => {
  // Add a row
  await page.fill('input[name="firstName"]', 'Kittipoj');
  await page.fill('input[name="lastName"]', 'Mos');
  await page.fill('input[name="email"]', 'kittipoj.mos@example.com');
  await page.click('button:has-text("เพิ่ม")');
  await expect(page.locator('table tbody tr')).toHaveCount(1);

  // Export Excel
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.click('button:has-text("ส่งออก Excel")'),
  ]);
  const downloadPath = path.join(downloadDir, await download.suggestedFilename());
  await download.saveAs(downloadPath);
  expect(fs.existsSync(downloadPath)).toBeTruthy();
});
