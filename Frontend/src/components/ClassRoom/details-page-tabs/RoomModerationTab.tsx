import React from "react";
import RoomPendingPostCard from "../details-page/RoomPendingPostCard";
import { roomHooks } from "../../../hooks/useRoom";
import PostSkeleton from "../../shared/skeletons/PostSkeleton";
import type { ApiError } from "../../../types";
import type { AxiosError } from "axios";

const RoomModerationTab: React.FC = () => {
  const { data: roomDetails } = roomHooks.useRoomDetails();
  const isAdmin =
    roomDetails?.data.meta.isAdmin || roomDetails?.data.meta.isCreator;

  const {
    isLoading,
    error,
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = roomHooks.useRoomPendingPosts();

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
      <div className="mt-4 rounded-2xl border border-red-100 bg-red-50 p-12 text-center shadow-sm">
        <p className="font-semibold text-red-600">
          {axiosError.response?.data?.message || "Could not load pending posts"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">
          Pending Posts ({posts.length})
        </h2>
      </div>

      {posts.length > 0 ? (
        <div className="space-y-3">
          {posts.map((postItem) => (
            <RoomPendingPostCard
              key={postItem.post._id}
              post={postItem.post}
              meta={postItem.meta}
              isAdminView={isAdmin}
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <p className="text-lg font-medium text-gray-600">
            No pending posts found
          </p>
          <p className="mt-1 text-sm text-gray-500">
            {isAdmin
              ? "When members submit posts that require approval, they will appear here."
              : "Your submitted posts will appear here while waiting for a teacher's review."}
          </p>
        </div>
      )}

      {/* Load More Button */}
      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="inline-block w-full rounded-lg bg-blue-500 px-6 py-3 text-center font-medium text-white transition-colors duration-300 hover:bg-blue-600 disabled:opacity-50"
        >
          {isFetchingNextPage ? "Loading more..." : "Load More Posts"}
        </button>
      )}
    </div>
  );
};

export default RoomModerationTab;
