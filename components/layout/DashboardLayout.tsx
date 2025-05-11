"use client";

import { useAuth } from "@/lib/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { SidePanel } from "./SidePanel";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { state } = useAuth();
  const { isAuthenticated } = state;

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  return (
    <div className={cn("flex h-screen w-full")}>
      <SidePanel />
      <div className="flex-1 overflow-y-auto p-6">{children}</div>
    </div>
  );
}
