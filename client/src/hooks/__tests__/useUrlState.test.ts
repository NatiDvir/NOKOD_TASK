import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import useUrlState from '../useUrlState'
import type { AutomationQueryParams } from '@sharedTypes/types'

// Mock window location and history
const mockPushState = vi.fn()
const mockAddEventListener = vi.fn()
const mockRemoveEventListener = vi.fn()

Object.defineProperty(window, 'location', {
  value: {
    pathname: '/automations',
    search: '',
  },
  writable: true,
})

Object.defineProperty(window, 'history', {
  value: {
    pushState: mockPushState,
  },
  writable: true,
})

Object.defineProperty(window, 'addEventListener', {
  value: mockAddEventListener,
  writable: true,
})

Object.defineProperty(window, 'removeEventListener', {
  value: mockRemoveEventListener,
  writable: true,
})

describe('useUrlState', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset window.location.search
    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/automations',
        search: '',
      },
      writable: true,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should initialize with default query params', () => {
    const { result } = renderHook(() => useUrlState())

    expect(result.current.queryParams).toEqual({
      page: 1,
      limit: 50,
      sortBy: undefined,
      sortOrder: 'asc',
      name: undefined,
      type: undefined,
      status: undefined,
      creationTime: undefined
    })
  })

  it('should initialize with URL parameters', () => {
    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/automations',
        search: '?page=2&limit=25&sortBy=name&sortOrder=desc&name=test&type=robot&status=active',
      },
      writable: true,
    })

    const { result } = renderHook(() => useUrlState())

    expect(result.current.queryParams).toEqual({
      page: 2,
      limit: 25,
      sortBy: 'name',
      sortOrder: 'desc',
      name: 'test',
      type: 'robot',
      status: 'active',
      creationTime: undefined
    })
  })

  it('should handle partial URL parameters', () => {
    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/automations',
        search: '?page=3&name=automation',
      },
      writable: true,
    })

    const { result } = renderHook(() => useUrlState())

    expect(result.current.queryParams).toEqual({
      page: 3,
      limit: 50,
      sortBy: undefined,
      sortOrder: 'asc',
      name: 'automation',
      type: undefined,
      status: undefined,
      creationTime: undefined
    })
  })

  it('should update query params and URL', () => {
    const { result } = renderHook(() => useUrlState())

    act(() => {
      result.current.updateQueryParams({
        page: 2,
        name: 'test automation'
      })
    })

    expect(result.current.queryParams).toEqual({
      page: 2,
      limit: 50,
      sortBy: undefined,
      sortOrder: 'asc',
      name: 'test automation',
      type: undefined,
      status: undefined,
      creationTime: undefined
    })

    expect(mockPushState).toHaveBeenCalledWith(
      {},
      '',
      '/automations?page=2&limit=50&name=test+automation'
    )
  })

  it('should update query params with sorting', () => {
    const { result } = renderHook(() => useUrlState())

    act(() => {
      result.current.updateQueryParams({
        sortBy: 'creationTime',
        sortOrder: 'desc'
      })
    })

    expect(result.current.queryParams).toEqual({
      page: 1,
      limit: 50,
      sortBy: 'creationTime',
      sortOrder: 'desc',
      name: undefined,
      type: undefined,
      status: undefined,
      creationTime: undefined
    })

    expect(mockPushState).toHaveBeenCalledWith(
      {},
      '',
      '/automations?page=1&limit=50&sortBy=creationTime&sortOrder=desc'
    )
  })

  it('should handle clearing filters', () => {
    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/automations',
        search: '?page=2&name=test&type=robot',
      },
      writable: true,
    })

    const { result } = renderHook(() => useUrlState())

    act(() => {
      result.current.updateQueryParams({
        name: undefined,
        type: undefined,
        page: 1
      })
    })

    expect(result.current.queryParams).toEqual({
      page: 1,
      limit: 50,
      sortBy: undefined,
      sortOrder: 'asc',
      name: undefined,
      type: undefined,
      status: undefined,
      creationTime: undefined
    })

    expect(mockPushState).toHaveBeenCalledWith(
      {},
      '',
      '/automations?page=1&limit=50'
    )
  })

  it('should handle empty URL when no meaningful params', () => {
    const { result } = renderHook(() => useUrlState())

    act(() => {
      result.current.updateQueryParams({
        page: 1,
        limit: 50
      })
    })

    expect(mockPushState).toHaveBeenCalledWith(
      {},
      '',
      '/automations?page=1&limit=50'
    )
  })

  it('should set up popstate event listener', () => {
    renderHook(() => useUrlState())

    expect(mockAddEventListener).toHaveBeenCalledWith(
      'popstate',
      expect.any(Function)
    )
  })

  it('should clean up popstate event listener', () => {
    const { unmount } = renderHook(() => useUrlState())

    unmount()

    expect(mockRemoveEventListener).toHaveBeenCalledWith(
      'popstate',
      expect.any(Function)
    )
  })

  it('should handle invalid numeric parameters', () => {
    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/automations',
        search: '?page=invalid&limit=notanumber',
      },
      writable: true,
    })

    const { result } = renderHook(() => useUrlState())

    expect(result.current.queryParams).toEqual({
      page: NaN, // parseInt returns NaN for invalid values
      limit: NaN, // parseInt returns NaN for invalid values
      sortBy: undefined,
      sortOrder: 'asc',
      name: undefined,
      type: undefined,
      status: undefined,
      creationTime: undefined
    })
  })

  it('should handle complex filter combinations', () => {
    const { result } = renderHook(() => useUrlState())

    act(() => {
      result.current.updateQueryParams({
        page: 3,
        limit: 25,
        sortBy: 'name',
        sortOrder: 'desc',
        name: 'automation test',
        type: 'flow',
        status: 'active',
        creationTime: '2023-01-01'
      })
    })

    expect(result.current.queryParams).toEqual({
      page: 3,
      limit: 25,
      sortBy: 'name',
      sortOrder: 'desc',
      name: 'automation test',
      type: 'flow',
      status: 'active',
      creationTime: '2023-01-01'
    })

    expect(mockPushState).toHaveBeenCalledWith(
      {},
      '',
      '/automations?page=3&limit=25&sortBy=name&sortOrder=desc&name=automation+test&type=flow&status=active&creationTime=2023-01-01'
    )
  })
})
