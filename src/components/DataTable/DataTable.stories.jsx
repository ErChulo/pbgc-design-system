import { DataTable } from './DataTable.jsx';

const fmt = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default {
  title: 'Organisms/DataTable',
  component: DataTable,
  args: {
    caption: 'Sample benefit factors',
    note: 'Illustrative values only. Not actual PBGC figures.',
    columns: [
      { key: 'age', label: 'Age', numeric: true, sortable: true },
      { key: 'factor', label: 'Factor', numeric: true, sortable: true, format: (v) => fmt.format(v) },
      { key: 'label', label: 'Description', sortable: true },
    ],
    rows: [
      { age: 55, factor: 0.4123, label: 'Sample row A' },
      { age: 60, factor: 0.6431, label: 'Sample row B' },
      { age: 62, factor: 0.7512, label: 'Sample row C' },
      { age: 65, factor: 1, label: 'Sample row D' },
    ],
  },
};

export const Default = {};
export const SortedDescending = { args: { initialSort: { key: 'factor', dir: 'descending' } } };
