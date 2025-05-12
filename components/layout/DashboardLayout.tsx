"use client";

import { useAuth } from "@/lib/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { SidePanel } from "./SidePanel";
import { hasNotPermission } from "@/lib/notPermissions";
import { toast } from "sonner";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const { state } = useAuth();
  const { isAuthenticated, user } = state;
  const [isLoading, setIsLoading] = useState(true);

  const segments = pathname.split("/").filter(Boolean); // removes empty strings
  const permissionKey = segments[0]; // gets last segment

  useEffect(() => {
    // Check localStorage directly for faster initial check
    const storedUser = localStorage.getItem("user");

    if (!storedUser && !isAuthenticated) {
      router.replace("/login");
    } else if (hasNotPermission(user?.role || "viewer", permissionKey)) {
      toast.error("You don't have permission to access this page");
      router.replace("/");
    }

    // Set loading to false after authentication check
    setIsLoading(false);
  }, [isAuthenticated, user, pathname]);

  // Don't render anything during the initial loading to prevent flash
  if (isLoading) return null;

  // Only redirect if not authenticated after loading completes
  if (!isLoading && !isAuthenticated) return null;

  if (hasNotPermission(user?.role || "viewer", permissionKey)) return null;

  return (
    <div className={cn("flex h-screen w-full")}>
      <SidePanel />
      <div className="flex-1 overflow-y-auto p-6">{children}</div>
    </div>
  );
}
