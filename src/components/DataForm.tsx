// src/components/DataForm.tsx
import React, { useState } from 'react';
import { FieldConfig } from '../config/fields';
import { motion } from 'framer-motion';

interface DataFormProps {
  fields: FieldConfig[];
  onSubmit: (row: { [key: string]: any }) => void;
}

const DataForm: React.FC<DataFormProps> = ({ fields, onSubmit }) => {
  const initialState = fields.reduce((acc, field) => {
    acc[field.key] = '';
    return acc;
  }, {} as { [key: string]: string });

  const [formState, setFormState] = useState<{ [key: string]: string }>(initialState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const row: Record<string, any> = {};
    fields.forEach(field => {
      row[field.key] = formState[field.key].trim();
    });
    onSubmit(row);
    setFormState(initialState);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full"
    >
      {fields.map(field => (
        <div key={field.key} className="flex flex-col">
          <label htmlFor={field.key} className="text-sm font-medium text-gray-700 mb-1">
            {field.label}
          </label>
          <input
            id={field.key}
            name={field.key}
            type={field.type}
            value={formState[field.key]}
            onChange={handleChange}
            className="border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-lg px-3 py-2 transition"
            placeholder={field.label}
            required
          />
        </div>
      ))}
      <div className="flex items-end">
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
        >
          เพิ่ม
        </motion.button>
      </div>
    </motion.form>
  );
};

export default DataForm;
