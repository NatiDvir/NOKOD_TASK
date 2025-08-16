#!/bin/bash

# Test runner script for fullstack-task project
# This script helps run different types of tests locally

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if dependencies are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if [ ! -d "server/node_modules" ]; then
        print_warning "Server dependencies not found. Installing..."
        cd server && npm install && cd ..
    fi
    
    if [ ! -d "client/node_modules" ]; then
        print_warning "Client dependencies not found. Installing..."
        cd client && npm install && cd ..
    fi
    
    print_status "Dependencies check complete."
}

# Function to run server tests
run_server_tests() {
    print_status "Running server tests..."
    cd server
    npm test
    cd ..
    print_status "Server tests completed."
}

# Function to run client tests
run_client_tests() {
    print_status "Running client tests..."
    cd client
    npm run test:run
    cd ..
    print_status "Client tests completed."
}

# Function to run coverage reports
run_coverage() {
    print_status "Generating coverage reports..."
    
    print_status "Server coverage..."
    cd server
    npm run test:coverage
    cd ..
    
    print_status "Client coverage..."
    cd client
    npm run test:coverage
    cd ..
    
    print_status "Coverage reports generated."
    print_status "Server coverage: server/coverage/lcov-report/index.html"
    print_status "Client coverage: client/coverage/index.html"
}

# Function to run linting
run_lint() {
    print_status "Running linting..."
    cd client
    npm run lint
    cd ..
    print_status "Linting completed."
}

# Function to run integration tests
run_integration_tests() {
    print_status "Running integration tests..."
    
    # Start server in background
    print_status "Starting server..."
    cd server
    npm start &
    SERVER_PID=$!
    cd ..
    
    # Wait for server to be ready
    print_status "Waiting for server to be ready..."
    npx wait-on http://localhost:3002/api/health --timeout 30000
    
    if [ $? -eq 0 ]; then
        print_status "Server is ready. Running integration tests..."
        cd server
        npm test -- --testPathPattern=integration
        cd ..
        print_status "Integration tests completed."
    else
        print_error "Server failed to start within timeout."
        kill $SERVER_PID 2>/dev/null || true
        exit 1
    fi
    
    # Stop server
    print_status "Stopping server..."
    kill $SERVER_PID 2>/dev/null || true
    print_status "Server stopped."
}

# Main script logic
main() {
    case "$1" in
        "server")
            check_dependencies
            run_server_tests
            ;;
        "client")
            check_dependencies
            run_client_tests
            ;;
        "lint")
            check_dependencies
            run_lint
            ;;
        "coverage")
            check_dependencies
            run_coverage
            ;;
        "integration")
            check_dependencies
            run_integration_tests
            ;;
        "all")
            check_dependencies
            run_lint
            run_server_tests
            run_client_tests
            run_integration_tests
            ;;
        "ci")
            # CI mode - run all tests like in CI environment
            check_dependencies
            run_lint
            run_server_tests
            run_client_tests
            run_coverage
            ;;
        *)
            echo "Usage: $0 {server|client|lint|coverage|integration|all|ci}"
            echo ""
            echo "Commands:"
            echo "  server      - Run server tests only"
            echo "  client      - Run client tests only"
            echo "  lint        - Run linting"
            echo "  coverage    - Generate coverage reports"
            echo "  integration - Run integration tests"
            echo "  all         - Run all tests and linting"
            echo "  ci          - Run tests like in CI environment"
            echo ""
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"
