import React from 'react';
import { FieldConfig } from '../config/fields';
import { exportToExcel } from '../utils/excelUtils';

interface ExportButtonProps {
  fields: FieldConfig[];
  rows: Record<string, any>[];
}

const ExportButton: React.FC<ExportButtonProps> = ({ fields, rows }) => {
  const handleExport = () => {
    if (rows.length === 0) {
      return;
    }
    exportToExcel(rows, fields);
  };
  return (
    <button onClick={handleExport} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
      Export Excel
    </button>
  );
};

export default ExportButton;
