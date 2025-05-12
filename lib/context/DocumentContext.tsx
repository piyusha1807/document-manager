"use client";

import { createContext, useContext, useReducer, ReactNode } from "react";
import { Document } from "@/lib/types/document";

// Pagination response type
export interface PaginatedResponse {
  data: Document[];
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
interface DocumentState {
  documents: Document[];
  selectedDocuments: Record<string, boolean>;
  pagination: PaginationState;
  sortField: string;
  sortOrder: SortOrder;
  searchQuery: string;
}

// Define action types
export type DocumentAction =
  | { type: "SET_DOCUMENTS"; payload: Document[] }
  | { type: "SET_SELECTED_DOCUMENTS"; payload: Record<string, boolean> }
  | { type: "TOGGLE_SELECT_DOCUMENT"; payload: string }
  | { type: "TOGGLE_SELECT_ALL" }
  | { type: "CLEAR_SELECTIONS" }
  | { type: "SET_PAGINATION"; payload: PaginationState }
  | { type: "SET_SORT_FIELD"; payload: string }
  | { type: "SET_SORT_ORDER"; payload: SortOrder }
  | { type: "SET_SEARCH_QUERY"; payload: string };

// Initial state
const initialState: DocumentState = {
  documents: [],
  selectedDocuments: {},
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
function documentReducer(
  state: DocumentState,
  action: DocumentAction
): DocumentState {
  switch (action.type) {
    case "SET_DOCUMENTS":
      return {
        ...state,
        documents: action.payload,
      };
    case "SET_SELECTED_DOCUMENTS":
      return {
        ...state,
        selectedDocuments: action.payload,
      };
    case "TOGGLE_SELECT_DOCUMENT":
      return {
        ...state,
        selectedDocuments: {
          ...state.selectedDocuments,
          [action.payload]: !state.selectedDocuments[action.payload],
        },
      };
    case "TOGGLE_SELECT_ALL": {
      const allSelected =
        state.documents.length > 0 &&
        state.documents.every(
          (document) => state.selectedDocuments[document.id]
        );

      if (allSelected) {
        return {
          ...state,
          selectedDocuments: {},
        };
      } else {
        const newSelected: Record<string, boolean> = {};
        state.documents.forEach((document) => {
          newSelected[document.id] = true;
        });
        return {
          ...state,
          selectedDocuments: newSelected,
        };
      }
    }
    case "CLEAR_SELECTIONS":
      return {
        ...state,
        selectedDocuments: {},
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

// Document context interface
interface DocumentContextType {
  // State
  state: DocumentState;

  // Dispatchers
  dispatch: React.Dispatch<DocumentAction>;
}

// Create context with default values
const DocumentContext = createContext<DocumentContextType | undefined>(
  undefined
);

// Document provider component
export function DocumentProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(documentReducer, initialState);

  return (
    <DocumentContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
}

// Custom hook to use the document context
export const useDocuments = () => {
  const context = useContext(DocumentContext);
  if (context === undefined) {
    throw new Error("useDocuments must be used within a DocumentProvider");
  }
  return context;
};
