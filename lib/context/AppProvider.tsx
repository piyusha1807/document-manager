"use client";

import { ReactNode } from "react";
import { AuthProvider } from "./AuthContext";
import { UserProvider } from "./UserContext";
interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <AuthProvider>
      <UserProvider>{children}</UserProvider>
    </AuthProvider>
  );
}
