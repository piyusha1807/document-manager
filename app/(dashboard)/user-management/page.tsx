import UserTable from "@/components/userManagement/UserTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Management",
  description: "User Management",
};

export default function UserManagementPage() {
  return (
    <main className="container mx-auto py-6 space-y-6">
      <UserTable />
    </main>
  );
}
