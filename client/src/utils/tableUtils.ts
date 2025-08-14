import type { Automation } from '@sharedTypes/types';

/**
 * Extract unique values from automation data for a specific field
 */
export const extractUniqueValues = (
  data: Automation[], 
  field: keyof Automation
): string[] => {
  if (!data || data.length === 0) return [];

  let values: string[];
  
  if (field === 'creationTime') {
    values = data.map(item => 
      new Date(item.creationTime).toISOString().split('T')[0]
    );
  } else {
    values = data.map(item => String(item[field]));
  }

  return [...new Set(values)].sort();
};

/**
 * Extract all unique values for filter dropdowns
 */
export const extractAllUniqueValues = (data: Automation[]) => {
  return {
    names: extractUniqueValues(data, 'name'),
    types: extractUniqueValues(data, 'type'),
    statuses: extractUniqueValues(data, 'status'),
    creationTimes: extractUniqueValues(data, 'creationTime')
  };
};

/**
 * Get filter options for a specific column
 */
export const getFilterOptions = (
  uniqueValues: ReturnType<typeof extractAllUniqueValues>,
  field: keyof Automation
): string[] => {
  switch (field) {
    case 'name': return uniqueValues.names;
    case 'status': return uniqueValues.statuses;
    case 'type': return uniqueValues.types;
    case 'creationTime': return uniqueValues.creationTimes;
    default: return [];
  }
};

/**
 * Format cell value based on column type
 */
export const formatCellValue = (value: any, field: keyof Automation): string => {
  if (field === 'creationTime') {
    return new Date(value).toLocaleDateString();
  }
  return String(value);
};

/**
 * Capitalize first letter of string
 */
export const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Convert camelCase to Title Case
 */
export const toTitleCase = (str: string): string => {
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, s => s.toUpperCase());
};
