# Fullstack Automations Table

A modern fullstack application for managing automation data with advanced filtering, sorting, and pagination capabilities.

## 📑 Table of Contents
1. [Overview](#overview)
2. [Key Features](#key-features)
3. [Installation & Setup](#installation--setup)
4. [Testing](#testing)
5. [Project Structure](#project-structure)
6. [API Documentation](#api-documentation)
7. [Architecture Notes](#architecture-notes)
    
## Overview

This project implements a comprehensive data management interface with:
- **Frontend**: React 18 + Material-UI + TypeScript
- **Backend**: Express.js + TypeScript
- **Data**: JSON-based with in-memory processing

The application handles large datasets (~7000+ records) efficiently with server-side processing and smart frontend optimizations.

## Key Features

### ✅ Core Functionality
* **Server-Side Pagination**: Configurable page sizes (10, 25, 50, 100)
* **Multi-Column Sorting**: All columns sortable with visual indicators
* **Advanced Filtering**: Auto-populated dropdowns with search functionality
* **URL State Management**: Shareable URLs maintain current view state
* **Responsive Design**: Clean, professional Material-UI interface

### ✅ Technical Highlights
* **Type Safety**: Full TypeScript implementation across stack
* **Performance Optimized**: Efficient filtering and minimal re-renders
* **Error Handling**: Comprehensive error states and loading indicators
* **Smart Dropdowns**: Autocomplete filters handle large datasets gracefully
* **Real-time Updates**: Instant feedback on all user interactions

## Installation & Setup

### Prerequisites
- Node.js (v16+)
- npm

### Quick Start
```bash
# Clone repository
git clone [repository-url]
cd fullstack-task

# Install all dependencies
npm run install:all

# Start both server and client
npm run dev
```

### Manual Setup
```bash
# Backend (runs on http://localhost:3002)
cd server
npm install
npm start

# Frontend (runs on http://localhost:5173)
cd client
npm install
npm run dev
```

## Testing

Comprehensive test suite with 87 tests covering both frontend and backend:

### Test Coverage
- **Server**: 36 tests (Jest + Supertest)
  - Unit tests for data layer (AutomationRepo)
  - Controller tests (AutomationsCtrl)
  - Integration tests for API endpoints
- **Client**: 51 tests (Vitest + React Testing Library)
  - API gateway tests
  - Custom React hooks (useAutomations, useUrlState)
  - Component tests (AutomationTable)
  - Utility function tests

### Running Tests
```bash
# From project root
npm test                    # Run all tests (server + client)
npm run test:server        # Backend only
npm run test:client        # Frontend only
npm run test:coverage      # Coverage reports for both

# From specific directories
cd server && npm test       # Server tests
cd server && npm run test:watch    # Server tests (watch mode)
cd server && npm run test:coverage # Server coverage

cd client && npm test       # Client tests (watch mode)
cd client && npm run test:run      # Client tests (run once)
cd client && npm run test:coverage # Client coverage
```

### Test Features
- **Isolated**: Each test runs independently with proper mocking
- **Comprehensive**: Unit, integration, and component tests
- **Fast**: Parallel execution with efficient test runners
- **Reliable**: Consistent results across environments

## Project Structure
```
fullstack-task/
├── client/                     # React frontend
│   ├── src/
│   │   ├── components/         # AutomationsTable components
│   │   ├── hooks/              # useAutomations, useUrlState
│   │   ├── api/                # HTTP client (Gateway)
│   │   └── __tests__/          # Test files
├── server/                     # Express backend
│   ├── src/
│   │   ├── automations/        # Core business logic
│   │   ├── http/               # Route definitions
│   │   └── __tests__/          # Test files
├── types.lib/                  # Shared TypeScript types
└── package.json                # Root scripts
```

## API Documentation

### Get Automations
```
GET /automations?page=1&limit=25&sortBy=name&sortOrder=asc&name=test&type=robot&status=active
```

**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 50, max: 50000)
- `sortBy` (optional): Sort column (id | name | type | status | creationTime)
- `sortOrder` (optional): Sort direction (asc | desc, default: asc)
- `name` (optional): Filter by automation name (partial match)
- `type` (optional): Filter by automation type (exact match)
- `status` (optional): Filter by status (exact match)
- `creationTime` (optional): Filter by creation date

**Response Format**:
```json
{
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Sample Automation",
      "type": "robot",
      "status": "active",
      "creationTime": "2023-10-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 45,
    "totalItems": 1120,
    "itemsPerPage": 25
  }
}
```

## Architecture & Design Decisions

### Key Design Choices

**Server-Side Processing**: Handles 7000+ records efficiently with in-memory filtering/sorting rather than client-side processing to prevent UI lag and reduce bandwidth.

**Repository Pattern**: Separates data access from business logic, making it easy to swap from JSON files to database without changing controllers.

**URL State Management**: Browser URL as single source of truth eliminates state sync issues and enables shareable filtered views.

**TypeScript Throughout**: Shared type definitions prevent integration bugs and improve maintainability across the full stack.

**Autocomplete Filters**: Handles 100+ filter options with search functionality instead of unwieldy dropdown menus.

### Scalability Considerations

- **Current (7k records)**: JSON file + in-memory processing
- **Growth (100k+ records)**: Database + caching layer  
- **Enterprise (1M+ records)**: Sharding + search service

The architecture balances simplicity for the current dataset size while providing a clear evolution path for larger scale requirements.

### Dependencies

**Backend**: Express.js, TypeScript, CORS, Jest, Supertest
**Frontend**: React 18, Material-UI v6, Vite, Axios, Vitest, React Testing Library
