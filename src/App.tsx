import React from 'react';
import DataForm from './components/DataForm';
import DataTable from './components/DataTable';
import ImportButton from './components/ImportButton';
import ExportButton from './components/ExportButton';
import Notification from './components/Notification';
import { fields } from './config/fields';
import { useDataRows } from './components/hooks/useDataRows';

const App: React.FC = () => {
  const { rows, addRow, addRows, clearRows, removeRow } = useDataRows([]);
  const [notification, setNotification] = React.useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);

  const handleSubmit = (row: Record<string, any>) => {
    addRow(row);
    setNotification({ message: 'เพิ่มข้อมูลสำเร็จ', type: 'success' });
  };
  const handleImport = (importedRows: Record<string, any>[]) => {
    addRows(importedRows);
    setNotification({ message: `นำเข้า ${importedRows.length} แถวสำเร็จ`, type: 'success' });
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Excel Data Import Demo</h1>
      {notification && (
        <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />
      )}
      <div className="flex items-center mb-4 space-x-2">
        <DataForm fields={fields} onSubmit={handleSubmit} />
        <ImportButton fields={fields} onImport={handleImport} />
        <ExportButton fields={fields} rows={rows} />
      </div>
      <DataTable fields={fields} rows={rows} removeRow={removeRow} />
    </div>
  );
};

export default App;
