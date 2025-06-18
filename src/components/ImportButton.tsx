// src/components/ImportButton.tsx
import React from 'react';
import * as XLSX from 'xlsx';
import { FieldConfig } from '../config/fields';
import { validateRow } from '../utils/validators';
import { FilePlus } from 'lucide-react';
import { motion } from 'framer-motion';

interface ImportButtonProps {
  fields: FieldConfig[];
  onImport: (rows: Record<string, any>[]) => void;
  onError?: (errors: string[]) => void; // เพิ่ม callback สำหรับ error
}

const ImportButton: React.FC<ImportButtonProps> = ({ fields, onImport, onError }) => {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      // defval:'' เพื่อให้ key มีค่าแม้ cell ว่าง
      const rows: Record<string, any>[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
      const errors: string[] = [];
      const validRows: Record<string, any>[] = [];
      rows.forEach((row, index) => {
        const result = validateRow(row, fields);
        if (result.valid) {
          validRows.push(row);
        } else {
          // สร้างข้อความ error เช่น "Row 2: Email is not a valid email"
          errors.push(`Row ${index + 2}: ${result.errors.join(', ')}`);
        }
      });
      if (errors.length > 0) {
        if (onError) {
          onError(errors);
        }
      }
      if (validRows.length > 0) {
        onImport(validRows);
      }
    } catch (err) {
      console.error('Error reading Excel:', err);
      if (onError) {
        onError([`ไม่สามารถอ่านไฟล์ Excel: ${(err as Error).message}`]);
      }
    }
    // reset input เพื่อให้เลือกไฟล์เดิมอีกครั้งได้
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <input
        type="file"
        accept=".xlsx, .xls"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />
      <motion.button
        type="button"
        onClick={handleClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center bg-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-medium px-4 py-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
      >
        <FilePlus className="w-5 h-5 mr-2" />
        นำเข้า Excel
      </motion.button>
    </>
  );
};

export default ImportButton;
