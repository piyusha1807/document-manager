import TableWrapper from "@/components/common/TableWrapper";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Document Management",
  description: "Document Management",
};

export default function DocumentManagementPage() {
  return (
    <main>
      <TableWrapper />
    </main>
  );
}
