import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ZodError, ZodIssue } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const capitalizeFirstLetter = (val: string) => {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
};

const formatZodIssue = (issue: ZodIssue) => {
  const { path, message } = issue;
  const pathString = path.join(".");

  return `${capitalizeFirstLetter(pathString)}: ${message}`;
};

// Format the Zod error message with only the current error
export const formatZodError = (error: ZodError) => {
  const { issues } = error;

  if (issues.length) {
    const currentIssue = issues[0];

    return formatZodIssue(currentIssue);
  }
};