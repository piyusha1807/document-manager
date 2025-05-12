import axios from "@/lib/axios";
import { User, UserRole } from "@/lib/context/AuthContext";
import { PaginatedResponse } from "@/lib/context/UserContext";

// Interface for get users request params
interface GetUsersParams {
  pageNumber: number;
  rowsPerPage: number;
  sortField: string;
  sortOrder: string;
  search?: string;
}

// Interface for add user request
interface AddUserRequest {
  name: string;
  email: string;
  role: UserRole;
}

// Interface for update user request
interface UpdateUserRequest {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

// Interface for bulk delete response
interface BulkDeleteResponse {
  deletedCount: number;
}

// Get users with pagination and filters
export const getUsersAPI = async (params: GetUsersParams): Promise<PaginatedResponse> => {
  const response = await axios.get("/user", { params });
  return response.data;
};

// Add a new user
export const addUserAPI = async (userData: AddUserRequest): Promise<User> => {
  const response = await axios.post("/user/add", userData);
  return response.data;
};

// Update an existing user
export const updateUserAPI = async (userData: UpdateUserRequest): Promise<User> => {
  const response = await axios.put("/user/edit", userData);
  return response.data;
};

// Delete a user
export const deleteUserAPI = async (userId: string): Promise<void> => {
  await axios.delete("/user/delete", { 
    data: { id: userId } 
  });
};

// Bulk delete users
export const bulkDeleteUsersAPI = async (userIds: string[]): Promise<BulkDeleteResponse> => {
  const response = await axios.delete("/user/bulk-delete", {
    data: { ids: userIds }
  });
  return response.data;
}; 