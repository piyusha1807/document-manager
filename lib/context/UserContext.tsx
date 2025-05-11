"use client";

import { createContext, useContext, useReducer, ReactNode } from "react";
import { User } from "@/lib/context/AuthContext";

// Pagination response type
export interface PaginatedResponse {
  data: User[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    rowsPerPage: number;
  };
}

// Pagination state type
export interface PaginationState {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  rowsPerPage: number;
}

// Sort state type
export type SortOrder = "asc" | "desc";

// Define the state shape
interface UserState {
  users: User[];
  selectedUsers: Record<string, boolean>;
  pagination: PaginationState;
  sortField: string;
  sortOrder: SortOrder;
  searchQuery: string;
}

// Define action types
export type UserAction =
  | { type: "SET_USERS"; payload: User[] }
  | { type: "SET_SELECTED_USERS"; payload: Record<string, boolean> }
  | { type: "TOGGLE_SELECT_USER"; payload: string }
  | { type: "TOGGLE_SELECT_ALL" }
  | { type: "CLEAR_SELECTIONS" }
  | { type: "SET_PAGINATION"; payload: PaginationState }
  | { type: "SET_SORT_FIELD"; payload: string }
  | { type: "SET_SORT_ORDER"; payload: SortOrder }
  | { type: "SET_SEARCH_QUERY"; payload: string };

// Initial state
const initialState: UserState = {
  users: [],
  selectedUsers: {},
  pagination: {
    totalItems: 0,
    totalPages: 0,
    currentPage: 0,
    rowsPerPage: 10,
  },
  sortField: "name",
  sortOrder: "asc",
  searchQuery: "",
};

// Reducer function
function userReducer(state: UserState, action: UserAction): UserState {
  switch (action.type) {
    case "SET_USERS":
      return {
        ...state,
        users: action.payload,
      };
    case "SET_SELECTED_USERS":
      return {
        ...state,
        selectedUsers: action.payload,
      };
    case "TOGGLE_SELECT_USER":
      return {
        ...state,
        selectedUsers: {
          ...state.selectedUsers,
          [action.payload]: !state.selectedUsers[action.payload],
        },
      };
    case "TOGGLE_SELECT_ALL": {
      const allSelected =
        state.users.length > 0 &&
        state.users.every((user) => state.selectedUsers[user.id]);

      if (allSelected) {
        return {
          ...state,
          selectedUsers: {},
        };
      } else {
        const newSelected: Record<string, boolean> = {};
        state.users.forEach((user) => {
          newSelected[user.id] = true;
        });
        return {
          ...state,
          selectedUsers: newSelected,
        };
      }
    }
    case "CLEAR_SELECTIONS":
      return {
        ...state,
        selectedUsers: {},
      };
    case "SET_PAGINATION":
      return {
        ...state,
        pagination: action.payload,
      };
    case "SET_SORT_FIELD":
      return {
        ...state,
        sortField: action.payload,
        // Reset sort order to asc when changing sort field
        ...(state.sortField !== action.payload && { sortOrder: "asc" }),
      };
    case "SET_SORT_ORDER":
      return {
        ...state,
        sortOrder: action.payload,
      };
    case "SET_SEARCH_QUERY":
      return {
        ...state,
        searchQuery: action.payload,
      };
    default:
      return state;
  }
}

// User context interface
interface UserContextType {
  // State
  state: UserState;

  // Dispatchers
  dispatch: React.Dispatch<UserAction>;
}

// Create context with default values
const UserContext = createContext<UserContextType | undefined>(undefined);

// User provider component
export function UserProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(userReducer, initialState);

  return (
    <UserContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

// Custom hook to use the user context
export const useUsers = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUsers must be used within a UserProvider");
  }
  return context;
};
