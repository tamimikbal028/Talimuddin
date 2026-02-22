import BranchCard from "./BranchCard";
import BranchCardSkeleton from "../shared/skeletons/BranchCardSkeleton";
import ErrorState from "../shared/ErrorState";
import EmptyState from "../shared/EmptyState";
import { branchHooks } from "../../hooks/useBranch";
import { authHooks } from "../../hooks/useAuth";
import { USER_TYPES } from "../../constants/user";
import { BRANCH_LIMIT } from "../../constants";
import type { BranchListItem } from "../../types";
import { FaDoorOpen } from "react-icons/fa";

const MyBranch = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = branchHooks.useMyBranches();
  const { user } = authHooks.useUser();

  const branches: BranchListItem[] =
    data?.pages.flatMap((page) => page.data.branches) || [];
  const totalDocs = data?.pages[0]?.data.pagination.totalDocs || 0;

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

  if (isError) {
    return <ErrorState message="Failed to load branches" />;
  }

  return (
    <div className="space-y-3">
      {/* header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          Joined Branches {totalDocs ? `(${totalDocs})` : ""}
        </h2>
      </div>

      {/* no branches message */}
      {branches.length === 0 ? (
        <EmptyState
          icon={FaDoorOpen}
          message={
            user?.userType === USER_TYPES.OWNER
              ? "Create or join a branch to get started."
              : "Join a branch to get started."
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {branches.map((b) => (
              <BranchCard key={b._id} branch={b} />
            ))}
            {/* Loading Skeleton for Next Page inside the same grid */}
            {isFetchingNextPage &&
              [...Array(BRANCH_LIMIT)].map((_, i) => (
                <BranchCardSkeleton key={`skeleton-${i}`} />
              ))}
          </div>

          {/* Load More Button */}
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
        </>
      )}
    </div>
  );
};

export default MyBranch;
