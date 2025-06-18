import { FieldConfig } from '../config/fields';

export function validateRow(row: Record<string, any>, fields: FieldConfig[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  fields.forEach(field => {
    const value = row[field.key];
    if (value == null || value === '') {
      errors.push(`${field.label} is required`);
    } else if (field.type === 'email') {
      const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
      if (!emailRegex.test(String(value))) {
        errors.push(`${field.label} is not a valid email`);
      }
    }
  });
  return { valid: errors.length === 0, errors };
}
