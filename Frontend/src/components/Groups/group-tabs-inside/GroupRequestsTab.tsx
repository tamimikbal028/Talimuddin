import React from "react";
import GroupMemberCard from "../GroupMemberCard";
import FriendCardSkeleton from "../../shared/skeletons/FriendCardSkeleton";
import { groupHooks } from "../../../hooks/useGroup";
import { GROUP_MEMBERSHIP_STATUS } from "../../../constants";

const GroupRequestsTab: React.FC = () => {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = groupHooks.useGroupMembers(GROUP_MEMBERSHIP_STATUS.PENDING);

  const requests = data?.pages.flatMap((page) => page.data.members) || [];
  const currentUserRole = data?.pages[0]?.data.meta?.currentUserRole || null;
  const totalDocs =
    data?.pages[0]?.data.pagination?.totalDocs || requests.length;

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <FriendCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        Failed to load join requests.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">
          Join Requests ({totalDocs})
        </h2>
      </div>

      {requests.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-1">
          {requests.map((member) => (
            <GroupMemberCard
              key={member.meta.memberId}
              member={member}
              currentUserRole={currentUserRole}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-12 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <svg
              className="h-8 w-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </div>
          <p className="text-lg font-medium text-gray-600">
            No pending requests
          </p>
          <p className="mt-1 text-sm text-gray-500">
            When people ask to join your group, they'll show up here.
          </p>
        </div>
      )}

      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="w-full rounded-lg bg-gray-100 py-3 font-medium text-gray-600 transition-colors hover:bg-gray-200 disabled:opacity-50"
        >
          {isFetchingNextPage
            ? "Loading more requests..."
            : "Load More Requests"}
        </button>
      )}
    </div>
  );
};

export default GroupRequestsTab;
