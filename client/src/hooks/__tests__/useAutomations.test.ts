import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import useAutomations from '../useAutomations'
import Gateway from '@src/api/gateway'
import type { Automation, PaginatedResponse, AutomationQueryParams } from '@sharedTypes/types'

// Mock Gateway
vi.mock('@src/api/gateway')
const mockedGateway = vi.mocked(Gateway)

describe('useAutomations', () => {
  const mockAutomations: Automation[] = [
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
    }
  ]

  const mockPaginatedResponse: PaginatedResponse<Automation> = {
    data: mockAutomations,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 2,
      itemsPerPage: 50
    }
  }

  const mockAllAutomationsResponse: PaginatedResponse<Automation> = {
    data: mockAutomations,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 2,
      itemsPerPage: 50000
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()
    // Mock console.error to avoid noise in tests
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should fetch automations on mount', async () => {
    mockedGateway.getAutomations
      .mockResolvedValueOnce({ data: mockPaginatedResponse })
      .mockResolvedValueOnce({ data: mockAllAutomationsResponse })

    const queryParams: AutomationQueryParams = { page: 1, limit: 10 }
    const { result } = renderHook(() => useAutomations(queryParams))

    expect(result.current.loading).toBe(true)
    expect(result.current.data).toBe(null)
    expect(result.current.error).toBe(null)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.data).toEqual(mockPaginatedResponse)
    expect(result.current.error).toBe(null)
    expect(mockedGateway.getAutomations).toHaveBeenCalledWith(queryParams)
  })

  it('should fetch all automations for filters', async () => {
    mockedGateway.getAutomations
      .mockResolvedValueOnce({ data: mockPaginatedResponse })
      .mockResolvedValueOnce({ data: mockAllAutomationsResponse })

    const queryParams: AutomationQueryParams = { page: 1, limit: 10 }
    const { result } = renderHook(() => useAutomations(queryParams))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.allAutomations).toEqual(mockAutomations)
    expect(mockedGateway.getAutomations).toHaveBeenCalledWith({ page: 1, limit: 50000 })
  })

  it('should handle fetch error gracefully', async () => {
    const error = {
      response: {
        data: { message: 'Server error' }
      }
    }
    mockedGateway.getAutomations.mockRejectedValue(error)

    const queryParams: AutomationQueryParams = { page: 1, limit: 10 }
    const { result } = renderHook(() => useAutomations(queryParams))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe('Server error')
    expect(result.current.data).toBe(null)
  })

  it('should handle fetch error without response', async () => {
    const error = new Error('Network error')
    mockedGateway.getAutomations.mockRejectedValue(error)

    const queryParams: AutomationQueryParams = { page: 1, limit: 10 }
    const { result } = renderHook(() => useAutomations(queryParams))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe('Network error')
    expect(result.current.data).toBe(null)
  })

  it('should handle fetch error with fallback message', async () => {
    const error = {}
    mockedGateway.getAutomations.mockRejectedValue(error)

    const queryParams: AutomationQueryParams = { page: 1, limit: 10 }
    const { result } = renderHook(() => useAutomations(queryParams))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe('Failed to fetch automations')
    expect(result.current.data).toBe(null)
  })

  it('should refetch data when called', async () => {
    mockedGateway.getAutomations
      .mockResolvedValueOnce({ data: mockPaginatedResponse })
      .mockResolvedValueOnce({ data: mockAllAutomationsResponse })
      .mockResolvedValueOnce({ data: mockPaginatedResponse })

    const queryParams: AutomationQueryParams = { page: 1, limit: 10 }
    const { result } = renderHook(() => useAutomations(queryParams))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Call refetch
    await result.current.refetch()

    expect(mockedGateway.getAutomations).toHaveBeenCalledTimes(3)
  })

  it('should refetch when queryParams change', async () => {
    mockedGateway.getAutomations
      .mockResolvedValueOnce({ data: mockPaginatedResponse })
      .mockResolvedValueOnce({ data: mockAllAutomationsResponse })
      .mockResolvedValueOnce({ data: mockPaginatedResponse })

    const initialParams: AutomationQueryParams = { page: 1, limit: 10 }
    const { result, rerender } = renderHook(
      ({ queryParams }) => useAutomations(queryParams),
      { initialProps: { queryParams: initialParams } }
    )

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Change query params
    const newParams: AutomationQueryParams = { page: 2, limit: 10 }
    rerender({ queryParams: newParams })

    await waitFor(() => {
      expect(mockedGateway.getAutomations).toHaveBeenCalledWith(newParams)
    })
  })

  it('should handle all automations fetch error', async () => {
    mockedGateway.getAutomations
      .mockResolvedValueOnce({ data: mockPaginatedResponse })
      .mockRejectedValueOnce(new Error('Failed to fetch all'))

    const queryParams: AutomationQueryParams = { page: 1, limit: 10 }
    const { result } = renderHook(() => useAutomations(queryParams))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.allAutomations).toEqual([])
    expect(console.error).toHaveBeenCalledWith(
      'Error fetching all automations for filters:',
      expect.any(Error)
    )
  })

  it('should handle backward compatibility for array response', async () => {
    mockedGateway.getAutomations
      .mockResolvedValueOnce({ data: mockPaginatedResponse })
      .mockResolvedValueOnce({ data: mockAutomations as any })

    const queryParams: AutomationQueryParams = { page: 1, limit: 10 }
    const { result } = renderHook(() => useAutomations(queryParams))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.allAutomations).toEqual(mockAutomations)
  })

  it('should not fetch all automations if already loaded', async () => {
    mockedGateway.getAutomations
      .mockResolvedValueOnce({ data: mockPaginatedResponse })
      .mockResolvedValueOnce({ data: mockAllAutomationsResponse })

    const queryParams: AutomationQueryParams = { page: 1, limit: 10 }
    const { result, rerender } = renderHook(
      ({ queryParams }) => useAutomations(queryParams),
      { initialProps: { queryParams } }
    )

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Change query params but keep allAutomations loaded
    const newParams: AutomationQueryParams = { page: 2, limit: 10 }
    mockedGateway.getAutomations.mockResolvedValueOnce({ data: mockPaginatedResponse })
    
    rerender({ queryParams: newParams })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Should only call getAutomations 3 times (initial fetch + all automations + new query)
    expect(mockedGateway.getAutomations).toHaveBeenCalledTimes(3)
  })
})
