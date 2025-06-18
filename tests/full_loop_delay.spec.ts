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
      headless: false,
      downloadsPath: downloadDir,
      viewport: { width: 500, height: 800 },
    });
    await use(context);
    await context.close();
  },

  page: async ({ context }, use) => {
    const page = await context.newPage();
    await page.setViewportSize({ width: 500, height: 800 });
    await use(page);
    await page.close();
  },
});

// เพิ่ม timeout สำหรับไฟล์นี้ 60 วินาที
test.setTimeout(60000);

// Navigate before each test
test.beforeEach(async ({ page }) => {
  await page.goto(baseURL);
});

test('Full loop: add, export, download, delete, import back', async ({ page }) => {
  // --- STEP 1: Add a row ---
  await page.fill('input[name="firstName"]', 'Kittipoj');
  await page.waitForTimeout(3000);
  await page.fill('input[name="lastName"]', 'Mos');
  await page.waitForTimeout(3000);
  await page.fill('input[name="email"]', 'kittipoj.mos@example.com');
  await page.waitForTimeout(3000);
  await page.click('button:has-text("เพิ่ม")');
  await page.waitForTimeout(3000);
  await expect(page.locator('table tbody tr')).toHaveCount(1);
  await page.waitForTimeout(3000);

  // --- STEP 2: Export Excel ---
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.click('button:has-text("ส่งออก Excel")'),
  ]);
  const suggestedName = await download.suggestedFilename();
  await page.waitForTimeout(3000);
  const downloadPath = path.join(downloadDir, suggestedName);
  await page.waitForTimeout(3000);
  await download.saveAs(downloadPath);
  await page.waitForTimeout(3000);
  expect(fs.existsSync(downloadPath)).toBeTruthy();

  // --- STEP 3: Delete the row with text "Kittipoj" ---
  const rowToDelete = page.locator('table tbody tr').filter({ hasText: 'Kittipoj' });
  await page.waitForTimeout(3000);
  await rowToDelete.locator('button[title="Delete"], button:has-text("ลบ")').click();
  await page.waitForTimeout(3000);
  await expect(rowToDelete).toHaveCount(0);
  await page.waitForTimeout(3000);

  // --- STEP 4: Import Excel back ---
  const fileInput = page.locator('input[type="file"]');
  await page.waitForTimeout(3000);
  await fileInput.setInputFiles(downloadPath);
  await page.waitForTimeout(3000);
  await page.click('button:has-text("นำเข้า Excel")');
  await page.waitForTimeout(3000);

  // --- STEP 5: Verify row is back ---
  await expect(page.locator('table tbody tr')).toHaveCount(1);
});
