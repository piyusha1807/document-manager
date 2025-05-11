import { User } from "@/lib/context/AuthContext";

// Mock user data
export const mockUsers: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
  },
  {
    id: "2",
    name: "Editor User",
    email: "editor@example.com",
    role: "editor",
  },
  {
    id: "3",
    name: "Viewer User",
    email: "viewer@example.com",
    role: "viewer",
  },
  {
    id: "4",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "editor",
  },
  {
    id: "5",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "viewer",
  },
];

// In-memory store for the mock user data
let users = [...mockUsers];

// Reset users to initial state
export function resetUsers() {
  users = [...mockUsers];
  return users;
}

// Get all users
export function getUsers() {
  return [...users];
}

// Get user by ID
export function getUserById(id: string) {
  return users.find((user) => user.id === id) || null;
}

// Add user
export function addUser(user: Omit<User, "id">) {
  const newUser = {
    ...user,
    id: String(users.length + 1),
  };
  users.push(newUser);
  return newUser;
}

// Update user
export function updateUser(id: string, userData: Partial<Omit<User, "id">>) {
  const index = users.findIndex((user) => user.id === id);
  if (index === -1) return null;
  
  users[index] = {
    ...users[index],
    ...userData,
  };
  
  return users[index];
}

// Delete user
export function deleteUser(id: string) {
  const index = users.findIndex((user) => user.id === id);
  if (index === -1) return false;
  
  users.splice(index, 1);
  return true;
}

// Bulk delete users
export function bulkDeleteUsers(ids: string[]) {
  const initialLength = users.length;
  users = users.filter((user) => !ids.includes(user.id));
  return initialLength - users.length; // Return number of deleted users
} 