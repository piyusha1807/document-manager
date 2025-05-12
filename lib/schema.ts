import { z } from "zod";

export const signupSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .max(100, "Name cannot exceed 100 characters")
      .trim()
      .refine((value) => value.length > 0, { message: "Name cannot be empty or just whitespace" }),
    email: z.string().email("Please enter a valid email address").max(100, "Email cannot exceed 100 characters"),
    password: z.string().min(4, { message: "Password must be at least 4 characters long" }),
    confirmPassword: z.string().min(1, { message: "Confirm password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address").max(100, "Email cannot exceed 100 characters"),
  password: z.string().min(4, { message: "Password must be at least 4 characters long" }),
  remember: z.boolean().optional(),
});

export const userSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name cannot exceed 100 characters")
    .trim()
    .refine((value) => value.length > 0, { message: "Name cannot be empty or just whitespace" }),
  email: z.string().email("Please enter a valid email address").max(100, "Email cannot exceed 100 characters"),
  role: z.enum(["admin", "editor", "viewer"]).default("viewer"),
});

export const userIdSchema = z.object({
  id: z.string().min(1, "User ID is required"),
});

export const bulkUserIdsSchema = z.object({
  ids: z.array(z.string().min(1, "User ID is required")),
});

export const updateUserSchema = userSchema.partial().merge(userIdSchema);

// Document schemas
export const documentSchema = z.object({
  name: z
    .string()
    .min(1, "Document name is required")
    .max(255, "Document name cannot exceed 255 characters")
    .trim()
    .refine((value) => value.length > 0, { message: "Document name cannot be empty or just whitespace" }),
  type: z.string().min(1, "Document type is required"),
  size: z.number().min(0, "Document size must be a positive number"),
  uploadedBy: z.object({
    id: z.string().min(1, "User ID is required"),
    name: z.string().min(1, "User name is required"),
    email: z.string().email("Please enter a valid email address"),
  }),
});

export const documentIdSchema = z.object({
  id: z.string().min(1, "Document ID is required"),
});

export const bulkDocumentIdsSchema = z.object({
  ids: z.array(z.string().min(1, "Document ID is required")),
});

export const updateDocumentSchema = documentSchema.partial().merge(documentIdSchema);