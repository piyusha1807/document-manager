"use client";

import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpDown, ArrowUp, ArrowDown, FileText } from "lucide-react";
import { useDocuments } from "@/lib/context/DocumentContext";
import DocumentSearch from "./DocumentSearch";
import DocumentUpload from "./DocumentUpload";
import DocumentView from "./DocumentView";
import DocumentDelete from "./DocumentDelete";
import DocumentBulkDelete from "./DocumentBulkDelete";
import DocumentPagination from "./DocumentPagination";
import { getDocumentsAPI } from "@/lib/services/documentService";
import { formatFileSize, formatDate } from "@/lib/utils";

export default function DocumentTable() {
  // Get context values
  const { state, dispatch } = useDocuments();

  const {
    documents,
    selectedDocuments,
    pagination,
    sortField,
    sortOrder,
    searchQuery,
  } = state;

  // Local component state
  const [loading, setLoading] = useState(true);

  // Calculate whether all documents are selected
  const allSelected =
    documents.length > 0 && documents.every((doc) => selectedDocuments[doc.id]);
  const someSelected = Object.values(selectedDocuments).some(Boolean);
  const selectedCount = Object.values(selectedDocuments).filter(Boolean).length;

  // Handle sorting changes
  const handleSort = (field: string) => {
    if (sortField === field) {
      dispatch({
        type: "SET_SORT_ORDER",
        payload: sortOrder === "asc" ? "desc" : "asc",
      });
    } else {
      dispatch({ type: "SET_SORT_FIELD", payload: field });
    }
  };

  // Function to fetch documents based on current filters and pagination
  const fetchDocuments = async () => {
    setLoading(true);

    try {
      const response = await getDocumentsAPI({
        pageNumber: pagination.currentPage,
        rowsPerPage: pagination.rowsPerPage,
        sortField,
        sortOrder,
        search: searchQuery || undefined,
      });

      dispatch({ type: "SET_DOCUMENTS", payload: response.data });
      dispatch({ type: "SET_PAGINATION", payload: response.pagination });
    } catch (err) {
      console.error("Error fetching documents:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch documents on initial load and when filters/pagination change
  useEffect(() => {
    fetchDocuments();
  }, [
    pagination.currentPage,
    pagination.rowsPerPage,
    sortField,
    sortOrder,
    searchQuery,
  ]);

  // Function to get sort indicator for the column
  const getSortIndicator = (field: string) => {
    if (sortField !== field) {
      return (
        <ArrowUpDown
          size={16}
          className="text-muted-foreground"
          aria-hidden="true"
        />
      );
    }

    return sortOrder === "asc" ? (
      <ArrowUp size={16} className="text-primary" aria-hidden="true" />
    ) : (
      <ArrowDown size={16} className="text-primary" aria-hidden="true" />
    );
  };

  // Get sorting descriptions for screen readers
  const getSortDescription = (field: string) => {
    if (sortField !== field) {
      return "Not sorted";
    }
    return sortOrder === "asc" ? "Sorted ascending" : "Sorted descending";
  };

  // Convert sort order to aria-sort value
  const getAriaSortValue = (
    field: string
  ): "ascending" | "descending" | "none" | undefined => {
    if (sortField !== field) return "none";
    return sortOrder === "asc" ? "ascending" : "descending";
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col justify-between gap-4">
        <h2 className="text-2xl font-bold" id="document-table-title">
          Document Management
        </h2>
        <DocumentUpload onSuccess={fetchDocuments} />
      </div>
      <div className="flex justify-between items-center gap-4">
        <DocumentSearch />
        {someSelected && (
          <div aria-live="polite" className="flex items-center">
            <span className="sr-only">{selectedCount} documents selected</span>
            <DocumentBulkDelete onSuccess={fetchDocuments} />
          </div>
        )}
      </div>
      <div className="rounded-md border">
        <Table aria-labelledby="document-table-title">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">
                <span className="sr-only">Select all documents</span>
                <Checkbox
                  checked={allSelected || (someSelected && "indeterminate")}
                  onCheckedChange={() =>
                    dispatch({ type: "TOGGLE_SELECT_ALL" })
                  }
                  aria-label={
                    allSelected
                      ? "Unselect all documents"
                      : "Select all documents"
                  }
                />
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("name")}
                aria-sort={getAriaSortValue("name")}
              >
                <div className="flex items-center space-x-1">
                  <span>Name</span>
                  {getSortIndicator("name")}
                  <span className="sr-only">{getSortDescription("name")}</span>
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("type")}
                aria-sort={getAriaSortValue("type")}
              >
                <div className="flex items-center space-x-1">
                  <span>Type</span>
                  {getSortIndicator("type")}
                  <span className="sr-only">{getSortDescription("type")}</span>
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("size")}
                aria-sort={getAriaSortValue("size")}
              >
                <div className="flex items-center space-x-1">
                  <span>Size</span>
                  {getSortIndicator("size")}
                  <span className="sr-only">{getSortDescription("size")}</span>
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("uploadedBy.name")}
                aria-sort={getAriaSortValue("uploadedBy.name")}
              >
                <div className="flex items-center space-x-1">
                  <span>Uploaded By</span>
                  {getSortIndicator("uploadedBy.name")}
                  <span className="sr-only">
                    {getSortDescription("uploadedBy.name")}
                  </span>
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("uploadedAt")}
                aria-sort={getAriaSortValue("uploadedAt")}
              >
                <div className="flex items-center space-x-1">
                  <span>Date</span>
                  {getSortIndicator("uploadedAt")}
                  <span className="sr-only">
                    {getSortDescription("uploadedAt")}
                  </span>
                </div>
              </TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <span aria-live="polite">Loading documents...</span>
                </TableCell>
              </TableRow>
            ) : documents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <span aria-live="polite">No documents found.</span>
                </TableCell>
              </TableRow>
            ) : (
              documents.map((document) => (
                <TableRow key={document.id}>
                  <TableCell>
                    <Checkbox
                      checked={!!selectedDocuments[document.id]}
                      onCheckedChange={() =>
                        dispatch({
                          type: "TOGGLE_SELECT_DOCUMENT",
                          payload: document.id,
                        })
                      }
                      aria-label={
                        selectedDocuments[document.id]
                          ? `Unselect ${document.name}`
                          : `Select ${document.name}`
                      }
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <FileText size={16} className="text-muted-foreground" />
                      {document.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{document.type}</Badge>
                  </TableCell>
                  <TableCell>{formatFileSize(document.size)}</TableCell>
                  <TableCell>{document.uploadedBy.name}</TableCell>
                  <TableCell>{formatDate(document.uploadedAt)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <DocumentView document={document} />
                      <DocumentDelete
                        document={document}
                        onSuccess={fetchDocuments}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <DocumentPagination />
    </div>
  );
}
