"use client";

import { useState } from "react";
import { Eye, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Document } from "@/lib/types/document";
import { getDocumentByIdAPI } from "@/lib/services/documentService";
import { formatFileSize, formatDate } from "@/lib/utils";
interface DocumentViewProps {
  document: Document;
}

export default function DocumentView({ document }: DocumentViewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [documentDetails, setDocumentDetails] = useState<Document | null>(null);

  const handleViewDocument = async () => {
    setLoading(true);

    try {
      // Fetch the latest document data
      const fetchedDocument = await getDocumentByIdAPI(document.id);
      setDocumentDetails(fetchedDocument);
    } catch (err) {
      console.error("Error fetching document:", err);
    } finally {
      setLoading(false);
    }
  };

  const documentToDisplay = documentDetails || document;

  // Function to guess the document icon or preview based on type
  const getDocumentPreview = () => {
    const type = documentToDisplay.type.toLowerCase();

    // For demo purposes, just showing a placeholder for different document types
    return (
      <div className="flex flex-col items-center justify-center p-8 border rounded-lg mb-6 bg-muted/30">
        <div className="w-16 h-16 flex items-center justify-center bg-primary-foreground rounded-full mb-4">
          {type === "pdf" && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          )}
          {(type === "doc" || type === "docx") && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          )}
          {(type === "xls" || type === "xlsx") && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          )}
          {(type === "ppt" || type === "pptx") && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 text-orange-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 13v-1m4 1v-3m4 3V8M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
              />
            </svg>
          )}
          {!["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(
            type
          ) && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          )}
        </div>
        <p className="text-center text-sm text-muted-foreground">
          Document preview not available.
          <br />
          Download to view.
        </p>
      </div>
    );
  };

  return (
    <Drawer
      open={isOpen}
      onOpenChange={(open: boolean) => {
        setIsOpen(open);
        if (open) {
          handleViewDocument();
        } else {
          setDocumentDetails(null);
        }
      }}
      direction="right"
    >
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-primary hover:text-primary hover:bg-primary/10"
          aria-label={`View document: ${document.name}`}
        >
          <Eye size={16} />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <div className="flex items-center justify-between">
            <DrawerTitle>Document Details</DrawerTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
            >
              <X size={16} />
            </Button>
          </div>
          <DrawerDescription>
            Viewing details for {document.name}
          </DrawerDescription>
        </DrawerHeader>

        {loading ? (
          <div className="flex items-center justify-center h-[70vh]">
            Loading...
          </div>
        ) : (
          <div className="px-4 py-6 overflow-y-auto max-h-[calc(100vh-10rem)]">
            {/* Document Preview */}
            {getDocumentPreview()}

            {/* Document Details */}
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2 border-b pb-2">
                <span className="font-medium">Name:</span>
                <span className="col-span-2 break-words">
                  {documentToDisplay.name}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 border-b pb-2">
                <span className="font-medium">Type:</span>
                <span className="col-span-2">{documentToDisplay.type}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 border-b pb-2">
                <span className="font-medium">Size:</span>
                <span className="col-span-2">
                  {formatFileSize(documentToDisplay.size)}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 border-b pb-2">
                <span className="font-medium">Uploaded By:</span>
                <span className="col-span-2">
                  {documentToDisplay.uploadedBy.name}
                  <br />
                  <span className="text-sm text-muted-foreground">
                    {documentToDisplay.uploadedBy.email}
                  </span>
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 border-b pb-2">
                <span className="font-medium">Uploaded On:</span>
                <span className="col-span-2">
                  {formatDate(documentToDisplay.uploadedAt)}
                </span>
              </div>
            </div>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
}
