"use client";

import { useAuth } from "@/lib/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { SidePanel } from "./SidePanel";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { state } = useAuth();
  const { isAuthenticated } = state;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check localStorage directly for faster initial check
    const storedUser = localStorage.getItem("user");

    if (!storedUser && !isAuthenticated) {
      router.replace("/login");
    }

    // Set loading to false after authentication check
    setIsLoading(false);
  }, [isAuthenticated]);

  // Don't render anything during the initial loading to prevent flash
  if (isLoading) return null;

  // Only redirect if not authenticated after loading completes
  if (!isLoading && !isAuthenticated) return null;

  return (
    <div className={cn("flex h-screen w-full")}>
      <SidePanel />
      <div className="flex-1 overflow-y-auto p-6">{children}</div>
    </div>
  );
}
