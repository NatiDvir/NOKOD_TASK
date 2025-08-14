import fs from 'fs';
import path from 'path';
import { Automation } from '@sharedTypes/types';
import { GetAutomationsException } from '@common/errors';

interface AutomationQueryParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder: 'asc' | 'desc';
  filters: Record<string, string>;
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  filters?: Record<string, string>;
  sorting?: {
    sortBy?: string;
    sortOrder: 'asc' | 'desc';
  };
}

export class AutomationRepo {
  public static async getAutomations(params?: AutomationQueryParams): Promise<Automation[] | PaginatedResponse<Automation>> {
    try {
      const dataFilePath = path.resolve(__dirname, 'automations.json');
      const rawData = fs.readFileSync(dataFilePath, 'utf-8');
      let automations: Automation[] = JSON.parse(rawData);

      // If no params provided, return all data (backward compatibility)
      if (!params) {
        return automations;
      }

      // Apply filters
      if (Object.keys(params.filters).length > 0) {
        automations = this.filterAutomations(automations, params.filters);
      }

      // Apply sorting
      if (params.sortBy) {
        automations = this.sortAutomations(automations, params.sortBy, params.sortOrder);
      }

      // Calculate pagination
      const totalItems = automations.length;
      const totalPages = Math.ceil(totalItems / params.limit);
      const startIndex = (params.page - 1) * params.limit;
      const endIndex = startIndex + params.limit;
      const paginatedData = automations.slice(startIndex, endIndex);

      return {
        data: paginatedData,
        pagination: {
          currentPage: params.page,
          totalPages,
          totalItems,
          itemsPerPage: params.limit
        },
        filters: params.filters,
        sorting: {
          sortBy: params.sortBy,
          sortOrder: params.sortOrder
        }
      };
    } catch (err: any) {
      throw new GetAutomationsException(err?.message);
    }
  }

  private static filterAutomations(automations: Automation[], filters: Record<string, string>): Automation[] {
    return automations.filter(automation => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true; // Skip empty filters
        
        const automationValue = automation[key as keyof Automation];
        if (automationValue === undefined || automationValue === null) return false;
        
        // For date filtering, we'll do simple string matching for now
        // In a real app, you'd want proper date range filtering
        if (key === 'creationTime') {
          const dateStr = new Date(automationValue as any).toISOString().split('T')[0];
          return dateStr.includes(value);
        }
        
        // For other fields, do exact matching (case-insensitive for name)
        if (key === 'name') {
          return automationValue.toString().toLowerCase().includes(value.toLowerCase());
        }
        
        return automationValue.toString() === value;
      });
    });
  }

  private static sortAutomations(automations: Automation[], sortBy: string, sortOrder: 'asc' | 'desc'): Automation[] {
    return [...automations].sort((a, b) => {
      const aValue = a[sortBy as keyof Automation];
      const bValue = b[sortBy as keyof Automation];
      
      if (aValue === undefined || aValue === null) return 1;
      if (bValue === undefined || bValue === null) return -1;
      
      let comparison = 0;
      
      // Handle different data types
      if (sortBy === 'creationTime') {
        const aDate = new Date(aValue as any).getTime();
        const bDate = new Date(bValue as any).getTime();
        comparison = aDate - bDate;
      } else if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else {
        comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });
  }
}
