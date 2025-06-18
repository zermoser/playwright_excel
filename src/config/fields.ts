export interface FieldConfig {
  key: string;
  label: string;
  type: string;
}

export const fields: FieldConfig[] = [
  { key: 'firstName', label: 'First Name', type: 'text' },
  { key: 'lastName', label: 'Last Name', type: 'text' },
  { key: 'email', label: 'Email', type: 'email' },
];
