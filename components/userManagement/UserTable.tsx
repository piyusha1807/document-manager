"use client";

import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { useUsers } from "@/lib/context/UserContext";
import UserSearch from "./UserSearch";
import UserAdd from "./UserAdd";
import UserEdit from "./UserEdit";
import UserDelete from "./UserDelete";
import UserBulkDelete from "./UserBulkDelete";
import UserPagination from "./UserPagination";
import { getUsersAPI } from "@/lib/services/userService";

export default function UserTable() {
  // Get context values
  const { state, dispatch } = useUsers();

  const {
    users,
    selectedUsers,
    pagination,
    sortField,
    sortOrder,
    searchQuery,
  } = state;

  // Local component state
  const [loading, setLoading] = useState(true);

  // Calculate whether all users are selected
  const allSelected =
    users.length > 0 && users.every((user) => selectedUsers[user.id]);
  const someSelected = Object.values(selectedUsers).some(Boolean);
  const selectedCount = Object.values(selectedUsers).filter(Boolean).length;

  // Handle sorting changes
  const handleSort = (field: string) => {
    if (sortField === field) {
      dispatch({
        type: "SET_SORT_ORDER",
        payload: sortOrder === "asc" ? "desc" : "asc",
      });
    } else {
      dispatch({ type: "SET_SORT_FIELD", payload: field });
    }
  };

  // Function to fetch users based on current filters and pagination
  const fetchUsers = async () => {
    setLoading(true);

    try {
      const response = await getUsersAPI({
        pageNumber: pagination.currentPage,
        rowsPerPage: pagination.rowsPerPage,
        sortField,
        sortOrder,
        search: searchQuery || undefined,
      });

      dispatch({ type: "SET_USERS", payload: response.data });
      dispatch({ type: "SET_PAGINATION", payload: response.pagination });
    } catch (err) {
      console.log("🚀 ~ fetchUsers ~ err:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users on initial load and when filters/pagination change
  useEffect(() => {
    fetchUsers();
  }, [
    pagination.currentPage,
    pagination.rowsPerPage,
    sortField,
    sortOrder,
    searchQuery,
  ]);

  // Function to get sort indicator for the column
  const getSortIndicator = (field: string) => {
    if (sortField !== field) {
      return (
        <ArrowUpDown
          size={16}
          className="text-muted-foreground"
          aria-hidden="true"
        />
      );
    }

    return sortOrder === "asc" ? (
      <ArrowUp size={16} className="text-primary" aria-hidden="true" />
    ) : (
      <ArrowDown size={16} className="text-primary" aria-hidden="true" />
    );
  };

  // Get sorting descriptions for screen readers
  const getSortDescription = (field: string) => {
    if (sortField !== field) {
      return "Not sorted";
    }
    return sortOrder === "asc" ? "Sorted ascending" : "Sorted descending";
  };

  // Convert sort order to aria-sort value
  const getAriaSortValue = (
    field: string
  ): "ascending" | "descending" | "none" | undefined => {
    if (sortField !== field) return "none";
    return sortOrder === "asc" ? "ascending" : "descending";
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold" id="user-table-title">
          User Management
        </h2>
        <UserAdd onSuccess={fetchUsers} />
      </div>

      <div className="flex justify-between items-center gap-4">
        <UserSearch />
        {someSelected && (
          <div aria-live="polite" className="flex items-center">
            <span className="sr-only">{selectedCount} users selected</span>
            <UserBulkDelete onSuccess={fetchUsers} />
          </div>
        )}
      </div>

      <div className="rounded-md border">
        <Table aria-labelledby="user-table-title">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">
                <span className="sr-only">Select all users</span>
                <Checkbox
                  checked={allSelected || (someSelected && "indeterminate")}
                  onCheckedChange={() =>
                    dispatch({ type: "TOGGLE_SELECT_ALL" })
                  }
                  aria-label={
                    allSelected ? "Unselect all users" : "Select all users"
                  }
                />
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("name")}
                aria-sort={getAriaSortValue("name")}
              >
                <div className="flex items-center space-x-1">
                  <span>Name</span>
                  {getSortIndicator("name")}
                  <span className="sr-only">{getSortDescription("name")}</span>
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("email")}
                aria-sort={getAriaSortValue("email")}
              >
                <div className="flex items-center space-x-1">
                  <span>Email</span>
                  {getSortIndicator("email")}
                  <span className="sr-only">{getSortDescription("email")}</span>
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("role")}
                aria-sort={getAriaSortValue("role")}
              >
                <div className="flex items-center space-x-1">
                  <span>Role</span>
                  {getSortIndicator("role")}
                  <span className="sr-only">{getSortDescription("role")}</span>
                </div>
              </TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <span aria-live="polite">Loading users...</span>
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <span aria-live="polite">No users found.</span>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Checkbox
                      checked={!!selectedUsers[user.id]}
                      onCheckedChange={() =>
                        dispatch({
                          type: "TOGGLE_SELECT_USER",
                          payload: user.id,
                        })
                      }
                      aria-label={
                        selectedUsers[user.id]
                          ? `Unselect ${user.name}`
                          : `Select ${user.name}`
                      }
                    />
                  </TableCell>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.role === "admin"
                          ? "default"
                          : user.role === "editor"
                          ? "outline"
                          : "secondary"
                      }
                    >
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <UserEdit user={user} onSuccess={fetchUsers} />
                      <UserDelete user={user} onSuccess={fetchUsers} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <UserPagination />
    </div>
  );
}
