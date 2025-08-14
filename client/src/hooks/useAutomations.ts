import { useState, useEffect } from 'react';
import Gateway from '@src/api/gateway';
import type { Automation, PaginatedResponse, AutomationQueryParams } from '@sharedTypes/types';

interface UseAutomationsReturn {
  data: PaginatedResponse<Automation> | null;
  loading: boolean;
  error: string | null;
  allAutomations: Automation[];
  refetch: () => Promise<void>;
}

const useAutomations = (queryParams: AutomationQueryParams): UseAutomationsReturn => {
  const [data, setData] = useState<PaginatedResponse<Automation> | null>(null);
  const [allAutomations, setAllAutomations] = useState<Automation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAutomations = async () => {
    try {
      setLoading(true);
      setError(null);
      

      const response = await Gateway.getAutomations(queryParams);

      setData(response.data);
    } catch (err: any) {
      console.error('Full error object:', err);
      console.error('Error response:', err?.response);
      setError(err?.response?.data?.message || err?.message || 'Failed to fetch automations');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllAutomations = async () => {
    try {
      // Fetch all automations for filter options (without pagination)

      const response = await Gateway.getAutomations({ page: 1, limit: 50000 });

      
      if (response.data && typeof response.data === 'object' && 'data' in response.data) {
        setAllAutomations(response.data.data);
      } else if (Array.isArray(response.data)) {
        // Handle backward compatibility if server returns array directly
        setAllAutomations(response.data);
      }
    } catch (err) {
      console.error('Error fetching all automations for filters:', err);
      setAllAutomations([]); // Set empty array on error
    }
  };

  useEffect(() => {
    fetchAutomations();
  }, [queryParams]);

  useEffect(() => {
    // Fetch all automations once for filter options
    if (allAutomations.length === 0) {
      fetchAllAutomations();
    }
  }, [allAutomations.length]);

  return {
    data,
    loading,
    error,
    allAutomations,
    refetch: fetchAutomations
  };
};

export default useAutomations;
