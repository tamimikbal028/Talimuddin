import BranchCard from "./BranchCard";
import BranchCardSkeleton from "../shared/skeletons/BranchCardSkeleton";
import ErrorState from "../shared/ErrorState";
import EmptyState from "../shared/EmptyState";
import { branchHooks } from "../../hooks/useBranch";
import { BRANCH_LIMIT } from "../../constants";
import { FaDoorOpen } from "react-icons/fa";

const AllBranches = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = branchHooks.useAllBranches();

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-7 w-32 animate-pulse rounded bg-gray-200"></div>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(BRANCH_LIMIT)].map((_, i) => (
            <BranchCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error.message} />;
  }

  if (!data) {
    return null;
  }

  const branches = data.pages.flatMap((page) => page.data.branches);
  const totalDocs = data.pages[0].data.pagination.totalDocs;

  if (branches.length === 0) {
    return <EmptyState icon={FaDoorOpen} message="No branches found" />;
  }

  return (
    <div className="space-y-3">
      {/* header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          All Branches ({totalDocs})
        </h2>
      </div>

      {/* branches list */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {branches.map((b) => (
          <BranchCard key={b._id} branch={b} />
        ))}

        {isFetchingNextPage &&
          [...Array(BRANCH_LIMIT)].map((_, i) => (
            <BranchCardSkeleton key={`skeleton-${i}`} />
          ))}
      </div>

      {/* load more button */}
      {hasNextPage && (
        <div className="flex justify-center pt-4">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-gray-300 focus:outline-none disabled:opacity-50"
          >
            {isFetchingNextPage ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default AllBranches;
