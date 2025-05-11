"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
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
import { useUsers } from "@/lib/context/UserContext";
import { bulkDeleteUsersAPI } from "@/lib/services/userService";
import { toast } from "sonner";

interface UserBulkDeleteProps {
  onSuccess: () => Promise<void>;
}

export default function UserBulkDelete({ onSuccess }: UserBulkDeleteProps) {
  const { state, dispatch } = useUsers();
  const { selectedUsers } = state;

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Get selected user IDs
  const getSelectedIds = () => {
    return Object.entries(selectedUsers)
      .filter(([, selected]) => selected)
      .map(([id]) => id);
  };

  // Count of selected users
  const selectedCount = Object.values(selectedUsers).filter(Boolean).length;

  // Only show if there are selections
  if (selectedCount === 0) {
    return null;
  }

  const handleBulkDelete = async () => {
    setLoading(true);

    try {
      const selectedIds = getSelectedIds();
      const result = await bulkDeleteUsersAPI(selectedIds);
      toast.success(`${result.deletedCount} users deleted successfully`);
      dispatch({ type: "CLEAR_SELECTIONS" });
      setIsOpen(false);
      await onSuccess();
    } catch (err) {
      console.log("🚀 ~ UserBulkDelete ~ err:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          className="flex items-center gap-1"
          disabled={loading}
        >
          <Trash2 size={16} /> Delete Selected ({selectedCount})
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            You are about to delete {selectedCount} selected users. This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleBulkDelete}
            className="bg-destructive text-destructive-foreground"
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
