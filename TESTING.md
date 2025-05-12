# Testing Guide for Document Management Application

This guide outlines the testing strategy and provides examples for writing tests for the Document Management Application.

## Testing Philosophy

Our testing approach follows the "Testing Trophy" pattern:

- **Unit Tests**: Small, fast tests that verify individual functions or components in isolation
- **Integration Tests**: Tests that verify how components work together
- **End-to-End Tests**: Tests that simulate user behavior in a complete application environment

## Testing Setup

The project uses the following testing tools:

- **Jest**: Test runner and assertion library
- **React Testing Library**: DOM testing utilities for React components
- **MSW (Mock Service Worker)**: API mocking library for testing data fetching

## Directory Structure

```
__tests__/              # Main test directory
├── components/         # Component tests
├── api/                # API and data fetching tests
├── pages/              # Page component tests
└── test-utils.tsx      # Testing utilities and custom renders
__mocks__/              # Mock files for CSS and assets
```

## Writing Tests

### Component Testing

Component tests verify that UI components render correctly and respond to user interactions.

```tsx
// Example component test
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "@/components/ui/button";

test("button calls onClick when clicked", async () => {
  const handleClick = jest.fn();
  const user = userEvent.setup();

  render(<Button onClick={handleClick}>Click Me</Button>);
  const button = screen.getByRole("button", { name: /click me/i });

  await user.click(button);
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

### API Testing

API tests verify that data fetching and mutations work as expected.

```tsx
// Example API test using MSW
import { rest } from "msw";
import { setupServer } from "msw/node";

const server = setupServer(
  rest.get("/api/documents", (req, res, ctx) => {
    return res(ctx.json({ documents: [] }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("fetches documents", async () => {
  // Test implementation
});
```

### Page Testing

Page tests verify that entire pages work as expected.

```tsx
// Example page test
import { render, screen } from "../test-utils";
import DocumentList from "@/app/documents/page";

test("renders document list page", () => {
  render(<DocumentList />);
  expect(screen.getByText(/documents/i)).toBeInTheDocument();
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
```

## Best Practices

1. **Test behavior, not implementation**: Focus on what the component does, not how it's implemented
2. **Use meaningful assertions**: Ensure your tests verify the right things
3. **Keep tests isolated**: Tests should not depend on each other
4. **Mock external dependencies**: Use MSW to mock API calls
5. **Use user-centric queries**: Prefer queries like `getByRole`, `getByLabelText`, and `getByText` over `getByTestId`

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [MSW Documentation](https://mswjs.io/docs/)
