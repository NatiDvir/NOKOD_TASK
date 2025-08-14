import { useState, useEffect } from 'react';
import { TableRow, TableCell, Box } from '@mui/material';
import { AUTOMATION_COLUMNS } from '../../config/tableConfig';
import { extractAllUniqueValues, getFilterOptions } from '../../utils/tableUtils';
import { tableStyles } from './styles';
import FilterDropdown from './FilterDropdown';
import type { Automation, AutomationQueryParams } from '@sharedTypes/types';

interface AutomationFiltersProps {
  filters: Partial<AutomationQueryParams>;
  onFiltersChange: (filters: Partial<AutomationQueryParams>) => void;
  automationsData?: Automation[];
}

const AutomationFilters = ({ filters, onFiltersChange, automationsData }: AutomationFiltersProps): JSX.Element => {
  const [uniqueValues, setUniqueValues] = useState(extractAllUniqueValues([]));

  // Extract unique values for dropdowns when data changes
  useEffect(() => {
    if (!automationsData || automationsData.length === 0) return;
    setUniqueValues(extractAllUniqueValues(automationsData));
  }, [automationsData]);

  const handleFilterChange = (field: keyof Automation) => (value: string | null) => {
    onFiltersChange({
      ...filters,
      [field]: value || undefined
    });
  };

  return (
    <TableRow sx={tableStyles.filterRow}>
      {AUTOMATION_COLUMNS.map((column) => (
        <TableCell key={column.key} sx={tableStyles.filterCell(column.width)}>
          {column.filterable ? (
            <FilterDropdown
              field={column.key}
              value={filters[column.key as keyof AutomationQueryParams]?.toString() || null}
              options={getFilterOptions(uniqueValues, column.key)}
              width={column.filterWidth}
              onChange={handleFilterChange(column.key)}
            />
          ) : (
            <Box sx={{ height: 32 }} />
          )}
        </TableCell>
      ))}
    </TableRow>
  );
};

export default AutomationFilters;
