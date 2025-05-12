import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginForm from "@/components/auth/LoginForm";
import { useRouter } from "next/navigation";
import * as authService from "@/lib/services/authService";
import { toast } from "sonner";

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

describe("LoginForm", () => {
  // Setup common test variables and reset mocks before each test
  const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
  };
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    require("@/lib/context/AuthContext").useAuth.mockReturnValue({
      state: { isAuthenticated: false },
      dispatch: mockDispatch,
    });
  });

  test("renders the login form correctly", () => {
    render(<LoginForm />);

    // Check if the form elements are rendered
    expect(
      screen.getByRole("heading", { name: /login to document manager/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", { name: /remember me/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login$/i })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /forgot password/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /create an account/i })
    ).toBeInTheDocument();
  });

  test("validates email field on form submission", async () => {
    const user = userEvent.setup();

    render(<LoginForm />);

    // Submit the form without filling the email field
    await user.click(screen.getByRole("button", { name: /login$/i }));

    // Check if validation error is displayed for email
    await waitFor(() => {
      expect(
        screen.getByText(/please enter a valid email address/i)
      ).toBeInTheDocument();
    });
  });

  test("validates password field on form submission", async () => {
    const user = userEvent.setup();

    render(<LoginForm />);

    // Fill the email field but not the password
    await user.type(screen.getByLabelText(/email/i), "test@example.com");

    // Submit the form
    await user.click(screen.getByRole("button", { name: /login$/i }));

    // Check if validation error is displayed for password
    await waitFor(() => {
      expect(
        screen.getByText(/password must be at least 4 characters long/i)
      ).toBeInTheDocument();
    });
  });

  test("calls loginAPI with correct credentials on valid form submission", async () => {
    const user = userEvent.setup();
    const mockUser = {
      id: "1",
      name: "Test User",
      email: "test@example.com",
      role: "admin",
    };
    (authService.loginAPI as jest.Mock).mockResolvedValue(mockUser);

    render(<LoginForm />);

    // Fill in the form with valid values
    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/password/i), "password");

    // Submit the form
    await user.click(screen.getByRole("button", { name: /login$/i }));

    // Check if loginAPI is called with correct parameters
    await waitFor(() => {
      expect(authService.loginAPI).toHaveBeenCalledWith(
        "test@example.com",
        "password"
      );
    });
  });

  test("dispatches LOGIN action with user data on successful login", async () => {
    const user = userEvent.setup();
    const mockUser = {
      id: "1",
      name: "Test User",
      email: "test@example.com",
      role: "admin",
    };
    (authService.loginAPI as jest.Mock).mockResolvedValue(mockUser);

    render(<LoginForm />);

    // Fill in the form with valid values
    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/password/i), "password");

    // Submit the form
    await user.click(screen.getByRole("button", { name: /login$/i }));

    // Check if the dispatch function is called with the correct action
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith({
        type: "LOGIN",
        payload: mockUser,
      });
    });
  });

  test("navigates to home page on successful login", async () => {
    const user = userEvent.setup();
    const mockUser = {
      id: "1",
      name: "Test User",
      email: "test@example.com",
      role: "admin",
    };
    (authService.loginAPI as jest.Mock).mockResolvedValue(mockUser);

    render(<LoginForm />);

    // Fill in the form with valid values
    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/password/i), "password");

    // Submit the form
    await user.click(screen.getByRole("button", { name: /login$/i }));

    // Check if router.push is called with the home page route
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith("/");
    });
  });

  test("shows success toast message on successful login", async () => {
    const user = userEvent.setup();
    const mockUser = {
      id: "1",
      name: "Test User",
      email: "test@example.com",
      role: "admin",
    };
    (authService.loginAPI as jest.Mock).mockResolvedValue(mockUser);

    render(<LoginForm />);

    // Fill in the form with valid values
    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/password/i), "password");

    // Submit the form
    await user.click(screen.getByRole("button", { name: /login$/i }));

    // Check if toast.success is called
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        "Login successful",
        expect.any(Object)
      );
    });
  });

  test("shows loading state during form submission", async () => {
    const user = userEvent.setup();
    // Introduce a delay in the API call to observe loading state
    (authService.loginAPI as jest.Mock).mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                id: "1",
                name: "Test User",
                email: "test@example.com",
                role: "admin",
              }),
            100
          )
        )
    );

    render(<LoginForm />);

    // Fill in the form with valid values
    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/password/i), "password");

    // Submit the form
    await user.click(screen.getByRole("button", { name: /login$/i }));

    // Check if the button text changes to indicate loading
    expect(
      screen.getByRole("button", { name: /logging in/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /logging in/i })).toBeDisabled();

    // Wait for the login process to complete
    await waitFor(() => {
      expect(authService.loginAPI).toHaveBeenCalled();
    });
  });

  test("redirects to home page if user is already authenticated", async () => {
    // Mock the auth context to indicate the user is already authenticated
    require("@/lib/context/AuthContext").useAuth.mockReturnValue({
      state: { isAuthenticated: true },
      dispatch: mockDispatch,
    });

    render(<LoginForm />);

    // Check if router.replace is called with the home page route
    await waitFor(() => {
      expect(mockRouter.replace).toHaveBeenCalledWith("/");
    });
  });

  test("handles login API errors gracefully", async () => {
    const user = userEvent.setup();
    const mockError = new Error("Invalid credentials");
    console.log = jest.fn(); // Mock console.log to prevent errors from being logged
    (authService.loginAPI as jest.Mock).mockRejectedValue(mockError);

    render(<LoginForm />);

    // Fill in the form with valid values
    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/password/i), "password");

    // Submit the form
    await user.click(screen.getByRole("button", { name: /login$/i }));

    // Check if the API error is logged
    await waitFor(() => {
      expect(console.log).toHaveBeenCalledWith(
        "🚀 ~ LoginForm ~ err:",
        mockError
      );
    });

    // Make sure the form is not in loading state anymore
    expect(screen.getByRole("button", { name: /login$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login$/i })).not.toBeDisabled();
  });
});
