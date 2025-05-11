"use client";

import { useState, useRef, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, UserRole } from "@/lib/context/AuthContext";
import { updateUserAPI } from "@/lib/services/userService";
import { userSchema } from "@/lib/schema";
import { toast } from "sonner";

// Define update user form data interface
export interface UpdateUserFormData {
  name: string;
  email: string;
  role: UserRole;
}

interface UserEditProps {
  user: User;
  onSuccess: () => Promise<void>;
}

export default function UserEdit({ user, onSuccess }: UserEditProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Initialize form with React Hook Form
  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });

  // Update form when user prop changes
  useEffect(() => {
    form.reset({
      name: user.name,
      email: user.email,
      role: user.role,
    });
  }, [user, form]);

  // Focus first form field when dialog opens
  useEffect(() => {
    if (isOpen) {
      const firstInput = formRef.current?.querySelector("input");
      if (firstInput) {
        setTimeout(() => {
          firstInput.focus();
        }, 100);
      }
    }
  }, [isOpen]);

  // Handle form submission
  const onSubmit = async (data: UpdateUserFormData) => {
    setLoading(true);

    try {
      await updateUserAPI({
        id: user.id,
        ...data,
      });
      toast.success("User updated successfully");
      setIsOpen(false);
      await onSuccess();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (open) {
          // Reset form with current user data when dialog opens
          form.reset({
            name: user.name,
            email: user.email,
            role: user.role,
          });
        }
      }}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        title="Edit user"
        aria-label={`Edit user ${user.name}`}
      >
        <Edit size={16} />
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle id="edit-user-dialog-title">Edit User</DialogTitle>
          <DialogDescription id="edit-user-dialog-description">
            Update user information for {user.name}.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-2"
            ref={formRef}
            noValidate
            aria-labelledby="edit-user-dialog-title"
            aria-describedby="edit-user-dialog-description"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="edit-name">Name</FormLabel>
                  <FormControl>
                    <Input
                      id="edit-name"
                      placeholder="Enter user name"
                      {...field}
                      disabled={loading}
                      aria-required="true"
                      aria-invalid={!!form.formState.errors.name}
                      aria-describedby={
                        form.formState.errors.name
                          ? "edit-name-error"
                          : undefined
                      }
                    />
                  </FormControl>
                  <FormMessage id="edit-name-error" aria-live="polite" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="edit-email">Email</FormLabel>
                  <FormControl>
                    <Input
                      id="edit-email"
                      type="email"
                      placeholder="Enter user email"
                      {...field}
                      disabled={loading}
                      aria-required="true"
                      aria-invalid={!!form.formState.errors.email}
                      aria-describedby={
                        form.formState.errors.email
                          ? "edit-email-error"
                          : undefined
                      }
                    />
                  </FormControl>
                  <FormMessage id="edit-email-error" aria-live="polite" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="edit-role">Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={loading}
                  >
                    <FormControl>
                      <SelectTrigger
                        id="edit-role"
                        aria-required="true"
                        aria-invalid={!!form.formState.errors.role}
                      >
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage id="edit-role-error" aria-live="polite" />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={loading}
                aria-label="Cancel editing user"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                aria-busy={loading}
                aria-label={
                  loading ? "Saving changes, please wait" : "Save changes"
                }
              >
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
