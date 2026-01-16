import React from "react";
import GroupPostCard from "./../GroupPostCard";
import { groupHooks } from "../../../hooks/useGroup";
import PostSkeleton from "../../shared/skeletons/PostSkeleton";

const GroupPinnedPosts = () => {
  const {
    data: pinnedData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = groupHooks.useGroupPinnedPosts();

  const posts = pinnedData?.pages.flatMap((page) => page.data.posts) || [];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <PostSkeleton />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-12 text-center shadow">
        <p className="text-gray-500">No pinned posts to show.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((item) => (
        <GroupPostCard key={item.post._id} post={item.post} meta={item.meta} />
      ))}

      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="w-full rounded-lg border border-blue-600 p-3 text-center font-medium text-blue-600 transition-colors hover:bg-blue-600 hover:text-white disabled:opacity-50"
        >
          {isFetchingNextPage ? "Loading..." : "Load More"}
        </button>
      )}
    </div>
  );
};

export default GroupPinnedPosts;


