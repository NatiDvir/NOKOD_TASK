type AutomationType = 'robot' | 'flow' | 'application';
type Status = 'active' | 'deleted' | 'inactive';

export interface Automation {
  id: string;
  name: string;
  type: AutomationType;
  creationTime: Date;
  status: Status;
}

export interface PaginatedResponse<T> {
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

export interface AutomationQueryParams {
  page?: number;
  limit?: number;
  sortBy?: keyof Automation;
  sortOrder?: 'asc' | 'desc';
  name?: string;
  type?: AutomationType;
  status?: Status;
  creationTime?: string;
}
