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
import { Document } from "@/lib/types/document";
import { deleteDocumentAPI } from "@/lib/services/documentService";
import { toast } from "sonner";
import { useDocuments } from "@/lib/context/DocumentContext";

interface DocumentDeleteProps {
  document: Document;
  onSuccess: () => Promise<void>;
}

export default function DocumentDelete({
  document,
  onSuccess,
}: DocumentDeleteProps) {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { dispatch } = useDocuments();

  const handleDelete = async () => {
    setLoading(true);

    try {
      await deleteDocumentAPI(document.id);

      // Remove from selected documents if selected
      dispatch({
        type: "SET_SELECTED_DOCUMENTS",
        payload: {},
      });

      toast.success("Document deleted successfully");
      setIsOpen(false);
      await onSuccess();
    } catch (err) {
      console.error("Error deleting document:", err);
      toast.error("Failed to delete document");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
          aria-label={`Delete document: ${document.name}`}
        >
          <Trash2 size={16} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle id="delete-document-title">
            Delete Document
          </AlertDialogTitle>
          <AlertDialogDescription id="delete-document-description">
            Are you sure you want to delete <strong>{document.name}</strong>?
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
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
