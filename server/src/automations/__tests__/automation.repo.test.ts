import fs from 'fs';
import path from 'path';
import { AutomationRepo } from '../automation.repo';
import { Automation } from '@sharedTypes/types';

// Mock fs module
jest.mock('fs');
const mockFs = fs as jest.Mocked<typeof fs>;

describe('AutomationRepo', () => {
  const mockAutomations: Automation[] = [
    {
      id: '1',
      name: 'Test Automation 1',
      type: 'robot',
      creationTime: '2023-01-01T00:00:00.000Z' as any,
      status: 'active'
    },
    {
      id: '2',
      name: 'Test Automation 2',
      type: 'flow',
      creationTime: '2023-01-02T00:00:00.000Z' as any,
      status: 'inactive'
    },
    {
      id: '3',
      name: 'Another Test',
      type: 'application',
      creationTime: '2023-01-03T00:00:00.000Z' as any,
      status: 'active'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockFs.readFileSync.mockReturnValue(JSON.stringify(mockAutomations));
  });

  describe('getAutomations', () => {
    it('should return all automations when no params provided', async () => {
      const result = await AutomationRepo.getAutomations();
      
      expect(result).toEqual(mockAutomations);
      expect(mockFs.readFileSync).toHaveBeenCalledWith(
        expect.stringContaining('automations.json'),
        'utf-8'
      );
    });

    it('should return paginated results when params provided', async () => {
      const params = {
        page: 1,
        limit: 2,
        sortOrder: 'asc' as const,
        filters: {}
      };

      const result = await AutomationRepo.getAutomations(params);

      expect(result).toEqual({
        data: mockAutomations.slice(0, 2),
        pagination: {
          currentPage: 1,
          totalPages: 2,
          totalItems: 3,
          itemsPerPage: 2
        },
        filters: {},
        sorting: {
          sortBy: undefined,
          sortOrder: 'asc'
        }
      });
    });

    it('should filter automations by name', async () => {
      const params = {
        page: 1,
        limit: 10,
        sortOrder: 'asc' as const,
        filters: { name: 'Test Automation' }
      };

      const result = await AutomationRepo.getAutomations(params);

      expect(result).toMatchObject({
        data: expect.arrayContaining([
          expect.objectContaining({ name: 'Test Automation 1' }),
          expect.objectContaining({ name: 'Test Automation 2' })
        ])
      });
    });

    it('should filter automations by type', async () => {
      const params = {
        page: 1,
        limit: 10,
        sortOrder: 'asc' as const,
        filters: { type: 'robot' }
      };

      const result = await AutomationRepo.getAutomations(params);

      expect(result).toMatchObject({
        data: [expect.objectContaining({ type: 'robot' })]
      });
    });

    it('should filter automations by status', async () => {
      const params = {
        page: 1,
        limit: 10,
        sortOrder: 'asc' as const,
        filters: { status: 'active' }
      };

      const result = await AutomationRepo.getAutomations(params);

      expect(result).toMatchObject({
        data: expect.arrayContaining([
          expect.objectContaining({ status: 'active' }),
          expect.objectContaining({ status: 'active' })
        ])
      });
    });

    it('should sort automations by name ascending', async () => {
      const params = {
        page: 1,
        limit: 10,
        sortBy: 'name',
        sortOrder: 'asc' as const,
        filters: {}
      };

      const result = await AutomationRepo.getAutomations(params);

      expect(result).toMatchObject({
        data: [
          expect.objectContaining({ name: 'Another Test' }),
          expect.objectContaining({ name: 'Test Automation 1' }),
          expect.objectContaining({ name: 'Test Automation 2' })
        ]
      });
    });

    it('should sort automations by name descending', async () => {
      const params = {
        page: 1,
        limit: 10,
        sortBy: 'name',
        sortOrder: 'desc' as const,
        filters: {}
      };

      const result = await AutomationRepo.getAutomations(params);

      expect(result).toMatchObject({
        data: [
          expect.objectContaining({ name: 'Test Automation 2' }),
          expect.objectContaining({ name: 'Test Automation 1' }),
          expect.objectContaining({ name: 'Another Test' })
        ]
      });
    });

    it('should sort automations by creation time', async () => {
      const params = {
        page: 1,
        limit: 10,
        sortBy: 'creationTime',
        sortOrder: 'asc' as const,
        filters: {}
      };

      const result = await AutomationRepo.getAutomations(params);

      expect(result).toMatchObject({
        data: [
          expect.objectContaining({ id: '1' }),
          expect.objectContaining({ id: '2' }),
          expect.objectContaining({ id: '3' })
        ]
      });
    });

    it('should handle pagination correctly', async () => {
      const params = {
        page: 2,
        limit: 1,
        sortOrder: 'asc' as const,
        filters: {}
      };

      const result = await AutomationRepo.getAutomations(params);

      expect(result).toMatchObject({
        data: [mockAutomations[1]],
        pagination: {
          currentPage: 2,
          totalPages: 3,
          totalItems: 3,
          itemsPerPage: 1
        }
      });
    });

    it('should handle empty filters correctly', async () => {
      const params = {
        page: 1,
        limit: 10,
        sortOrder: 'asc' as const,
        filters: { name: '' }
      };

      const result = await AutomationRepo.getAutomations(params);

      expect(result).toMatchObject({
        data: mockAutomations
      });
    });

    it('should throw GetAutomationsException on file read error', async () => {
      mockFs.readFileSync.mockImplementation(() => {
        throw new Error('File not found');
      });

      await expect(AutomationRepo.getAutomations()).rejects.toThrow('File not found');
    });
  });
});
