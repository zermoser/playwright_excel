import { useReducer } from 'react';

export interface DataRow { [key: string]: any; }

type Action = { type: 'add'; row: DataRow } | { type: 'addMultiple'; rows: DataRow[] } | { type: 'clear' } | { type: 'remove'; index: number };

function reducer(state: DataRow[], action: Action): DataRow[] {
  switch (action.type) {
    case 'add':
      return [...state, action.row];
    case 'addMultiple':
      return [...state, ...action.rows];
    case 'remove':
      return state.filter((_, i) => i !== action.index);
    case 'clear':
      return [];
    default:
      return state;
  }
}

export function useDataRows(initial: DataRow[] = []) {
  const [rows, dispatch] = useReducer(reducer, initial);
  const addRow = (row: DataRow) => dispatch({ type: 'add', row });
  const addRows = (rows: DataRow[]) => dispatch({ type: 'addMultiple', rows });
  const removeRow = (index: number) => dispatch({ type: 'remove', index });
  const clearRows = () => dispatch({ type: 'clear' });
  return { rows, addRow, addRows, removeRow, clearRows };
}
