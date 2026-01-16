import { FaUniversity } from "react-icons/fa";
import GroupCard from "../utils/GroupCard";
import GroupEmptyState from "../utils/GroupEmptyState";
import GroupErrorState from "../utils/GroupErrorState";
import GroupCardSkeleton from "../../shared/skeletons/GroupCardSkeleton";
import { groupHooks } from "../../../hooks/useGroup";
import { GROUP_LIMIT } from "../../../constants";

const UniversityGroups = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = groupHooks.useUniversityGroups();

  const groups = data?.pages.flatMap((page) => page.data.groups) || [];
  const totalDocs = data?.pages[0]?.data.pagination.totalDocs || 0;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(GROUP_LIMIT)].map((_, i) => (
          <GroupCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <GroupErrorState
        message="Failed to load university groups. Please check your connection."
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div>
      <h2 className="mb-3 text-xl font-semibold text-gray-900">
        University Groups {totalDocs ? `(${totalDocs})` : ""}
      </h2>

      {groups.length === 0 ? (
        <GroupEmptyState
          icon={FaUniversity}
          title="No University Groups"
          message="There are no official university groups available at the moment."
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {groups.map((item) => (
              <GroupCard
                key={item.group._id}
                group={item.group}
                meta={item.meta}
              />
            ))}
            {/* Loading Skeletons for Next Page inside the same grid */}
            {isFetchingNextPage &&
              [...Array(GROUP_LIMIT)].map((_, i) => (
                <GroupCardSkeleton key={`skeleton-${i}`} />
              ))}
          </div>

          {/* Load More Button */}
          {hasNextPage && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg disabled:opacity-70"
              >
                {isFetchingNextPage ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Loading more...
                  </>
                ) : (
                  "Load More"
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UniversityGroups;
