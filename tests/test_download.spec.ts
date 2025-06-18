import { test as base, expect, chromium } from '@playwright/test';
import * as fsExtra from 'fs-extra';
import * as path from 'path';

const baseURL = 'http://localhost:5173';
const savedDir = path.resolve(__dirname, './download_excel');

const test = base.extend<{}, { context: any; page: any }>({
  context: async ({ }, use) => {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext({ acceptDownloads: true });
    await use(context);
    await context.close();
    await browser.close();
  },

  page: async ({ context }, use) => {
    const page = await context.newPage();
    await use(page);
    await page.close();
  },
});

test.beforeAll(() => {
  fsExtra.ensureDirSync(savedDir);
});

test.beforeEach(async ({ page }) => {
  await page.goto(baseURL);
});

test('test: download and save permanently', async ({ page }) => {
  await page.fill('input[name="firstName"]', 'ddd');
  await page.fill('input[name="lastName"]', 'eiei');
  await page.fill('input[name="email"]', 'zzz.kiki@example.com');
  await page.click('button:has-text("เพิ่ม")');
  await expect(page.locator('table tbody tr')).toHaveCount(1);

  // รอโหลดดาวน์โหลด และเก็บไฟล์ถาวรด้วย saveAs()
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.click('button:has-text("ส่งออก Excel")'),
  ]);

  const permanentPath = path.join(savedDir, 'download_test.xlsx');

  await download.saveAs(permanentPath);

  expect(fsExtra.existsSync(permanentPath)).toBeTruthy();

  console.log('ไฟล์ถูกเซฟที่:', permanentPath);
});
