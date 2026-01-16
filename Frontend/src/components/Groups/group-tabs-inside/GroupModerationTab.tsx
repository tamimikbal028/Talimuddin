import React from "react";
import PendingPostCard from "../PendingPostCard";
import { groupHooks } from "../../../hooks/useGroup";
import PostSkeleton from "../../shared/skeletons/PostSkeleton";
import type { ApiError } from "../../../types";
import type { AxiosError } from "axios";

const GroupModerationTab: React.FC = () => {
  const {
    isLoading,
    error,
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = groupHooks.usePendingPosts();

  const posts = data?.pages.flatMap((page) => page.data.posts) || [];

  if (isLoading) {
    return (
      <div className="space-y-4 pt-2">
        {[1, 2, 3].map((i) => (
          <PostSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    const axiosError = error as AxiosError<ApiError>;
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-12 text-center shadow-sm">
        <p className="font-semibold text-red-600">
          {axiosError.response?.data?.message || "Could not load pending posts"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-2">
      {/* Posts List */}
      {posts.length > 0 ? (
        <div className="grid gap-4">
          {posts.map((post) => (
            <PendingPostCard
              key={post._id}
              post={post}
              meta={{
                isLiked: false,
                isSaved: false,
                isMine: false,
                isRead: false,
              }}
            />
          ))}
        </div>
      ) : (
        <div className="flex h-25 flex-col items-center justify-center border-3 bg-green-50">
          <p className="text-sm font-medium text-gray-700">
            There are no pending posts waiting for approval at this time.
          </p>
        </div>
      )}

      {/* Load More Button */}
      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="group relative flex w-full items-center justify-center overflow-hidden rounded-xl bg-white px-6 py-4 font-bold text-gray-700 shadow-sm ring-1 ring-gray-100 transition-all hover:bg-gray-50 hover:text-blue-600 hover:ring-blue-100 disabled:opacity-50"
        >
          <div className="flex items-center space-x-2">
            {isFetchingNextPage ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
            ) : null}
            <span>{isFetchingNextPage ? "Working..." : "Load More Posts"}</span>
          </div>
        </button>
      )}
    </div>
  );
};

export default GroupModerationTab;


