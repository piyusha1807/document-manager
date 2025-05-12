"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useDocuments } from "@/lib/context/DocumentContext";

export default function DocumentSearch() {
  const { state, dispatch } = useDocuments();
  const [inputValue, setInputValue] = useState(state.searchQuery);

  // Update input value when search query changes
  useEffect(() => {
    setInputValue(state.searchQuery);
  }, [state.searchQuery]);

  // Update search query after typing stops (debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue !== state.searchQuery) {
        dispatch({ type: "SET_SEARCH_QUERY", payload: inputValue });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue, dispatch, state.searchQuery]);

  return (
    <Input
      type="search"
      placeholder="Search documents..."
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      className="max-w-sm"
      aria-label="Search documents"
    />
  );
}
