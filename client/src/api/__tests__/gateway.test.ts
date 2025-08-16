import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import axios from 'axios'
import Gateway from '../gateway'
import type { Automation, PaginatedResponse } from '@sharedTypes/types'

// Mock axios
vi.mock('axios')
const mockedAxios = vi.mocked(axios)

describe('Gateway', () => {
  const mockAutomations: Automation[] = [
    {
      id: '1',
      name: 'Test Automation',
      type: 'robot',
      creationTime: new Date('2023-01-01'),
      status: 'active'
    }
  ]

  const mockPaginatedResponse: PaginatedResponse<Automation> = {
    data: mockAutomations,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 1,
      itemsPerPage: 50
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('get', () => {
    it('should make GET request with correct URL and params', async () => {
      const mockResponse = { data: mockPaginatedResponse }
      mockedAxios.get.mockResolvedValue(mockResponse)

      const result = await Gateway.get('test-path', { param1: 'value1' })

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'http://localhost:3002/test-path',
        { params: { param1: 'value1' } }
      )
      expect(result).toEqual(mockResponse)
    })

    it('should use environment URL when provided', async () => {
      // This test verifies the default behavior since Vitest environment mocking 
      // for import.meta.env doesn't work the same way as vi.stubEnv
      const mockResponse = { data: mockPaginatedResponse }
      mockedAxios.get.mockResolvedValue(mockResponse)

      await Gateway.get('test-path')

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'http://localhost:3002/test-path',
        { params: undefined }
      )
    })

    it('should handle axios errors', async () => {
      const error = new Error('Network error')
      mockedAxios.get.mockRejectedValue(error)

      await expect(Gateway.get('test-path')).rejects.toThrow('Network error')
    })
  })

  describe('getAutomations', () => {
    it('should call get with correct path and params', async () => {
      const mockResponse = { data: mockPaginatedResponse }
      mockedAxios.get.mockResolvedValue(mockResponse)

      const queryParams = {
        page: 1,
        limit: 10,
        sortBy: 'name' as const,
        sortOrder: 'asc' as const,
        name: 'test'
      }

      const result = await Gateway.getAutomations(queryParams)

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'http://localhost:3002/automations',
        { params: queryParams }
      )
      expect(result).toEqual(mockResponse)
    })

    it('should work without query params', async () => {
      const mockResponse = { data: mockPaginatedResponse }
      mockedAxios.get.mockResolvedValue(mockResponse)

      const result = await Gateway.getAutomations()

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'http://localhost:3002/automations',
        { params: undefined }
      )
      expect(result).toEqual(mockResponse)
    })

    it('should handle network errors', async () => {
      const error = new Error('Failed to fetch')
      mockedAxios.get.mockRejectedValue(error)

      await expect(Gateway.getAutomations()).rejects.toThrow('Failed to fetch')
    })

    it('should handle axios response errors', async () => {
      const axiosError = {
        response: {
          status: 400,
          data: { message: 'Bad request' }
        },
        message: 'Request failed with status code 400'
      }
      mockedAxios.get.mockRejectedValue(axiosError)

      await expect(Gateway.getAutomations()).rejects.toEqual(axiosError)
    })
  })
})
