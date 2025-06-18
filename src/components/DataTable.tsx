import React, { useState, useMemo } from 'react';
import { FieldConfig } from '../config/fields';
import * as XLSX from 'xlsx';
import { Trash2 } from 'lucide-react';

interface DataTableProps {
  fields: FieldConfig[];
  rows: { [key: string]: any }[];
  // เพิ่ม removeRow ให้เป็น optional หรือ required ตามต้องการ
  removeRow?: (index: number) => void;
}

const DataTable: React.FC<DataTableProps> = ({ fields, rows, removeRow }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  // กรองและเรียงข้อมูล
  const filteredRows = useMemo(() => {
    let filtered = rows;
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      filtered = filtered.filter(row =>
        fields.some(field => {
          const cell = row[field.key];
          // guard: ถ้า cell เป็น undefined หรือ null
          return String(cell ?? '').toLowerCase().includes(lower);
        })
      );
    }
    if (sortConfig) {
      filtered = [...filtered].sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        // เปรียบเทียบแบบพื้นฐาน (string/number)
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [rows, searchTerm, sortConfig, fields]);

  // sort handler
  const handleSort = (key: string) => {
    setSortConfig(prev => {
      if (prev && prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  // Export filteredRows to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, 'exported_data.xlsx');
  };

  return (
    <div>
      {/* Search + Export */}
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
          className="flex items-center bg-green-600 hover:from-green-500 hover:to-green-700 text-white font-medium px-4 py-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-300 transition"
        >
          Export to Excel
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {fields.map(field => (
                <th
                  key={field.key}
                  onClick={() => handleSort(field.key)}
                  className="cursor-pointer border-b border-gray-200 px-4 py-2 text-left"
                >
                  <div className="flex items-center select-none">
                    {field.label}
                    {sortConfig?.key === field.key ? (
                      sortConfig.direction === 'asc' ? ' 🔼' : ' 🔽'
                    ) : null}
                  </div>
                </th>
              ))}
              {removeRow && (
                <th className="border-b border-gray-200 px-4 py-2 text-left">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredRows.length > 0 ? (
              filteredRows.map((row, idx) => {
                return (
                  <tr key={idx} className="border-t hover:bg-gray-50">
                    {fields.map(field => (
                      <td key={field.key} className="border px-4 py-2">
                        {row[field.key]}
                      </td>
                    ))}
                    {removeRow && (
                      <td className="border px-4 py-2">
                        <button
                          onClick={() => {
                            // หา global index: สมมติ rows ต้นฉบับไม่มีซ้ำกันในค่า key หลัก
                            // วิธีง่าย: หา index จาก rows.indexOf(row)
                            const globalIndex = rows.indexOf(row);
                            if (globalIndex !== -1) {
                              removeRow(globalIndex);
                            }
                          }}
                          className="text-red-500 hover:text-red-700"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={fields.length + (removeRow ? 1 : 0)}
                  className="text-center py-4 text-gray-500"
                >
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
