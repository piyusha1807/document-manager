"use client";

import { ReactNode } from "react";
import { AuthProvider } from "./AuthContext";
import { UserProvider } from "./UserContext";
import { DocumentProvider } from "./DocumentContext";

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <AuthProvider>
      <UserProvider>
        <DocumentProvider>{children}</DocumentProvider>
      </UserProvider>
    </AuthProvider>
  );
}
