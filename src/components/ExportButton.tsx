// src/components/ExportButton.tsx
import React from 'react';
import { FieldConfig } from '../config/fields';
import { exportToExcel } from '../utils/excelUtils';
import { Download } from 'lucide-react';
import { motion } from 'framer-motion';

interface ExportButtonProps {
  fields: FieldConfig[];
  rows: Record<string, any>[];
  onEmpty?: () => void; // callback เมื่อไม่มีข้อมูล
}

const ExportButton: React.FC<ExportButtonProps> = ({ fields, rows, onEmpty }) => {
  const handleExport = () => {
    if (rows.length === 0) {
      if (onEmpty) onEmpty();
      return;
    }
    exportToExcel(rows, fields);
  };

  return (
    <motion.button
      type="button"
      onClick={handleExport}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center bg-green-600 hover:from-green-500 hover:to-green-700 text-white font-medium px-4 py-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-300 transition"
    >
      <Download className="w-5 h-5 mr-2" />
      ส่งออก Excel
    </motion.button>
  );
};

export default ExportButton;
