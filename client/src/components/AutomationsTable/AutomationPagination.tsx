import {
  Box,
  Select,
  MenuItem,
  FormControl,
  Typography,
  SelectChangeEvent,
  Pagination,
  Stack
} from '@mui/material';
import type { PaginatedResponse, Automation } from '@sharedTypes/types';

interface AutomationPaginationProps {
  paginationData: PaginatedResponse<Automation>['pagination'];
  onPageSizeChange: (pageSize: number) => void;
  onPageChange: (page: number) => void;
}

const AutomationPagination = ({ paginationData, onPageSizeChange, onPageChange }: AutomationPaginationProps): JSX.Element => {
  const { currentPage = 1, totalItems = 0, itemsPerPage = 50, totalPages = 1 } = paginationData || {};
  
  console.log('Pagination component - itemsPerPage:', itemsPerPage);
  
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handlePageSizeChange = (event: SelectChangeEvent<number>) => {
    const newPageSize = event.target.value as number;
    console.log('Page size changed to:', newPageSize);
    onPageSizeChange(newPageSize);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    console.log('Page changed to:', page);
    onPageChange(page);
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '16px',
        backgroundColor: '#f5f5f5'
      }}
    >
      {/* Left side - Page navigation */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {totalPages > 1 && (
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            size="small"
            showFirstButton
            showLastButton
            sx={{
              '& .MuiPagination-ul': {
                flexWrap: 'nowrap'
              }
            }}
          />
        )}
      </Box>

      {/* Right side - Rows per page and item count */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2">Rows per page:</Typography>
          <FormControl size="small">
            <Select
              value={itemsPerPage}
              onChange={handlePageSizeChange}
              sx={{ 
                minWidth: 60,
                height: 32,
                '& .MuiSelect-select': {
                  padding: '4px 8px'
                }
              }}
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
            </Select>
          </FormControl>
        </Box>
        
        <Typography variant="body2">
          {startItem}-{endItem} of {totalItems}
        </Typography>
      </Box>
    </Box>
  );
};

export default AutomationPagination;
