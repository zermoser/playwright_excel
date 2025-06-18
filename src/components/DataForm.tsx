import React, { useState } from 'react';
import { FieldConfig } from '../config/fields';

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
      row[field.key] = formState[field.key];
    });
    onSubmit(row);
    setFormState(initialState);
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2">
      {fields.map(field => (
        <div key={field.key} className="flex flex-col">
          <label className="text-sm mb-1">{field.label}</label>
          <input
            name={field.key}
            type={field.type}
            value={formState[field.key]}
            onChange={handleChange}
            className="border rounded p-2"
            required
          />
        </div>
      ))}
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Submit
      </button>
    </form>
  );
};

export default DataForm;
