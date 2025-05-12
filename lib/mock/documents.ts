import { Document } from "@/lib/types/document";

// Mock document data
export const mockDocuments: Document[] = [
  {
    id: "1",
    name: "Financial Report 2023.pdf",
    type: "pdf",
    size: 1024 * 1024 * 2.5, // 2.5 MB
    uploadedBy: {
      id: "1",
      name: "Admin User",
      email: "admin@example.com",
    },
    uploadedAt: new Date("2023-12-15T09:30:00Z").toISOString(),
  },
  {
    id: "2",
    name: "Project Proposal.docx",
    type: "docx",
    size: 1024 * 1024 * 1.2, // 1.2 MB
    uploadedBy: {
      id: "2",
      name: "Editor User",
      email: "editor@example.com",
    },
    uploadedAt: new Date("2023-12-20T14:45:00Z").toISOString(),
  },
  {
    id: "3",
    name: "Marketing Plan.pptx",
    type: "pptx",
    size: 1024 * 1024 * 3.8, // 3.8 MB
    uploadedBy: {
      id: "4",
      name: "John Doe",
      email: "john.doe@example.com",
    },
    uploadedAt: new Date("2024-01-05T11:20:00Z").toISOString(),
  },
  {
    id: "4",
    name: "User Guide.pdf",
    type: "pdf",
    size: 1024 * 1024 * 5.1, // 5.1 MB
    uploadedBy: {
      id: "5",
      name: "Jane Smith",
      email: "jane.smith@example.com",
    },
    uploadedAt: new Date("2024-01-10T16:15:00Z").toISOString(),
  },
  {
    id: "5",
    name: "Q1 Results.xlsx",
    type: "xlsx",
    size: 1024 * 1024 * 0.8, // 0.8 MB
    uploadedBy: {
      id: "1",
      name: "Admin User",
      email: "admin@example.com",
    },
    uploadedAt: new Date("2024-02-01T10:05:00Z").toISOString(),
  },
];

// In-memory store for the mock document data
let documents = [...mockDocuments];

// Reset documents to initial state
export function resetDocuments() {
  documents = [...mockDocuments];
  return documents;
}

// Get all documents
export function getDocuments() {
  return [...documents];
}

// Get document by ID
export function getDocumentById(id: string) {
  return documents.find((document) => document.id === id) || null;
}

// Add document
export function addDocument(document: Omit<Document, "id" | "uploadedAt">) {
  const newDocument = {
    ...document,
    id: String(documents.length + 1),
    uploadedAt: new Date().toISOString(),
  };
  documents.push(newDocument);
  return newDocument;
}

// Update document
export function updateDocument(id: string, documentData: Partial<Omit<Document, "id" | "uploadedAt">>) {
  const index = documents.findIndex((document) => document.id === id);
  if (index === -1) return null;
  
  documents[index] = {
    ...documents[index],
    ...documentData,
  };
  
  return documents[index];
}

// Delete document
export function deleteDocument(id: string) {
  const index = documents.findIndex((document) => document.id === id);
  if (index === -1) return false;
  
  documents.splice(index, 1);
  return true;
}

// Bulk delete documents
export function bulkDeleteDocuments(ids: string[]) {
  const initialLength = documents.length;
  documents = documents.filter((document) => !ids.includes(document.id));
  return initialLength - documents.length; // Return number of deleted documents
} 