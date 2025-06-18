import ExcelJS from 'exceljs';
import path from 'path';

async function generateSample() {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Sheet1');
  sheet.columns = [
    { header: 'firstName', key: 'firstName', width: 20 },
    { header: 'lastName', key: 'lastName', width: 20 },
    { header: 'email', key: 'email', width: 30 },
  ];
  sheet.addRow({ firstName: 'Mos', lastName: 'eiei', email: 'mos@example.com' });
  sheet.addRow({ firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com' });
  sheet.addRow({ firstName: 'Bob', lastName: 'Johnson', email: 'bob.johnson@example.com' });
  const outPath = path.resolve(__dirname, '../tests/fixtures/sample-data.xlsx');
  await workbook.xlsx.writeFile(outPath);
  console.log(`Sample data written to ${outPath}`);
}

generateSample().catch(console.error);
