import { Request, Response } from 'express';
import { AutomationsCtrl } from '../automation.controller';
import { AutomationRepo } from '../automation.repo';
import { Automation } from '@sharedTypes/types';

// Mock the AutomationRepo
jest.mock('../automation.repo');
const mockAutomationRepo = AutomationRepo as jest.Mocked<typeof AutomationRepo>;

describe('AutomationsCtrl', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJsonFn: jest.Mock;
  let mockStatusFn: jest.Mock;

  const mockAutomations: Automation[] = [
    {
      id: '1',
      name: 'Test Automation',
      type: 'robot',
      creationTime: new Date('2023-01-01'),
      status: 'active'
    }
  ];

  const mockPaginatedResponse = {
    data: mockAutomations,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 1,
      itemsPerPage: 50
    },
    filters: {},
    sorting: {
      sortBy: undefined,
      sortOrder: 'asc' as const
    }
  };

  beforeEach(() => {
    mockJsonFn = jest.fn();
    mockStatusFn = jest.fn().mockReturnValue({ json: mockJsonFn });

    mockRequest = {
      query: {}
    };

    mockResponse = {
      json: mockJsonFn,
      status: mockStatusFn
    };

    jest.clearAllMocks();
  });

  describe('getAutomations', () => {
    it('should return automations with default pagination', async () => {
      mockAutomationRepo.getAutomations.mockResolvedValue(mockPaginatedResponse);

      await AutomationsCtrl.getAutomations(mockRequest as Request, mockResponse as Response);

      expect(mockAutomationRepo.getAutomations).toHaveBeenCalledWith({
        page: 1,
        limit: 50,
        sortBy: undefined,
        sortOrder: 'asc',
        filters: {}
      });
      expect(mockJsonFn).toHaveBeenCalledWith(mockPaginatedResponse);
    });

    it('should handle custom pagination parameters', async () => {
      mockRequest.query = { page: '2', limit: '10' };
      mockAutomationRepo.getAutomations.mockResolvedValue(mockPaginatedResponse);

      await AutomationsCtrl.getAutomations(mockRequest as Request, mockResponse as Response);

      expect(mockAutomationRepo.getAutomations).toHaveBeenCalledWith({
        page: 2,
        limit: 10,
        sortBy: undefined,
        sortOrder: 'asc',
        filters: {}
      });
    });

    it('should handle filter parameters', async () => {
      mockRequest.query = {
        name: 'test',
        type: 'robot',
        status: 'active',
        creationTime: '2023-01-01'
      };
      mockAutomationRepo.getAutomations.mockResolvedValue(mockPaginatedResponse);

      await AutomationsCtrl.getAutomations(mockRequest as Request, mockResponse as Response);

      expect(mockAutomationRepo.getAutomations).toHaveBeenCalledWith({
        page: 1,
        limit: 50,
        sortBy: undefined,
        sortOrder: 'asc',
        filters: {
          name: 'test',
          type: 'robot',
          status: 'active',
          creationTime: '2023-01-01'
        }
      });
    });

    it('should handle sorting parameters', async () => {
      mockRequest.query = {
        sortBy: 'name',
        sortOrder: 'desc'
      };
      mockAutomationRepo.getAutomations.mockResolvedValue(mockPaginatedResponse);

      await AutomationsCtrl.getAutomations(mockRequest as Request, mockResponse as Response);

      expect(mockAutomationRepo.getAutomations).toHaveBeenCalledWith({
        page: 1,
        limit: 50,
        sortBy: 'name',
        sortOrder: 'desc',
        filters: {}
      });
    });

    it('should return 400 for invalid page parameter', async () => {
      mockRequest.query = { page: '0' };

      await AutomationsCtrl.getAutomations(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(400);
      expect(mockJsonFn).toHaveBeenCalledWith({
        message: 'Invalid pagination parameters. Page must be >= 1, limit must be between 1 and 50000'
      });
    });

    it('should return 400 for invalid limit parameter', async () => {
      mockRequest.query = { limit: '0' };

      await AutomationsCtrl.getAutomations(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(400);
      expect(mockJsonFn).toHaveBeenCalledWith({
        message: 'Invalid pagination parameters. Page must be >= 1, limit must be between 1 and 50000'
      });
    });

    it('should return 400 for limit exceeding maximum', async () => {
      mockRequest.query = { limit: '50001' };

      await AutomationsCtrl.getAutomations(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(400);
      expect(mockJsonFn).toHaveBeenCalledWith({
        message: 'Invalid pagination parameters. Page must be >= 1, limit must be between 1 and 50000'
      });
    });

    it('should return 400 for invalid sort order', async () => {
      mockRequest.query = { sortOrder: 'invalid' };

      await AutomationsCtrl.getAutomations(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(400);
      expect(mockJsonFn).toHaveBeenCalledWith({
        message: 'Invalid sort order. Must be "asc" or "desc"'
      });
    });

    it('should handle repository errors', async () => {
      mockAutomationRepo.getAutomations.mockRejectedValue(new Error('Database error'));

      await AutomationsCtrl.getAutomations(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(500);
      expect(mockJsonFn).toHaveBeenCalledWith({
        message: 'Database error'
      });
    });

    it('should handle repository errors without message', async () => {
      mockAutomationRepo.getAutomations.mockRejectedValue(new Error());

      await AutomationsCtrl.getAutomations(mockRequest as Request, mockResponse as Response);

      expect(mockStatusFn).toHaveBeenCalledWith(500);
      expect(mockJsonFn).toHaveBeenCalledWith({
        message: ""
      });
    });

    it('should ignore invalid query parameters', async () => {
      mockRequest.query = {
        page: '1',
        limit: '10',
        invalidParam: 'should be ignored',
        name: 'test'
      };
      mockAutomationRepo.getAutomations.mockResolvedValue(mockPaginatedResponse);

      await AutomationsCtrl.getAutomations(mockRequest as Request, mockResponse as Response);

      expect(mockAutomationRepo.getAutomations).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        sortBy: undefined,
        sortOrder: 'asc',
        filters: {
          name: 'test'
        }
      });
    });
  });
});
