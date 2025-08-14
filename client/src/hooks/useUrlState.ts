import { useState, useEffect, useCallback } from 'react';
import type { AutomationQueryParams } from '@sharedTypes/types';

interface UseUrlStateReturn {
  queryParams: AutomationQueryParams;
  updateQueryParams: (updates: Partial<AutomationQueryParams>) => void;
}

const useUrlState = (): UseUrlStateReturn => {
  const [queryParams, setQueryParams] = useState<AutomationQueryParams>(() => {
    // Initialize with URL params immediately
    const urlParams = new URLSearchParams(window.location.search);
    return {
      page: parseInt(urlParams.get('page') || '1', 10),
      limit: parseInt(urlParams.get('limit') || '50', 10),
      sortBy: urlParams.get('sortBy') as any || undefined,
      sortOrder: (urlParams.get('sortOrder') as 'asc' | 'desc') || 'asc',
      name: urlParams.get('name') || undefined,
      type: urlParams.get('type') as any || undefined,
      status: urlParams.get('status') as any || undefined,
      creationTime: urlParams.get('creationTime') || undefined
    };
  });

  // Parse URL parameters on mount and when URL changes
  useEffect(() => {
    const parseUrlParams = () => {
      const urlParams = new URLSearchParams(window.location.search);
      console.log('Parsing URL params:', window.location.search);
      
      const params: AutomationQueryParams = {
        page: parseInt(urlParams.get('page') || '1', 10),
        limit: parseInt(urlParams.get('limit') || '50', 10),
        sortBy: urlParams.get('sortBy') as any || undefined,
        sortOrder: (urlParams.get('sortOrder') as 'asc' | 'desc') || 'asc',
        name: urlParams.get('name') || undefined,
        type: urlParams.get('type') as any || undefined,
        status: urlParams.get('status') as any || undefined,
        creationTime: urlParams.get('creationTime') || undefined
      };

      console.log('Parsed params from URL:', params);
      setQueryParams(params);
    };

    parseUrlParams();

    // Listen for browser back/forward navigation
    const handlePopState = () => {
      parseUrlParams();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update URL when query params change
  const updateQueryParams = useCallback((updates: Partial<AutomationQueryParams>) => {
    const newParams = { ...queryParams, ...updates };
    
    // Remove undefined values and empty strings, but keep defaults
    const cleanParams: Record<string, any> = {};
    
    // Always include page and limit
    cleanParams.page = newParams.page || 1;
    cleanParams.limit = newParams.limit || 50;
    
    // Include sorting if present
    if (newParams.sortBy) {
      cleanParams.sortBy = newParams.sortBy;
      cleanParams.sortOrder = newParams.sortOrder || 'asc';
    }
    
    // Include filters if present
    if (newParams.name) cleanParams.name = newParams.name;
    if (newParams.type) cleanParams.type = newParams.type;
    if (newParams.status) cleanParams.status = newParams.status;
    if (newParams.creationTime) cleanParams.creationTime = newParams.creationTime;

    // Update state
    setQueryParams(newParams);

    // Update URL
    const urlParams = new URLSearchParams();
    Object.entries(cleanParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        urlParams.set(key, value.toString());
      }
    });

    const newUrl = `${window.location.pathname}${urlParams.toString() ? '?' + urlParams.toString() : ''}`;
    window.history.pushState({}, '', newUrl);
    
    console.log('Updated URL with params:', cleanParams);
    console.log('New URL:', newUrl);
  }, [queryParams]);

  return { queryParams, updateQueryParams };
};

export default useUrlState;
