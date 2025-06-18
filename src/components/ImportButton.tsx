import React from 'react';
import * as XLSX from 'xlsx';
import { FieldConfig } from '../config/fields';
import { validateRow } from '../utils/validators';

interface ImportButtonProps {
  fields: FieldConfig[];
  onImport: (rows: Record<string, any>[]) => void;
}

const ImportButton: React.FC<ImportButtonProps> = ({ fields, onImport }) => {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const rows: Record<string, any>[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
      const errors: string[] = [];
      const validRows: Record<string, any>[] = [];
      rows.forEach((row, index) => {
        const result = validateRow(row, fields);
        if (result.valid) {
          validRows.push(row);
        } else {
          errors.push(`Row ${index + 2}: ${result.errors.join(', ')}`);
        }
      });
      if (errors.length > 0) {
        console.error('Import errors:', errors);
      }
      if (validRows.length > 0) {
        onImport(validRows);
      }
    } catch (err) {
      console.error('Error reading Excel:', err);
    }
    e.target.value = '';
  };

  return (
    <label className="inline-block">
      <input type="file" accept=".xlsx, .xls" className="hidden" onChange={handleFileChange} />
      <span className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-green-600">
        Import Excel
      </span>
    </label>
  );
};

export default ImportButton;
