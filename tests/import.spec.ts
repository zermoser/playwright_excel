import { test, expect } from '@playwright/test';
import * as path from 'path';
import * as XLSX from 'xlsx';

const baseURL = 'http://localhost:5173';
const fixturePath = path.resolve(__dirname, 'fixtures/sample-data.xlsx');

test.beforeEach(async ({ page }) => {
  await page.goto(baseURL);
});

test('Import valid Excel file', async ({ page }) => {
  // คลิกปุ่ม Import
  const [fileChooser] = await Promise.all([
    page.waitForEvent('filechooser'),
    page.click('button:has-text("นำเข้า Excel")'),
  ]);
  await fileChooser.setFiles(fixturePath);

  // รอ Notification แบบ regex ว่า “นำเข้า <number> แถวสำเร็จ”
  // ปรับ timeout ถ้าใช้เวลานานหน่อย
  await expect(page.locator('text=/^นำเข้า \\d+ แถวสำเร็จ$/')).toBeVisible({ timeout: 5000 });

  // ตรวจจำนวนแถวใน table เทียบกับไฟล์
  const workbook = XLSX.readFile(fixturePath);
  const rows = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
  await expect(page.locator('table tbody tr')).toHaveCount(rows.length);
});
