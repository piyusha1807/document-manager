import TableWrapper from "@/components/common/TableWrapper";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Document Management",
  description: "Document Management",
};

export default function DocumentManagementPage() {
  return (
    <main className="container mx-auto py-6 space-y-6">
      <TableWrapper />
    </main>
  );
}
