import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginPage from "@/app/(auth)/login/page";
import { useRouter } from "next/navigation";
import * as authService from "@/lib/services/authService";

// Mock the next/navigation module
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock the auth service
jest.mock("@/lib/services/authService", () => ({
  loginAPI: jest.fn(),
}));

// Mock the auth context
jest.mock("@/lib/context/AuthContext", () => ({
  useAuth: jest.fn(() => ({
    state: { isAuthenticated: false },
    dispatch: jest.fn(),
  })),
}));

// Mock Sonner toast
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("LoginPage", () => {
  // Setup common test variables and reset mocks before each test
  const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  test("renders the login form and test credentials correctly", () => {
    render(<LoginPage />);

    // Check if the login form is rendered
    expect(
      screen.getByRole("heading", { name: /login to document manager/i })
    ).toBeInTheDocument();

    // Check if test credentials are displayed
    expect(screen.getByText(/test credentials/i)).toBeInTheDocument();
    expect(screen.getByText(/admin user:/i)).toBeInTheDocument();
    expect(screen.getByText(/editor user:/i)).toBeInTheDocument();
    expect(screen.getByText(/viewer user:/i)).toBeInTheDocument();

    // Check if the form fields are rendered
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", { name: /remember me/i })
    ).toBeInTheDocument();

    // Check if login button is present
    expect(screen.getByRole("button", { name: /login$/i })).toBeInTheDocument();

    // Check if the "Create an account" link is present
    expect(
      screen.getByRole("link", { name: /create an account/i })
    ).toBeInTheDocument();
  });

  test("submits the form with valid credentials", async () => {
    const user = userEvent.setup();
    const mockUser = {
      id: "1",
      name: "Test User",
      email: "test@example.com",
      role: "admin",
    };
    (authService.loginAPI as jest.Mock).mockResolvedValue(mockUser);

    render(<LoginPage />);

    // Fill in the form
    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/password/i), "password");

    // Click the login button
    await user.click(screen.getByRole("button", { name: /login$/i }));

    // Wait for the form submission to complete
    await waitFor(() => {
      expect(authService.loginAPI).toHaveBeenCalledWith(
        "test@example.com",
        "password"
      );
    });

    // Check if router.push was called with the correct path
    expect(mockRouter.push).toHaveBeenCalledWith("/");
  });

  test("shows error state for empty form fields", async () => {
    const user = userEvent.setup();

    render(<LoginPage />);

    // Submit without filling in any fields
    await user.click(screen.getByRole("button", { name: /login$/i }));

    // Check if error messages are displayed
    await waitFor(() => {
      expect(
        screen.getByText(/please enter a valid email address/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/password must be at least 4 characters long/i)
      ).toBeInTheDocument();
    });
  });

  test("shows error state for invalid email format", async () => {
    const user = userEvent.setup();

    render(<LoginPage />);

    // Fill in form with invalid email
    await user.type(screen.getByLabelText(/email/i), "invalid-email");
    await user.type(screen.getByLabelText(/password/i), "password");

    // Submit the form
    await user.click(screen.getByRole("button", { name: /login$/i }));

    // Check if error message for email is displayed
    await waitFor(() => {
      expect(
        screen.getByText(/please enter a valid email address/i)
      ).toBeInTheDocument();
    });
  });

  test("shows error state for too short password", async () => {
    const user = userEvent.setup();

    render(<LoginPage />);

    // Fill in form with too short password
    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/password/i), "pwd");

    // Submit the form
    await user.click(screen.getByRole("button", { name: /login$/i }));

    // Check if error message for password is displayed
    await waitFor(() => {
      expect(
        screen.getByText(/password must be at least 4 characters long/i)
      ).toBeInTheDocument();
    });
  });

  test("handles login failure", async () => {
    const user = userEvent.setup();
    const mockError = new Error("Invalid credentials");
    (authService.loginAPI as jest.Mock).mockRejectedValue(mockError);

    render(<LoginPage />);

    // Fill in the form
    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/password/i), "password");

    // Submit the form
    await user.click(screen.getByRole("button", { name: /login$/i }));

    // Wait for the form submission to fail
    await waitFor(() => {
      expect(authService.loginAPI).toHaveBeenCalledWith(
        "test@example.com",
        "password"
      );
    });

    // Verify that the router was not called
    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  test("toggles remember me checkbox", async () => {
    const user = userEvent.setup();

    render(<LoginPage />);

    const checkbox = screen.getByRole("checkbox", { name: /remember me/i });

    // Check initial state
    expect(checkbox).not.toBeChecked();

    // Toggle the checkbox
    await user.click(checkbox);

    // Verify it's checked
    expect(checkbox).toBeChecked();

    // Toggle again
    await user.click(checkbox);

    // Verify it's unchecked
    expect(checkbox).not.toBeChecked();
  });

  test("navigates to signup page when clicking the create account link", async () => {
    const user = userEvent.setup();

    render(<LoginPage />);

    // Click on the create account link
    await user.click(screen.getByRole("link", { name: /create an account/i }));

    // In a real Next.js app, this would navigate to the signup page
    // Since we're using mocks, we just verify the link has the correct href
    expect(
      screen.getByRole("link", { name: /create an account/i })
    ).toHaveAttribute("href", "/signup");
  });

  test("navigates to forgot password page when clicking the forgot password link", async () => {
    const user = userEvent.setup();

    render(<LoginPage />);

    // Click on the forgot password link
    await user.click(screen.getByRole("link", { name: /forgot password/i }));

    // Verify the link has the correct href
    expect(
      screen.getByRole("link", { name: /forgot password/i })
    ).toHaveAttribute("href", "/forgot-password");
  });

  test("disables login button while submitting", async () => {
    const user = userEvent.setup();
    // Make the login API call delay before resolving
    (authService.loginAPI as jest.Mock).mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(
            () =>
              resolve({
                id: "1",
                name: "Test User",
                email: "test@example.com",
                role: "admin",
              }),
            100
          );
        })
    );

    render(<LoginPage />);

    // Fill in the form
    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/password/i), "password");

    // Submit the form
    await user.click(screen.getByRole("button", { name: /login$/i }));

    // Verify button text changes to "Logging in..."
    expect(
      screen.getByRole("button", { name: /logging in/i })
    ).toBeInTheDocument();

    // Verify button is disabled
    expect(screen.getByRole("button", { name: /logging in/i })).toBeDisabled();

    // Wait for login to complete
    await waitFor(() => {
      expect(authService.loginAPI).toHaveBeenCalled();
    });
  });
});
