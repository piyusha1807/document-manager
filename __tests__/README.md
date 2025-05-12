# Tests Directory

This directory contains all the test files for the Document Management Application. Please follow these guidelines when writing tests.

## Directory Structure

```
__tests__/
├── components/       # Tests for React components
├── api/              # Tests for API endpoints and data fetching
├── hooks/            # Tests for custom hooks
├── utils/            # Tests for utility functions
├── pages/            # Tests for page components
└── test-utils.tsx    # Testing utilities and custom renders
```

## Test File Naming Conventions

- Test files should be named after the file they are testing with `.test.ts` or `.test.tsx` extension
- Example: `Button.tsx` → `Button.test.tsx`

## Writing Component Tests

```tsx
import { render, screen } from "../test-utils";
import { Button } from "@/components/ui/button";
import userEvent from "@testing-library/user-event";

describe("Button component", () => {
  test("renders button with text", () => {
    render(<Button>Click me</Button>);

    expect(
      screen.getByRole("button", { name: /click me/i })
    ).toBeInTheDocument();
  });

  test("calls onClick handler when clicked", async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Click me</Button>);
    const button = screen.getByRole("button", { name: /click me/i });

    await user.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## Testing API Endpoints

```tsx
import { rest } from "msw";
import { setupServer } from "msw/node";
import { renderHook, waitFor } from "@testing-library/react";

// Set up MSW server
const server = setupServer(
  rest.get("/api/endpoint", (_req, res, ctx) => {
    return res(ctx.json({ data: "mocked data" }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Write tests...
```

## Testing Custom Hooks

```tsx
import { renderHook, act } from "@testing-library/react";
import { useCounter } from "@/hooks/useCounter";

describe("useCounter hook", () => {
  test("increments counter", () => {
    const { result } = renderHook(() => useCounter(0));

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });
});
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run specific test file
npx jest path/to/file.test.tsx
```

## Common Assertions

- `expect(element).toBeInTheDocument()` - Element exists in the document
- `expect(element).toHaveTextContent('text')` - Element contains the specified text
- `expect(element).toBeDisabled()` - Element is disabled
- `expect(element).toHaveClass('class-name')` - Element has the specified class
- `expect(mockFn).toHaveBeenCalled()` - Function was called
- `expect(mockFn).toHaveBeenCalledWith(arg1, arg2)` - Function was called with the specified arguments

For more assertions, see:

- [Jest Matchers](https://jestjs.io/docs/expect)
- [Testing Library Assertions](https://testing-library.com/docs/react-testing-library/cheatsheet/)
