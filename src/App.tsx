// src/App.tsx
import React from 'react';
import DataForm from './components/DataForm';
import DataTable from './components/DataTable';
import ImportButton from './components/ImportButton';
import ExportButton from './components/ExportButton';
import Notification from './components/Notification';
import { fields } from './config/fields';
import { useDataRows } from './components/hooks/useDataRows';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, FileMinus } from 'lucide-react';

const App: React.FC = () => {
  const { rows, addRow, addRows, clearRows, removeRow } = useDataRows([]);
  const [notification, setNotification] = React.useState<{
    message: string;
    type: 'success' | 'error' | 'warning';
  } | null>(null);

  // ฟังก์ชันจัดการเมื่อกรอกฟอร์มสำเร็จ
  const handleSubmit = (row: Record<string, any>) => {
    addRow(row);
    setNotification({ message: 'เพิ่มข้อมูลสำเร็จ', type: 'success' });
  };

  // ฟังก์ชันจัดการเมื่อ import Excel สำเร็จ
  const handleImport = (importedRows: Record<string, any>[]) => {
    addRows(importedRows);
    setNotification({ message: `นำเข้า ${importedRows.length} แถวสำเร็จ`, type: 'success' });
  };

  // ฟังก์ชันเรียกเมื่อ export แต่ไม่มีข้อมูล
  const handleExportEmpty = () => {
    setNotification({ message: 'ไม่มีข้อมูลให้ส่งออก', type: 'warning' });
  };

  // ฟังก์ชันล้างข้อมูลทั้งหมด
  const handleClearAll = () => {
    clearRows();
    setNotification({ message: 'ล้างข้อมูลสำเร็จ', type: 'warning' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center mb-6"
        >
          <Database className="w-8 h-8 text-blue-600 mr-2" />
          <h1 className="text-3xl font-extrabold text-gray-800">Excel Data Import Demo</h1>
        </motion.div>

        {/* Notification */}
        <AnimatePresence>
          {notification && (
            <motion.div
              key="notif"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Notification
                message={notification.message}
                type={notification.type}
                onClose={() => setNotification(null)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls */}
        <div className="bg-white shadow-lg rounded-2xl p-6 mb-6 space-y-6">
          {/* Data Form อยู่แถวบน */}
          <div>
            <DataForm fields={fields} onSubmit={handleSubmit} />
          </div>

          {/* ปุ่ม Import / Export / ล้างทั้งหมด อยู่แถวล่าง */}
          <div className="flex flex-wrap gap-3 justify-start md:justify-end">
            <ImportButton fields={fields} onImport={handleImport} />
            <ExportButton fields={fields} rows={rows} onEmpty={handleExportEmpty} />
            {rows.length > 0 && (
              <motion.button
                type="button"
                onClick={handleClearAll}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-medium px-4 py-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-red-300 transition"
              >
                <FileMinus className="w-5 h-5 mr-2" />
                ล้างทั้งหมด
              </motion.button>
            )}
          </div>
        </div>

        {/* DataTable */}
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <DataTable fields={fields} rows={rows} removeRow={removeRow} />
        </div>
      </div>
    </div>
  );
};

export default App;
