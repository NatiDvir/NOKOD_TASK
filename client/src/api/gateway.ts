import axios, { type AxiosResponse } from 'axios';
import type { Automation, PaginatedResponse, AutomationQueryParams } from '@sharedTypes/types';

const BE_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3002';

class Gateway {
  static async get<T>(path: string, params?: any): Promise<AxiosResponse<T>> {
    const url = `${BE_URL}/${path}`;
    const res = await axios.get<T>(url, { params });
    return res;
  }

  static async getAutomations(queryParams?: AutomationQueryParams): Promise<AxiosResponse<PaginatedResponse<Automation>>> {
    const automations = await Gateway.get<PaginatedResponse<Automation>>('automations', queryParams);
    return automations;
  }
}

export default Gateway;
