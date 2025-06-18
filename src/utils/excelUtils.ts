import * as XLSX from 'xlsx';

export function exportToExcel(rows: Record<string, any>[], fields: { key: string; label: string }[], fileName = 'exported_data.xlsx') {
  const header = fields.map(f => f.key);
  const dataRows = rows.map(row => header.map(key => row[key] ?? ''));
  const worksheet = XLSX.utils.aoa_to_sheet([header, ...dataRows]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], { type: 'application/octet-stream' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(link.href);
}
