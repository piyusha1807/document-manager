// lib/permissions.ts

import { UserRole } from "@/lib/context/AuthContext";

export const notPermissions = {
  admin: [],
  editor: ["user-management"],
  viewer: ["user-management"],
};

export const hasNotPermission = (
  role: UserRole,
  permission: string
): boolean => {
  return notPermissions[role as keyof typeof notPermissions]?.includes(permission as never);
};
