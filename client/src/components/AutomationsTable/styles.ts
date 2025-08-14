import { SxProps, Theme } from '@mui/material/styles';
import { TABLE_STYLES } from '../../config/tableConfig';

/**
 * Styled system for AutomationTable components
 */
export const tableStyles = {
  // Main table container
  tableContainer: {
    minWidth: TABLE_STYLES.dimensions.minTableWidth,
    tableLayout: 'fixed',
    borderCollapse: 'collapse'
  } as SxProps<Theme>,

  // Table header section
  tableHead: {
    '& .MuiTableRow-root': {
      '& .MuiTableCell-root': {
        borderTop: 'none !important',
        borderBottom: 'none !important'
      }
    },
    '& .MuiTableRow-root:last-child .MuiTableCell-root': {
      borderBottom: `${TABLE_STYLES.borders.tableBottom} !important`
    }
  } as SxProps<Theme>,

  // Header row styling
  headerRow: {
    backgroundColor: TABLE_STYLES.colors.primary,
    '& .MuiTableCell-root': {
      borderTop: 'none !important'
    }
  } as SxProps<Theme>,

  // Header cell styling
  headerCell: (width: string, isActive: boolean) => ({
    cursor: 'pointer',
    userSelect: 'none',
    '&:hover': { backgroundColor: TABLE_STYLES.colors.primaryHover },
    fontWeight: isActive ? 'bold' : 'normal',
    backgroundColor: TABLE_STYLES.colors.primary,
    border: 'none !important',
    borderTop: 'none !important',
    borderBottom: TABLE_STYLES.borders.tableBottom,
    margin: 0,
    padding: TABLE_STYLES.dimensions.cellPadding,
    width
  }) as SxProps<Theme>,

  // Filter row styling
  filterRow: {
    backgroundColor: TABLE_STYLES.colors.primary,
    '& .MuiTableCell-root': {
      borderBottom: 'none !important'
    }
  } as SxProps<Theme>,

  // Filter cell styling
  filterCell: (width: string) => ({
    backgroundColor: TABLE_STYLES.colors.primary,
    border: 'none !important',
    borderBottom: 'none !important',
    borderTop: 'none !important',
    padding: TABLE_STYLES.dimensions.cellPadding,
    margin: 0,
    width
  }) as SxProps<Theme>,

  // Filter container
  filterContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    paddingLeft: TABLE_STYLES.dimensions.filterMargin
  } as SxProps<Theme>,

  // Filter box styling
  filterBox: (width: string) => ({
    border: TABLE_STYLES.borders.filterBox,
    borderRadius: '4px',
    backgroundColor: TABLE_STYLES.colors.primary,
    width,
    padding: TABLE_STYLES.dimensions.filterPadding
  }) as SxProps<Theme>,

  // Filter input styling
  filterInput: {
    '& .MuiOutlinedInput-root': {
      height: TABLE_STYLES.dimensions.headerHeight,
      backgroundColor: TABLE_STYLES.colors.primary,
      '& fieldset': {
        border: 'none'
      },
      '& input': {
        padding: '6px 8px',
        fontSize: '14px'
      }
    }
  } as SxProps<Theme>,

  // Data cell styling
  dataCell: (width: string, ellipsis: boolean = false) => ({
    width,
    ...(ellipsis && {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    })
  }) as SxProps<Theme>,

  // Loading/error states
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 400
  } as SxProps<Theme>,

  errorContainer: {
    margin: 2
  } as SxProps<Theme>,

  // Header content container
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    gap: 0.5
  } as SxProps<Theme>
};
