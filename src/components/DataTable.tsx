import React, { useState, useMemo } from 'react';
import { FieldConfig } from '../config/fields';
import * as XLSX from 'xlsx';

interface DataTableProps {
  fields: FieldConfig[];
  rows: { [key: string]: any }[];
}

const DataTable: React.FC<DataTableProps> = ({ fields, rows }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const filteredRows = useMemo(() => {
    let filtered = rows;
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      filtered = filtered.filter(row =>
        fields.some(field => String(row[field.key]).toLowerCase().includes(lower))
      );
    }
    if (sortConfig) {
      filtered = [...filtered].sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [rows, searchTerm, sortConfig, fields]);

  const handleSort = (key: string) => {
    setSortConfig(prev => {
      if (prev && prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, 'exported_data.xlsx');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="border rounded p-2 w-full max-w-sm"
        />
        <button
          onClick={exportToExcel}
          className="ml-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Export to Excel
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr>
              {fields.map(field => (
                <th
                  key={field.key}
                  onClick={() => handleSort(field.key)}
                  className="cursor-pointer border px-4 py-2"
                >
                  {field.label}
                  {sortConfig?.key === field.key ? (sortConfig.direction === 'asc' ? ' 🔼' : ' 🔽') : ''}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row, idx) => (
              <tr key={idx} className="border-t">
                {fields.map(field => (
                  <td key={field.key} className="border px-4 py-2">
                    {row[field.key]}
                  </td>
                ))}
              </tr>
            ))}
            {filteredRows.length === 0 && (
              <tr>
                <td colSpan={fields.length} className="text-center py-4">
                  No data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
