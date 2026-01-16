import React from "react";
import GroupMemberCard from "../GroupMemberCard";
import FriendCardSkeleton from "../../shared/skeletons/FriendCardSkeleton";
import { groupHooks } from "../../../hooks/useGroup";
import { GROUP_MEMBERSHIP_STATUS } from "../../../constants";

const GroupMembersTab: React.FC = () => {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = groupHooks.useGroupMembers(GROUP_MEMBERSHIP_STATUS.JOINED);

  const members = data?.pages.flatMap((page) => page.data.members) || [];
  const currentUserRole = data?.pages[0]?.data.meta?.currentUserRole || null;
  const totalDocs =
    data?.pages[0]?.data.pagination?.totalDocs || members.length;

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
        Failed to load members.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">
        Members ({totalDocs})
      </h2>

      {members.length > 0 ? (
        <div className="space-y-3">
          {members.map((member) => (
            <GroupMemberCard
              key={member.meta.memberId}
              member={member}
              currentUserRole={currentUserRole}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center text-gray-500">
          No members found in this group.
        </div>
      )}

      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="w-full rounded-lg bg-gray-100 py-3 font-medium text-gray-600 transition-colors hover:bg-gray-200 disabled:opacity-50"
        >
          {isFetchingNextPage ? "Loading more members..." : "Load More Members"}
        </button>
      )}
    </div>
  );
};

export default GroupMembersTab;
