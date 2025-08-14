import type { Automation } from '@sharedTypes/types';

// Table column configuration
export interface ColumnConfig {
  key: keyof Automation;
  label: string;
  width: string;
  filterWidth: string;
  sortable: boolean;
  filterable: boolean;
  cellRenderer?: (value: any, row: Automation) => React.ReactNode;
}

export const AUTOMATION_COLUMNS: ColumnConfig[] = [
  {
    key: 'id',
    label: 'ID',
    width: '80px',
    filterWidth: '0px', // No filter
    sortable: true,
    filterable: false
  },
  {
    key: 'name',
    label: 'Name',
    width: '200px',
    filterWidth: '180px',
    sortable: true,
    filterable: true
  },
  {
    key: 'status',
    label: 'Status',
    width: '120px',
    filterWidth: '100px',
    sortable: true,
    filterable: true
  },
  {
    key: 'creationTime',
    label: 'Creation Time',
    width: '150px',
    filterWidth: '130px',
    sortable: true,
    filterable: true,
    cellRenderer: (value: Date) => new Date(value).toLocaleDateString()
  },
  {
    key: 'type',
    label: 'Type',
    width: '120px',
    filterWidth: '100px',
    sortable: true,
    filterable: true
  }
];

// Table styling constants
export const TABLE_STYLES = {
  colors: {
    primary: 'lightgreen',
    primaryHover: '#90ee90',
    border: '#e0e0e0',
    filterBorder: 'lightgrey',
    background: '#ffffff'
  },
  dimensions: {
    minTableWidth: 1200,
    headerHeight: 32,
    cellPadding: '8px',
    filterPadding: '2px',
    filterMargin: '8px'
  },
  borders: {
    filterBox: '2px solid lightgrey',
    tableBottom: '2px solid #e0e0e0'
  }
} as const;

// Pagination constants
export const PAGINATION_CONFIG = {
  defaultPageSize: 50,
  pageSizeOptions: [5, 10, 25, 50, 100],
  maxItemsForFilters: 50000
} as const;

// API constants
export const API_CONFIG = {
  maxRetries: 3,
  defaultTimeout: 10000,
  debounceMs: 300
} as const;
