import { test as base, expect, chromium } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const baseURL = 'http://localhost:5173';
const downloadDir = path.resolve(__dirname, './download_excel');
const userDataDir = path.resolve(__dirname, './.tmp-user-data');

function clearDownloadDir() {
  if (fs.existsSync(downloadDir)) {
    const files = fs.readdirSync(downloadDir);
    for (const file of files) {
      const filePath = path.join(downloadDir, file);
      if (fs.statSync(filePath).isFile()) {
        fs.unlinkSync(filePath);
      }
    }
  }
}

function clearUserDataDir() {
  if (fs.existsSync(userDataDir)) {
    fs.rmSync(userDataDir, { recursive: true, force: true });
  }
}

const test = base.extend<{}, { context: any; page: any }>({
  context: async ({ }, use) => {
    const context = await chromium.launchPersistentContext(userDataDir, {
      headless: false,
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

// ลบก่อนรันชุดเทสต์ทั้งหมด
test.beforeAll(() => {
  clearDownloadDir();
  clearUserDataDir();
});

test.afterAll(() => {
  clearUserDataDir();
});

test.beforeEach(async ({ page }) => {
  await page.goto(baseURL);
});

test('Full loop: add, export, download, delete, import back', async ({ page }) => {
  // --- STEP 1: Add a row ---
  await page.fill('input[name="firstName"]', 'Kittipoj');
  await page.fill('input[name="lastName"]', 'Mos');
  await page.fill('input[name="email"]', 'kittipoj.mos@example.com');
  await page.click('button:has-text("เพิ่ม")');
  await expect(page.locator('table tbody tr')).toHaveCount(1);

  // --- STEP 2: Export Excel ---
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.click('button:has-text("ส่งออก Excel")'),
  ]);
  const suggestedName = await download.suggestedFilename();
  const downloadPath = path.join(downloadDir, suggestedName);
  await download.saveAs(downloadPath);
  expect(fs.existsSync(downloadPath)).toBeTruthy();

  // --- STEP 3: Delete the row with text "Kittipoj" ---
  const rowToDelete = page.locator('table tbody tr').filter({ hasText: 'Kittipoj' });
  await rowToDelete.locator('button[title="Delete"], button:has-text("ลบ")').click();
  await expect(rowToDelete).toHaveCount(0);

  // --- STEP 4: Import Excel back ---
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles(downloadPath);
  await page.click('button:has-text("นำเข้า Excel")');

  // --- STEP 5: Verify row is back ---
  await expect(page.locator('table tbody tr')).toHaveCount(1);
});
