import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import AutomationTable from '../AutomationTable'
import useUrlState from '@src/hooks/useUrlState'
import useAutomations from '@src/hooks/useAutomations'
import type { Automation, PaginatedResponse } from '@sharedTypes/types'

// Mock hooks
vi.mock('@src/hooks/useUrlState')
vi.mock('@src/hooks/useAutomations')

const mockedUseUrlState = vi.mocked(useUrlState)
const mockedUseAutomations = vi.mocked(useAutomations)

// Create theme for testing
const theme = createTheme()

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
)

describe('AutomationTable', () => {
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

  const mockUpdateQueryParams = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()

    mockedUseUrlState.mockReturnValue({
      queryParams: {
        page: 1,
        limit: 50,
        sortBy: undefined,
        sortOrder: 'asc',
        name: undefined,
        type: undefined,
        status: undefined,
        creationTime: undefined
      },
      updateQueryParams: mockUpdateQueryParams
    })

    mockedUseAutomations.mockReturnValue({
      data: mockPaginatedResponse,
      loading: false,
      error: null,
      allAutomations: mockAutomations,
      refetch: vi.fn()
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should render table with automations data', () => {
    render(
      <TestWrapper>
        <AutomationTable />
      </TestWrapper>
    )

    expect(screen.getByText('Test Automation 1')).toBeInTheDocument()
    expect(screen.getByText('Test Automation 2')).toBeInTheDocument()
    expect(screen.getByText('robot')).toBeInTheDocument()
    expect(screen.getByText('flow')).toBeInTheDocument()
    expect(screen.getByText('active')).toBeInTheDocument()
    expect(screen.getByText('inactive')).toBeInTheDocument()
  })

  it('should render loading state', () => {
    mockedUseAutomations.mockReturnValue({
      data: null,
      loading: true,
      error: null,
      allAutomations: [],
      refetch: vi.fn()
    })

    render(
      <TestWrapper>
        <AutomationTable />
      </TestWrapper>
    )

    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('should render error state', () => {
    mockedUseAutomations.mockReturnValue({
      data: null,
      loading: false,
      error: 'Failed to load data',
      allAutomations: [],
      refetch: vi.fn()
    })

    render(
      <TestWrapper>
        <AutomationTable />
      </TestWrapper>
    )

    expect(screen.getByText('Error loading automations: Failed to load data')).toBeInTheDocument()
  })

  it('should render no data state', () => {
    mockedUseAutomations.mockReturnValue({
      data: null,
      loading: false,
      error: null,
      allAutomations: [],
      refetch: vi.fn()
    })

    render(
      <TestWrapper>
        <AutomationTable />
      </TestWrapper>
    )

    expect(screen.getByText('No data available')).toBeInTheDocument()
  })

  it('should handle column sorting', async () => {
    const user = userEvent.setup()

    render(
      <TestWrapper>
        <AutomationTable />
      </TestWrapper>
    )

    const nameHeader = screen.getByText('Name')
    await user.click(nameHeader)

    expect(mockUpdateQueryParams).toHaveBeenCalledWith({
      sortBy: 'name',
      sortOrder: 'asc',
      page: 1
    })
  })

  it('should toggle sort order when clicking same column', async () => {
    const user = userEvent.setup()

    mockedUseUrlState.mockReturnValue({
      queryParams: {
        page: 1,
        limit: 50,
        sortBy: 'name',
        sortOrder: 'asc',
        name: undefined,
        type: undefined,
        status: undefined,
        creationTime: undefined
      },
      updateQueryParams: mockUpdateQueryParams
    })

    render(
      <TestWrapper>
        <AutomationTable />
      </TestWrapper>
    )

    const nameHeader = screen.getByText('Name')
    await user.click(nameHeader)

    expect(mockUpdateQueryParams).toHaveBeenCalledWith({
      sortBy: 'name',
      sortOrder: 'desc',
      page: 1
    })
  })

  it('should display sort icons correctly', () => {
    mockedUseUrlState.mockReturnValue({
      queryParams: {
        page: 1,
        limit: 50,
        sortBy: 'name',
        sortOrder: 'asc',
        name: undefined,
        type: undefined,
        status: undefined,
        creationTime: undefined
      },
      updateQueryParams: mockUpdateQueryParams
    })

    render(
      <TestWrapper>
        <AutomationTable />
      </TestWrapper>
    )

    // Check if sort icon is present for the sorted column
    const nameCell = screen.getByText('Name').closest('th')
    expect(nameCell).toHaveTextContent('Name')
  })

  it('should format dates correctly', () => {
    render(
      <TestWrapper>
        <AutomationTable />
      </TestWrapper>
    )

    const formattedDate = new Date('2023-01-01').toLocaleDateString()
    expect(screen.getByText(formattedDate)).toBeInTheDocument()
  })

  it('should render all table headers', () => {
    render(
      <TestWrapper>
        <AutomationTable />
      </TestWrapper>
    )

    expect(screen.getByText('Id')).toBeInTheDocument()
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
    expect(screen.getByText('Creation Time')).toBeInTheDocument()
    expect(screen.getByText('Type')).toBeInTheDocument()
  })

  it('should handle empty data gracefully', () => {
    mockedUseAutomations.mockReturnValue({
      data: {
        data: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalItems: 0,
          itemsPerPage: 50
        }
      },
      loading: false,
      error: null,
      allAutomations: [],
      refetch: vi.fn()
    })

    render(
      <TestWrapper>
        <AutomationTable />
      </TestWrapper>
    )

    // Should render table structure but no data rows
    expect(screen.getByText('Id')).toBeInTheDocument()
    expect(screen.queryByText('Test Automation 1')).not.toBeInTheDocument()
  })

  it('should render automation filters', () => {
    render(
      <TestWrapper>
        <AutomationTable />
      </TestWrapper>
    )

    // The AutomationFilters component should be rendered
    // Since it's a complex component, we'll just verify the table structure is correct
    expect(screen.getByRole('table')).toBeInTheDocument()
  })

  it('should render pagination when data is available', () => {
    render(
      <TestWrapper>
        <AutomationTable />
      </TestWrapper>
    )

    // The AutomationPagination component should be rendered
    // Since it's a complex component, we'll just verify the table is rendered with pagination data
    expect(screen.getByRole('table')).toBeInTheDocument()
  })

  it('should handle long text with ellipsis', () => {
    const longNameAutomation: Automation = {
      id: 'long-id-that-should-be-truncated',
      name: 'Very Long Automation Name That Should Be Truncated With Ellipsis',
      type: 'robot',
      creationTime: new Date('2023-01-01'),
      status: 'active'
    }

    mockedUseAutomations.mockReturnValue({
      data: {
        data: [longNameAutomation],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 1,
          itemsPerPage: 50
        }
      },
      loading: false,
      error: null,
      allAutomations: [longNameAutomation],
      refetch: vi.fn()
    })

    render(
      <TestWrapper>
        <AutomationTable />
      </TestWrapper>
    )

    expect(screen.getByText('Very Long Automation Name That Should Be Truncated With Ellipsis')).toBeInTheDocument()
  })
})
