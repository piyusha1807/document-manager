"use client";

import { UserProvider } from "@/lib/context/UserContext";
import UserTable from "./UserTable";

export default function UserManagement() {
  return (
    <UserProvider>
      <UserTable />
    </UserProvider>
  );
}
