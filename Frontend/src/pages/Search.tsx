import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import SearchHeader from "../components/Search/SearchHeader";
import SearchBar from "../components/Search/SearchBar";
import SearchFilters from "../components/Search/SearchFilters";
import PeopleResults from "../components/Search/PeopleResults";
import PostsResults from "../components/Search/PostsResults";
import HashtagsResults from "../components/Search/HashtagsResults";
import GroupsResults from "../components/Search/GroupsResults";
import useSearch from "../hooks/useSearch";
import InstitutionsResults from "../components/Search/InstitutionsResults";
import DepartmentsResults from "../components/Search/DepartmentsResults";
import CommentsResults from "../components/Search/CommentsResults";

const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get("q") || "";
  const urlType = searchParams.get("type") || "all";

  const [activeFilter, setActiveFilter] = useState<string>(urlType);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    query: searchQuery,
    setQuery: setSearchQuery,
    results,
    loading,
    search,
  } = searchHooks.useSearch();

  // Initialize query from URL on mount
  useEffect(() => {
    if (urlQuery && urlQuery !== searchQuery) {
      setSearchQuery(urlQuery);
    }
    if (urlType && urlType !== activeFilter) {
      setActiveFilter(urlType);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only on mount

  // Sync URL when state changes
  useEffect(() => {
    const params: { q?: string; type?: string } = {};
    if (searchQuery) params.q = searchQuery;
    if (activeFilter !== "all") params.type = activeFilter;

    setSearchParams(params, { replace: true });
  }, [searchQuery, activeFilter, setSearchParams]);

  // Reset pagination when query or filter changes (except for append/load more)
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeFilter]);

  // Initial search trigger & trigger when URL params change
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim()) {
        search(searchQuery, activeFilter, 1);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, activeFilter, search]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  const handleSeeMore = (filterId: string) => {
    setActiveFilter(filterId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    search(searchQuery, activeFilter, nextPage, true); // append mode
  };

  const renderSectionHeader = (
    title: string,
    count: number,
    filterId: string
  ) => {
    if (activeFilter !== "all" || count === 0) return null;

    return (
      <div className="mb-4 flex items-center justify-between border-b pb-2">
        <h3 className="text-lg font-bold text-gray-800">
          {title}{" "}
          <span className="text-sm font-normal text-gray-500">({count})</span>
        </h3>
        <button
          onClick={() => handleSeeMore(filterId)}
          className="text-primary-600 hover:text-primary-700 flex items-center text-sm font-medium transition-colors"
        >
          See More <span className="ml-1">→</span>
        </button>
      </div>
    );
  };

  // Check if we have any actual data in the arrays
  const hasResults =
    results &&
    ((results.results?.users?.length || 0) > 0 ||
      (results.results?.posts?.length || 0) > 0 ||
      (results.results?.groups?.length || 0) > 0 ||
      (results.results?.hashtags?.length || 0) > 0 ||
      (results.results?.institutions?.length || 0) > 0 ||
      (results.results?.departments?.length || 0) > 0 ||
      (results.results?.comments?.length || 0) > 0);

  return (
    <>
      <SearchHeader />
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />
      <SearchFilters
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
        resultCounts={results?.counts}
      />

      {/* Empty State */}
      {!searchQuery.trim() && (
        <div className="mt-16 text-center">
          <div className="mb-4 text-7xl">🔍</div>
          <h3 className="mb-2 text-2xl font-semibold text-gray-900">
            Search SocialHub
          </h3>
          <p className="text-gray-600">
            Start typing to search for people, posts, groups, and more
          </p>
        </div>
      )}

      {/* Loading State - Only show full loader for first page */}
      {loading && currentPage === 1 && (
        <div className="mt-12 text-center">
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !border-0 !p-0 !whitespace-nowrap ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
        </div>
      )}

      {/* Search Results */}
      {searchQuery.trim() && (
        <div className="mt-6 space-y-10">
          {/* People Section */}
          <div
            className={
              (activeFilter === "all" || activeFilter === "users") &&
              (results?.results?.users?.length || 0) > 0
                ? "block"
                : "hidden"
            }
          >
            {renderSectionHeader("People", results?.counts.users || 0, "users")}
            <PeopleResults
              isVisible={true}
              people={results?.results?.users || []}
            />
          </div>

          {/* Posts Section */}
          <div
            className={
              (activeFilter === "all" || activeFilter === "posts") &&
              (results?.results?.posts?.length || 0) > 0
                ? "block"
                : "hidden"
            }
          >
            {renderSectionHeader("Posts", results?.counts.posts || 0, "posts")}
            <PostsResults
              isVisible={true}
              posts={results?.results?.posts || []}
            />
          </div>

          {/* Groups Section */}
          <div
            className={
              (activeFilter === "all" || activeFilter === "groups") &&
              (results?.results?.groups?.length || 0) > 0
                ? "block"
                : "hidden"
            }
          >
            {renderSectionHeader(
              "Groups",
              results?.counts.groups || 0,
              "groups"
            )}
            <GroupsResults
              isVisible={true}
              groups={results?.results?.groups || []}
            />
          </div>

          {/* Hashtags Section - Not in the provided diff, but keeping for completeness if it was meant to be included */}
          <div
            className={
              (activeFilter === "all" || activeFilter === "hashtags") &&
              (results?.results?.hashtags?.length || 0) > 0
                ? "block"
                : "hidden"
            }
          >
            {renderSectionHeader(
              "Hashtags",
              results?.counts.hashtags || 0,
              "hashtags"
            )}
            <HashtagsResults
              isVisible={true}
              hashtags={results?.results?.hashtags || []}
            />
          </div>

          {/* Institutions Section */}
          <div
            className={
              (activeFilter === "all" || activeFilter === "institutions") &&
              (results?.results?.institutions?.length || 0) > 0
                ? "block"
                : "hidden"
            }
          >
            {renderSectionHeader(
              "Institutions",
              results?.counts.institutions || 0,
              "institutions"
            )}
            <InstitutionsResults
              isVisible={true}
              institutions={results?.results?.institutions || []}
            />
          </div>

          {/* Departments Section */}
          <div
            className={
              (activeFilter === "all" || activeFilter === "departments") &&
              (results?.results?.departments?.length || 0) > 0
                ? "block"
                : "hidden"
            }
          >
            {renderSectionHeader(
              "Departments",
              results?.counts.departments || 0,
              "departments"
            )}
            <DepartmentsResults
              isVisible={true}
              departments={results?.results?.departments || []}
            />
          </div>

          {/* Comments Section */}
          <div
            className={
              (activeFilter === "all" || activeFilter === "comments") &&
              (results?.results?.comments?.length || 0) > 0
                ? "block"
                : "hidden"
            }
          >
            {renderSectionHeader(
              "Comments",
              results?.counts.comments || 0,
              "comments"
            )}
            <CommentsResults
              isVisible={true}
              comments={results?.results?.comments || []}
            />
          </div>

          {/* Load More Button - Only for specific filters and when more results available */}
          {activeFilter !== "all" && results?.pagination?.hasMore && (
            <div className="mt-8 flex justify-center pb-10">
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="rounded-full border border-gray-300 bg-white px-6 py-2 font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 disabled:opacity-50"
              >
                {loading ? "Loading..." : "Load More Results"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* No Results */}
      {!loading && searchQuery.trim() && results && !hasResults && (
        <div className="mt-12 text-center">
          <div className="mb-4 text-6xl">🔍</div>
          <h3 className="mb-2 text-xl font-semibold text-gray-900">
            No results found
          </h3>
          <p className="text-gray-600">
            Try searching with different keywords or check your spelling
          </p>
        </div>
      )}
    </>
  );
};

export default Search;


