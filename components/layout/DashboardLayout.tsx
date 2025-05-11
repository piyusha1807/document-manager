import { cn } from "@/lib/utils";
import { SidePanel } from "./SidePanel";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={cn("flex h-screen w-full")}>
      <SidePanel />
      <div className="flex-1 overflow-y-auto p-6">{children}</div>
    </div>
  );
}
