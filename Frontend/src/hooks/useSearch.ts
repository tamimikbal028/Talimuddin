import { useState, useCallback } from "react";
import { searchService } from "../services/search.service";
import type { GlobalSearchResponse } from "../types";

const useSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GlobalSearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search function
  const search = useCallback(
    async (
      searchQuery: string,
      type: string = "all",
      page: number = 1,
      append: boolean = false
    ) => {
      if (!searchQuery.trim()) {
        setResults(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await searchService.globalSearch(
          searchQuery,
          type,
          page,
          type === "all" ? 5 : 15 // Limit to 5 for 'all', 15 for specific
        );

        const newResultsData = response.data;

        if (append) {
          // Merge results for the specific type
          setResults((prev) => {
            if (!prev) return newResultsData;

            if (type === "all") return newResultsData; // Should not happen in append mode
            const key = type as keyof typeof prev.results;

            return {
              ...newResultsData,
              results: {
                ...prev.results,
                [key]: [
                  ...(prev.results[key] || []),
                  ...(newResultsData.results[key] || []),
                ],
              },
              counts: newResultsData.counts,
              pagination: newResultsData.pagination,
            };
          });
        } else {
          setResults(newResultsData);
        }
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Search failed";
        setError(errorMessage);
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const resetResults = useCallback(() => {
    setResults(null);
  }, []);

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    search,
    resetResults,
  };
};

const searchHooks = {
  useSearch,
} as const;

export { searchHooks };
