import request from 'supertest';
import express, { Express } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import configureRoutes from '../../http/routes';
import fs from 'fs';
import path from 'path';

// Mock fs module
jest.mock('fs');
const mockFs = fs as jest.Mocked<typeof fs>;

describe('Automations API Integration Tests', () => {
  let app: Express;

  const mockAutomations = [
    {
      id: '1',
      name: 'Test Automation 1',
      type: 'robot',
      creationTime: new Date('2023-01-01'),
      status: 'active'
    },
    {
      id: '2',
      name: 'Test Automation 2',
      type: 'flow',
      creationTime: new Date('2023-01-02'),
      status: 'inactive'
    },
    {
      id: '3',
      name: 'Another Test',
      type: 'application',
      creationTime: new Date('2023-01-03'),
      status: 'active'
    }
  ];

  beforeEach(() => {
    app = express();
    app.use(bodyParser.json()).use(cors());
    configureRoutes(app);

    jest.clearAllMocks();
    mockFs.readFileSync.mockReturnValue(JSON.stringify(mockAutomations));
  });

  describe('GET /automations', () => {
    it('should return paginated automations with default parameters', async () => {
      const response = await request(app)
        .get('/automations')
        .expect(200);

      expect(response.body).toMatchObject({
        data: expect.any(Array),
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 3,
          itemsPerPage: 50
        }
      });
      expect(response.body.data).toHaveLength(3);
    });

    it('should handle pagination parameters', async () => {
      const response = await request(app)
        .get('/automations?page=1&limit=2')
        .expect(200);

      expect(response.body).toMatchObject({
        data: expect.any(Array),
        pagination: {
          currentPage: 1,
          totalPages: 2,
          totalItems: 3,
          itemsPerPage: 2
        }
      });
      expect(response.body.data).toHaveLength(2);
    });

    it('should handle filtering by name', async () => {
      const response = await request(app)
        .get('/automations?name=Test Automation')
        .expect(200);

      expect(response.body.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: expect.stringContaining('Test Automation') })
        ])
      );
    });

    it('should handle filtering by type', async () => {
      const response = await request(app)
        .get('/automations?type=robot')
        .expect(200);

      expect(response.body.data).toEqual([
        expect.objectContaining({ type: 'robot' })
      ]);
    });

    it('should handle filtering by status', async () => {
      const response = await request(app)
        .get('/automations?status=active')
        .expect(200);

      expect(response.body.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ status: 'active' })
        ])
      );
    });

    it('should handle sorting by name ascending', async () => {
      const response = await request(app)
        .get('/automations?sortBy=name&sortOrder=asc')
        .expect(200);

      const names = response.body.data.map((item: any) => item.name);
      expect(names).toEqual(['Another Test', 'Test Automation 1', 'Test Automation 2']);
    });

    it('should handle sorting by name descending', async () => {
      const response = await request(app)
        .get('/automations?sortBy=name&sortOrder=desc')
        .expect(200);

      const names = response.body.data.map((item: any) => item.name);
      expect(names).toEqual(['Test Automation 2', 'Test Automation 1', 'Another Test']);
    });

    it('should return 400 for invalid page parameter', async () => {
      const response = await request(app)
        .get('/automations?page=0')
        .expect(400);

      expect(response.body).toEqual({
        message: 'Invalid pagination parameters. Page must be >= 1, limit must be between 1 and 50000'
      });
    });

    it('should return 400 for invalid limit parameter', async () => {
      const response = await request(app)
        .get('/automations?limit=0')
        .expect(400);

      expect(response.body).toEqual({
        message: 'Invalid pagination parameters. Page must be >= 1, limit must be between 1 and 50000'
      });
    });

    it('should return 400 for limit exceeding maximum', async () => {
      const response = await request(app)
        .get('/automations?limit=50001')
        .expect(400);

      expect(response.body).toEqual({
        message: 'Invalid pagination parameters. Page must be >= 1, limit must be between 1 and 50000'
      });
    });

    it('should return 400 for invalid sort order', async () => {
      const response = await request(app)
        .get('/automations?sortOrder=invalid')
        .expect(400);

      expect(response.body).toEqual({
        message: 'Invalid sort order. Must be "asc" or "desc"'
      });
    });

    it('should handle multiple filters and sorting together', async () => {
      const response = await request(app)
        .get('/automations?status=active&sortBy=name&sortOrder=asc')
        .expect(200);

      expect(response.body.data).toEqual([
        expect.objectContaining({ name: 'Another Test', status: 'active' }),
        expect.objectContaining({ name: 'Test Automation 1', status: 'active' })
      ]);
    });

    it('should handle file system errors gracefully', async () => {
      mockFs.readFileSync.mockImplementation(() => {
        throw new Error('File not found');
      });

      const response = await request(app)
        .get('/automations')
        .expect(500);

      expect(response.body).toEqual({
        message: 'File not found'
      });
    });
  });

  describe('GET /api/health', () => {
    it('should return health check message', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.text).toBe('Hello! I am healthy!');
    });
  });
});
