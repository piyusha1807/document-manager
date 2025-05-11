"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useUsers } from "@/lib/context/UserContext";

export default function UserSearch() {
  const { dispatch } = useUsers();
  const [searchInput, setSearchInput] = useState("");

  // Handle search input submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: "SET_SEARCH_QUERY", payload: searchInput });
  };

  return (
    <form onSubmit={handleSearch} className="relative flex-1">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search users..."
        className="pl-8"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
    </form>
  );
}
