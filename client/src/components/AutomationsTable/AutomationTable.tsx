import { useState } from 'react';
import {
  Paper,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  Box,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { toTitleCase } from '@src/common/utils';
import useUrlState from '../../hooks/useUrlState';
import useAutomations from '../../hooks/useAutomations';
import AutomationFilters from './AutomationFilters';
import AutomationPagination from './AutomationPagination';

import type { Automation } from '@sharedTypes/types';

const AutomationTable = (): JSX.Element => {
  const { queryParams, updateQueryParams } = useUrlState();
  const { data, loading, error, allAutomations } = useAutomations(queryParams);

  console.log('AutomationTable - current queryParams:', queryParams);

  const headers: (keyof Automation)[] = ['id', 'name', 'status', 'creationTime', 'type'];

  const handleSort = (column: keyof Automation) => {
    const isCurrentColumn = queryParams.sortBy === column;
    const newSortOrder = isCurrentColumn && queryParams.sortOrder === 'asc' ? 'desc' : 'asc';
    
    updateQueryParams({
      sortBy: column,
      sortOrder: newSortOrder,
      page: 1 // Reset to first page when sorting
    });
  };

  const handleFilterChange = (filters: Partial<typeof queryParams>) => {
    updateQueryParams({
      ...filters,
      page: 1 // Reset to first page when filtering
    });
  };

  const handlePageSizeChange = (newPageSize: number) => {
    console.log('handlePageSizeChange called with:', newPageSize);
    updateQueryParams({
      limit: newPageSize,
      page: 1 // Reset to first page when changing page size
    });
  };

  const handlePageChange = (newPage: number) => {
    console.log('handlePageChange called with:', newPage);
    updateQueryParams({
      page: newPage
    });
  };

  const getSortIcon = (column: keyof Automation) => {
    if (queryParams.sortBy !== column) return null;
    return queryParams.sortOrder === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />;
  };

  const renderTableHeader = (): JSX.Element => (
    <TableRow key="table-header" sx={{ 
      backgroundColor: 'lightgreen',
      '& .MuiTableCell-root': {
        borderTop: 'none !important'
      }
    }}>
      {headers.map((header, index) => (
        <TableCell 
          key={header}
          onClick={() => handleSort(header)}
          sx={{ 
            cursor: 'pointer',
            userSelect: 'none',
            '&:hover': { backgroundColor: '#90ee90' }, // Slightly darker green on hover
            fontWeight: queryParams.sortBy === header ? 'bold' : 'normal',
            backgroundColor: 'lightgreen',
            border: 'none !important',
            borderTop: 'none !important',
            borderBottom: '2px solid #e0e0e0',
            margin: 0,
            padding: '8px',
            width: index === 0 ? '80px' : // ID column
                   index === 1 ? '200px' : // Name column
                   index === 2 ? '120px' : // Status column
                   index === 3 ? '150px' : // Creation Time column
                   '120px' // Type column
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {toTitleCase(header)}
            {getSortIcon(header)}
          </Box>
        </TableCell>
      ))}
    </TableRow>
  );

  const renderTableBody = (): JSX.Element => (
    <TableBody>
      {data?.data?.map((row) => (
        <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
          <TableCell sx={{ width: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {row.id}
          </TableCell>
          <TableCell sx={{ width: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {row.name}
          </TableCell>
          <TableCell sx={{ width: '120px' }}>
            {row.status}
          </TableCell>
          <TableCell sx={{ width: '150px' }}>
            {new Date(row.creationTime).toLocaleDateString()}
          </TableCell>
          <TableCell sx={{ width: '120px' }}>
            {row.type}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ margin: 2 }}>
        Error loading automations: {error}
      </Alert>
    );
  }

  if (!data) {
    return (
      <Typography variant="body1" sx={{ padding: 2 }}>
        No data available
      </Typography>
    );
  }

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table sx={{ 
          minWidth: 1200, 
          tableLayout: 'fixed',
          borderCollapse: 'collapse'
        }} aria-label="automations table">
          <TableHead sx={{
            '& .MuiTableRow-root': {
              '& .MuiTableCell-root': {
                borderTop: 'none !important',
                borderBottom: 'none !important'
              }
            },
            '& .MuiTableRow-root:last-child .MuiTableCell-root': {
              borderBottom: '2px solid #e0e0e0 !important'
            }
          }}>
            {renderTableHeader()}
            <AutomationFilters
              filters={queryParams}
              onFiltersChange={handleFilterChange}
              automationsData={allAutomations}
            />
          </TableHead>
          {renderTableBody()}
        </Table>
      </TableContainer>
      
      {data?.pagination && (
        <AutomationPagination
          paginationData={{
            ...data.pagination,
            itemsPerPage: queryParams.limit || data.pagination.itemsPerPage,
            currentPage: queryParams.page || data.pagination.currentPage
          }}
          onPageSizeChange={handlePageSizeChange}
          onPageChange={handlePageChange}
        />
      )}
    </Box>
  );
};

export default AutomationTable;
