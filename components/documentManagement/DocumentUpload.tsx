"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Upload,
  Loader2,
  FileText,
  FileCheck,
  FileWarning,
  File,
  ArrowRight,
} from "lucide-react";
import { uploadDocumentAPI } from "@/lib/services/documentService";
import { toast } from "sonner";
import { useAuth } from "@/lib/context/AuthContext";
import { formatFileSize } from "@/lib/utils";

interface DocumentUploadProps {
  onSuccess: () => Promise<void>;
}

type UploadStatus = "idle" | "selected" | "uploading" | "success" | "error";

export default function DocumentUpload({ onSuccess }: DocumentUploadProps) {
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { state } = useAuth();
  const currentUser = state.user;

  // Handle file input change - first step (file selection)
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;

    await validateAndSelectFile(file);
  };

  // Process and validate the selected file - first step
  const validateAndSelectFile = async (file: File) => {
    // Reset previous state
    setErrorMessage("");

    // Validate file size (max 10MB)
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_SIZE) {
      setUploadStatus("error");
      setErrorMessage("File size exceeds the 10MB limit");
      return;
    }

    // Store the file for display
    setSelectedFile(file);
    setUploadStatus("selected");
  };

  // Upload the file to server - second step (after confirmation)
  const uploadFile = async () => {
    if (!selectedFile || !currentUser) return;

    setLoading(true);
    setUploadStatus("uploading");
    setUploadProgress(0);

    try {
      // Create document data with metadata and the file
      const documentData = {
        name: selectedFile.name,
        type: selectedFile.name.split(".").pop() || "",
        size: selectedFile.size,
        uploadedBy: {
          id: currentUser.id,
          name: currentUser.name,
          email: currentUser.email,
        },
        file: selectedFile, // Include the file for upload
      };

      // Upload the document with progress tracking
      await uploadDocumentAPI(documentData, (percentage) => {
        setUploadProgress(percentage);
      });

      // Set progress to 100% when done
      setUploadProgress(100);
      toast.success("Document uploaded successfully");
      setUploadStatus("success");

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Refresh document list
      await onSuccess();

      // After 2 seconds, reset to idle state
      setTimeout(() => {
        resetFileState();
      }, 2000);
    } catch (err: unknown) {
      console.error("Error uploading document:", err);
      setUploadStatus("error");

      // Provide more detailed error messages based on the error
      let errorMsg = "Failed to upload document. Please try again.";

      // Type guard to check for axios error structure
      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as {
          response?: {
            status: number;
            data?: { message?: string };
          };
          request?: unknown;
        };

        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (axiosError.response) {
          if (axiosError.response.status === 413) {
            errorMsg = "File too large. Server rejected the upload.";
          } else if (axiosError.response.data?.message) {
            errorMsg = axiosError.response.data.message;
          } else {
            errorMsg = `Server error: ${axiosError.response.status}`;
          }
        } else if ("request" in err) {
          // The request was made but no response was received
          errorMsg = "No response from server. Check your network connection.";
        }
      }

      setErrorMessage(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Reset file state
  const resetFileState = () => {
    setSelectedFile(null);
    setUploadStatus("idle");
    setErrorMessage("");
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle drag events
  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  // Handle drop event
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0] && !loading) {
        validateAndSelectFile(e.dataTransfer.files[0]);
      }
    },
    [loading]
  );

  // Get appropriate file icon based on type
  const getFileIcon = () => {
    if (!selectedFile) return <FileText className="w-10 h-10 text-primary" />;

    const fileType = selectedFile.name.split(".").pop()?.toLowerCase() || "";

    switch (fileType) {
      case "pdf":
        return <File className="w-10 h-10 text-red-500" />;
      case "doc":
      case "docx":
        return <File className="w-10 h-10 text-blue-500" />;
      case "xls":
      case "xlsx":
        return <File className="w-10 h-10 text-green-500" />;
      case "ppt":
      case "pptx":
        return <File className="w-10 h-10 text-orange-500" />;
      default:
        return <FileText className="w-10 h-10 text-gray-500" />;
    }
  };

  // Render different content based on upload state
  const renderContent = () => {
    // Initial state - no file selected
    if (uploadStatus === "idle") {
      return (
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
            <Upload className="h-6 w-6 text-primary" />
          </div>

          <div className="text-center">
            <h3 className="font-medium text-lg">Upload Document</h3>
            <p className="text-muted-foreground text-sm mt-1">
              Drag and drop your file here or click to browse
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Supported formats: PDF, Word, Excel, PowerPoint, etc.
            </p>
          </div>

          <Button
            onClick={triggerFileInput}
            variant="outline"
            className="mt-4"
            aria-label="Browse files"
          >
            <FileText className="mr-2 h-4 w-4" />
            Browse Files
          </Button>
        </div>
      );
    }

    // File selected, waiting for upload confirmation
    if (uploadStatus === "selected" && selectedFile) {
      return (
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="w-14 h-14 p-4 rounded-full bg-primary/5 flex items-center justify-center">
            {getFileIcon()}
          </div>

          <div className="text-center">
            <h3 className="font-medium text-lg" title={selectedFile.name}>
              {selectedFile.name.length > 25
                ? selectedFile.name.substring(0, 22) + "..."
                : selectedFile.name}
            </h3>
            <p className="text-muted-foreground text-sm mt-1">
              {formatFileSize(selectedFile.size)}
            </p>
          </div>

          <div className="flex gap-2 items-center mt-4">
            <Button
              onClick={uploadFile}
              disabled={loading}
              aria-label="Upload file"
            >
              Upload File
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              onClick={resetFileState}
              variant="outline"
              aria-label="Remove selected file"
            >
              Discard
            </Button>
          </div>
        </div>
      );
    }

    // File is uploading
    if (uploadStatus === "uploading" && selectedFile) {
      return (
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="w-14 h-14 p-4 rounded-full bg-primary/5 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>

          <div className="text-center">
            <h3 className="font-medium text-lg" title={selectedFile.name}>
              {selectedFile.name.length > 25
                ? selectedFile.name.substring(0, 22) + "..."
                : selectedFile.name}
            </h3>
            <p className="text-muted-foreground text-sm mt-1">
              Uploading... {Math.round(uploadProgress)}%
            </p>
            <div className="w-full max-w-xs bg-gray-200 rounded-full h-2 mt-3">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-200 ease-out"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        </div>
      );
    }

    // Upload successful
    if (uploadStatus === "success" && selectedFile) {
      return (
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="w-14 h-14 p-4 rounded-full bg-green-50 flex items-center justify-center">
            <FileCheck className="w-8 h-8 text-green-500" />
          </div>

          <div className="text-center">
            <h3 className="font-medium text-lg" title={selectedFile.name}>
              {selectedFile.name.length > 25
                ? selectedFile.name.substring(0, 22) + "..."
                : selectedFile.name}
            </h3>
            <p className="text-green-600 text-sm mt-1">Upload Complete</p>
            <div className="w-full max-w-xs bg-gray-200 rounded-full h-2 mt-3">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: "100%" }}
              ></div>
            </div>
          </div>

          <Button
            onClick={resetFileState}
            variant="outline"
            size="sm"
            className="mt-2"
          >
            Upload Another
          </Button>
        </div>
      );
    }

    // Upload failed
    if (uploadStatus === "error") {
      return (
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="w-14 h-14 p-4 rounded-full bg-red-50 flex items-center justify-center">
            <FileWarning className="w-8 h-8 text-red-500" />
          </div>

          <div className="text-center">
            <h3 className="font-medium text-lg text-red-600">Upload Failed</h3>
            <p className="text-muted-foreground text-sm mt-1">{errorMessage}</p>
          </div>

          <div className="flex gap-2 items-center mt-4">
            <Button
              onClick={resetFileState}
              variant="outline"
              aria-label="Try again"
            >
              Try Again
            </Button>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-3">
      <div
        className={`relative border ${
          dragActive
            ? "border-dashed border-primary bg-primary/5"
            : uploadStatus === "success"
            ? "border-green-500/50 bg-green-50/30"
            : uploadStatus === "error"
            ? "border-red-500/50 bg-red-50/30"
            : uploadStatus === "uploading"
            ? "border-primary/30 bg-primary/5"
            : "border-dashed border-muted-foreground/25 hover:border-primary/50 bg-muted/40"
        } rounded-lg transition-all overflow-hidden`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
          disabled={loading || uploadStatus === "uploading"}
          aria-label="Upload document file"
        />
        <div className="flex flex-col items-center justify-center py-6 space-y-4 h-[230px]">
          {renderContent()}
        </div>

        {/* Overlay when dragging */}
        {dragActive && (
          <div className="absolute inset-0 bg-primary/10 flex items-center justify-center z-10">
            <div className="bg-white p-4 rounded-lg shadow-md text-center">
              <FileText className="h-10 w-10 text-primary mx-auto" />
              <p className="font-medium mt-2">Drop to upload</p>
            </div>
          </div>
        )}
      </div>

      {/* File and size limit info */}
      <div className="flex justify-between px-2 text-xs text-muted-foreground">
        <span>Auto-extracts document name and type</span>
        <span>Maximum size: 10MB</span>
      </div>
    </div>
  );
}
