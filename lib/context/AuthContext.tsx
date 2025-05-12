"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";

// Define user roles
export type UserRole = "admin" | "editor" | "viewer";

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

// Define the state shape
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

// Define action types
export type AuthAction = { type: "LOGIN"; payload: User } | { type: "LOGOUT" };

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

// Reducer function
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN":
      // Save user to localStorage when logging in
      localStorage.setItem("user", JSON.stringify(action.payload));
      return {
        user: action.payload,
        isAuthenticated: true,
      };
    case "LOGOUT":
      // Remove user from localStorage when logging out
      localStorage.removeItem("user");
      return {
        user: null,
        isAuthenticated: false,
      };
    default:
      return state;
  }
}

// Auth context interface
interface AuthContextType {
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  state: initialState,
  dispatch: () => {},
});

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Check for stored user in localStorage on initial load
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      dispatch({ type: "LOGIN", payload: JSON.parse(storedUser) });
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);
