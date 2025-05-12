"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { bulkDeleteDocumentsAPI } from "@/lib/services/documentService";
import { toast } from "sonner";
import { useDocuments } from "@/lib/context/DocumentContext";

interface DocumentBulkDeleteProps {
  onSuccess: () => Promise<void>;
}

export default function DocumentBulkDelete({
  onSuccess,
}: DocumentBulkDeleteProps) {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { state, dispatch } = useDocuments();
  const { selectedDocuments } = state;

  // Count selected documents
  const selectedCount = Object.values(selectedDocuments).filter(Boolean).length;

  // Get selected document IDs
  const getSelectedIds = () => {
    return Object.entries(selectedDocuments)
      .filter(([, isSelected]) => isSelected)
      .map(([id]) => id);
  };

  const handleBulkDelete = async () => {
    setLoading(true);

    try {
      const selectedIds = getSelectedIds();
      await bulkDeleteDocumentsAPI(selectedIds);

      // Clear selections after deletion
      dispatch({ type: "CLEAR_SELECTIONS" });

      toast.success(`${selectedCount} document(s) deleted successfully`);
      setIsOpen(false);
      await onSuccess();
    } catch (err) {
      console.error("Error bulk deleting documents:", err);
      toast.error("Failed to delete documents");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-1 text-destructive border-destructive hover:bg-destructive/10"
          aria-label={`Delete ${selectedCount} selected document(s)`}
        >
          <Trash2 size={16} /> Delete ({selectedCount})
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle id="bulk-delete-document-title">
            Delete Multiple Documents
          </AlertDialogTitle>
          <AlertDialogDescription id="bulk-delete-document-description">
            {selectedCount === 1
              ? "Are you sure you want to delete 1 selected document?"
              : `Are you sure you want to delete ${selectedCount} selected documents?`}{" "}
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleBulkDelete}
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
