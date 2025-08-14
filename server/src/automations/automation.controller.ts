import { Request, Response } from 'express';
import { AutomationRepo } from './automation.repo';

interface AutomationQuery {
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  name?: string;
  type?: string;
  status?: string;
  creationTime?: string;
}

export class AutomationsCtrl {
  public static async getAutomations(req: Request, res: Response): Promise<void> {
    try {
      const query: AutomationQuery = req.query;
      
      // Parse and validate pagination parameters
      const page = parseInt(query.page || '1', 10);
      const limit = parseInt(query.limit || '50', 10);
      
      // Validate pagination values
      if (page < 1 || limit < 1 || limit > 50000) {
        res.status(400).json({ 
          message: 'Invalid pagination parameters. Page must be >= 1, limit must be between 1 and 50000' 
        });
        return;
      }

      // Extract filter parameters (excluding id as per requirements)
      const filters: Record<string, string> = {};
      if (query.name) filters.name = query.name;
      if (query.type) filters.type = query.type;
      if (query.status) filters.status = query.status;
      if (query.creationTime) filters.creationTime = query.creationTime;

      // Extract sorting parameters
      const sortBy = query.sortBy;
      const sortOrder = query.sortOrder || 'asc';

      // Validate sort order
      if (sortOrder !== 'asc' && sortOrder !== 'desc') {
        res.status(400).json({ 
          message: 'Invalid sort order. Must be "asc" or "desc"' 
        });
        return;
      }

      const result = await AutomationRepo.getAutomations({
        page,
        limit,
        sortBy,
        sortOrder,
        filters
      });
      
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: error?.message });
    }
  }
}
