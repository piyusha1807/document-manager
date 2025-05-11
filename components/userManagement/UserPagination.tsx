"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useUsers } from "@/lib/context/UserContext";

export default function UserPagination() {
  const { state, dispatch } = useUsers();
  const { pagination } = state;

  // Handle page changes
  const handlePageChange = (newPage: number) => {
    dispatch({
      type: "SET_PAGINATION",
      payload: {
        ...pagination,
        currentPage: newPage,
      },
    });
  };

  // Handle rows per page changes
  const handleRowsPerPageChange = (value: string) => {
    dispatch({
      type: "SET_PAGINATION",
      payload: {
        ...pagination,
        rowsPerPage: parseInt(value, 10),
        currentPage: 0, // Reset to first page
      },
    });
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Label htmlFor="rows-per-page">Rows per page:</Label>
        <Select
          value={pagination.rowsPerPage.toString()}
          onValueChange={handleRowsPerPageChange}
        >
          <SelectTrigger id="rows-per-page" className="w-[70px]">
            <SelectValue placeholder={pagination.rowsPerPage.toString()} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(0)}
              disabled={pagination.currentPage === 0}
              title="First page"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
          </PaginationItem>
          <PaginationItem>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 0}
              title="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </PaginationItem>
          <PaginationItem className="flex items-center justify-center px-4">
            Page {pagination.currentPage + 1} of{" "}
            {Math.max(pagination.totalPages, 1)}
          </PaginationItem>
          <PaginationItem>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage >= pagination.totalPages - 1}
              title="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </PaginationItem>
          <PaginationItem>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(pagination.totalPages - 1)}
              disabled={pagination.currentPage >= pagination.totalPages - 1}
              title="Last page"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
