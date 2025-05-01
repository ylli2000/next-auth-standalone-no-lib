# Testing Documentation

This project uses Jest and React Testing Library for testing. This README provides an overview of the testing structure and guidelines.

## Test Structure

```
src/__tests__/
├── components/    # Tests for React components
│   └── auth/      # Authentication component tests
├── hooks/         # Tests for custom hooks
├── lib/           # Tests for library code/utilities
│   ├── session/   # Session management tests
│   └── store/     # State management tests
├── pages/         # Tests for page components
├── utils/         # Test utilities
└── README.md      # This file
```

## Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode (for development)
pnpm test:watch

# Generate test coverage report
pnpm test:coverage
```

## Writing Tests

### Test File Naming

Test files should be named after the module they test with a `.test.tsx` or `.test.ts` extension.

### Test Utilities

The `src/__tests__/utils/test-utils.tsx` file provides common testing utilities, including a custom `render` function that includes necessary providers.

### Mocking

#### External Libraries

- For mocking external libraries, use Jest's `jest.mock()` function.
- For mocking API calls, use `jest-fetch-mock` which is configured in jest.setup.js.

#### Zustand Store Mocking

We use two approaches to mock Zustand stores:

1. **For component tests**: Mock the store module directly with a simplified implementation:

    ```typescript
    jest.mock('@/lib/store/authStore', () => ({
        useAuthStore: {
            getState: jest.fn().mockReturnValue({
                // mock state and functions
            })
        }
    }));
    ```

2. **For store tests**: Create a mock state object and functions to test store behavior:

    ```typescript
    // Create a mock state
    let mockState = {
        /* initial state */
    };

    // Mock the store functions
    const mockLogin = jest.fn();

    // Setup mock implementation
    jest.mock('@/lib/store/authStore', () => ({
        useAuthStore: {
            getState: jest.fn(() => ({
                ...mockState,
                login: mockLogin
            })),
            setState: jest.fn((newState) => {
                mockState = { ...mockState, ...newState };
            })
        }
    }));
    ```

#### Next.js Features

- Next.js Router is mocked in jest.setup.js
- For cookies and headers, we use custom mocks:
    ```typescript
    jest.mock('next/headers', () => ({
        cookies: jest.fn().mockReturnValue({
            get: jest.fn(),
            set: jest.fn()
        })
    }));
    ```

#### Redis

Redis client is mocked to avoid actual database interactions:

```typescript
jest.mock('@/lib/redis/client', () => ({
    redisClient: {
        set: jest.fn(),
        get: jest.fn(),
        del: jest.fn(),
        expire: jest.fn()
    }
}));
```

### React Testing Best Practices

1. Always wrap state updates in `act()` to avoid React warnings:

    ```typescript
    await act(async () => {
        fireEvent.click(button);
    });
    ```

2. For handling expected errors in tests, temporarily mock console methods:
    ```typescript
    const originalConsoleError = console.error;
    console.error = jest.fn();
    try {
        // Test code that would log errors
    } finally {
        console.error = originalConsoleError;
    }
    ```

### Examples

See existing tests for examples of how to:

- Test components with user interactions (see `RegisterForm.test.tsx`)
- Mock Zustand stores (see `authStore.test.ts` and `Navbar.test.tsx`)
- Test authenticated and unauthenticated states (see `middleware.test.ts`)
- Test asynchronous functionality (see `sessionManager.test.ts`)

## Best Practices

1. Focus on user behavior, not implementation details
2. Use screen queries that resemble how users would interact with the app
3. Prefer `getBy*` for elements that should be in the document
4. Use `queryBy*` for elements that might not exist
5. Use `findBy*` for elements that appear asynchronously
6. Test both success and error states
7. Keep tests simple and focused on a single behavior
8. Use data-testid sparingly, prefer semantic queries
9. Match actual text in components rather than assuming specific error messages
