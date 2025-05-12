import axios from "@/lib/axios";
import { Document } from "@/lib/types/document";

// Interface for pagination response
export interface PaginatedDocumentsResponse {
  data: Document[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    rowsPerPage: number;
  };
}

// Interface for get documents request params
interface GetDocumentsParams {
  pageNumber: number;
  rowsPerPage: number;
  sortField: string;
  sortOrder: string;
  search?: string;
}

// Interface for upload document request
interface UploadDocumentRequest {
  name: string;
  type: string;
  size: number;
  uploadedBy: {
    id: string;
    name: string;
    email: string;
  };
  file?: File;
}

// Interface for update document request
interface UpdateDocumentRequest {
  id: string;
  name?: string;
  type?: string;
  size?: number;
  uploadedBy?: {
    id: string;
    name: string;
    email: string;
  };
}

// Interface for bulk delete response
interface BulkDeleteResponse {
  message: string;
}

// Get documents with pagination and filters
export const getDocumentsAPI = async (params: GetDocumentsParams): Promise<PaginatedDocumentsResponse> => {
  const response = await axios.get("/document", { params });
  return response.data;
};

// Get document by ID
export const getDocumentByIdAPI = async (documentId: string): Promise<Document> => {
  const response = await axios.get(`/document/view?id=${documentId}`);
  return response.data;
};

// Upload a new document
export const uploadDocumentAPI = async (
  documentData: UploadDocumentRequest,
  onUploadProgress?: (percentage: number) => void
): Promise<Document> => {
  // Create FormData object for multipart/form-data
  const formData = new FormData();
  
  // Add form fields
  formData.append('name', documentData.name);
  formData.append('type', documentData.type);
  formData.append('size', documentData.size.toString());
  formData.append('uploaderId', documentData.uploadedBy.id);
  formData.append('uploaderName', documentData.uploadedBy.name);
  formData.append('uploaderEmail', documentData.uploadedBy.email);
  
  // Append file if provided
  if (documentData.file) {
    formData.append('file', documentData.file);
  }

  const response = await axios.post("/document/upload", formData, {
    // Let axios set the Content-Type header automatically
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total && onUploadProgress) {
        // Calculate the upload percentage
        const percentage = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onUploadProgress(percentage);
      }
    },
  });
  return response.data;
};

// Update an existing document
export const updateDocumentAPI = async (documentData: UpdateDocumentRequest): Promise<Document> => {
  const response = await axios.put("/document/edit", documentData);
  return response.data;
};

// Delete a document
export const deleteDocumentAPI = async (documentId: string): Promise<void> => {
  await axios.delete(`/document/delete?id=${documentId}`);
};

// Bulk delete documents
export const bulkDeleteDocumentsAPI = async (documentIds: string[]): Promise<BulkDeleteResponse> => {
  const response = await axios.post("/document/bulk-delete", {
    ids: documentIds
  });
  return response.data;
}; 