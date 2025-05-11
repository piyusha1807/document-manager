"use client";

import { useState, useRef, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { userSchema } from "@/lib/schema";
import { UserRole } from "@/lib/context/AuthContext";
import { addUserAPI } from "@/lib/services/userService";
import { toast } from "sonner";

// Define form data interface based on the schema
export interface UserFormData {
  name: string;
  email: string;
  role: UserRole;
}

interface UserAddProps {
  onSuccess: () => Promise<void>;
}

export default function UserAdd({ onSuccess }: UserAddProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Initialize the form with React Hook Form
  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "viewer" as UserRole,
    },
  });

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
  const onSubmit = async (data: UserFormData) => {
    setLoading(true);

    try {
      await addUserAPI(data);
      toast.success("User added successfully");
      setIsOpen(false);
      form.reset();
      await onSuccess();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) form.reset();
      }}
    >
      <DialogTrigger asChild>
        <Button className="flex items-center gap-1" aria-label="Add new user">
          <Plus size={16} /> Add User
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle id="add-user-dialog-title">Add New User</DialogTitle>
          <DialogDescription id="add-user-dialog-description">
            Create a new user with the specified details.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-2"
            ref={formRef}
            noValidate
            aria-labelledby="add-user-dialog-title"
            aria-describedby="add-user-dialog-description"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="add-name">Name</FormLabel>
                  <FormControl>
                    <Input
                      id="add-name"
                      placeholder="Enter user name"
                      {...field}
                      disabled={loading}
                      aria-required="true"
                      aria-invalid={!!form.formState.errors.name}
                      aria-describedby={
                        form.formState.errors.name ? "name-error" : undefined
                      }
                    />
                  </FormControl>
                  <FormMessage id="name-error" aria-live="polite" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="add-email">Email</FormLabel>
                  <FormControl>
                    <Input
                      id="add-email"
                      type="email"
                      placeholder="Enter user email"
                      {...field}
                      disabled={loading}
                      aria-required="true"
                      aria-invalid={!!form.formState.errors.email}
                      aria-describedby={
                        form.formState.errors.email ? "email-error" : undefined
                      }
                    />
                  </FormControl>
                  <FormMessage id="email-error" aria-live="polite" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="add-role">Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={loading}
                  >
                    <FormControl>
                      <SelectTrigger
                        id="add-role"
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
                  <FormMessage id="role-error" aria-live="polite" />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={loading}
                aria-label="Cancel adding user"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                aria-busy={loading}
                aria-label={loading ? "Adding user, please wait" : "Add user"}
              >
                {loading ? "Adding..." : "Add User"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
