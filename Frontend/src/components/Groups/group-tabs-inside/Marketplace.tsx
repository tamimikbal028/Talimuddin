import React from "react";
import GroupPostCard from "./../GroupPostCard";
import { groupHooks } from "../../../hooks/useGroup";
import PostSkeleton from "../../shared/skeletons/PostSkeleton";
import CreateMarketplacePost from "../CreateMarketplacePost";
import type { ApiError } from "../../../types";
import type { AxiosError } from "axios";
import { FaShoppingCart } from "react-icons/fa";

const Marketplace: React.FC = () => {
  const { data: groupResponse } = groupHooks.useGroupDetails();
  const meta = groupResponse?.data?.meta;
  const group = groupResponse?.data?.group;

  const {
    isLoading,
    error,
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = groupHooks.useGroupMarketplacePosts();

  const posts = data?.pages.flatMap((page) => page.data.posts) || [];

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <PostSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    const axiosError = error as AxiosError<ApiError>;
    const errorMessage =
      axiosError.response?.data?.message ||
      error.message ||
      "Could not load marketplace posts";

    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-12 text-center shadow">
        <p className="font-medium text-red-600">{errorMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Create Post - Only for members */}
      {meta?.isMember && group && <CreateMarketplacePost groupId={group._id} />}

      {/* Posts List */}
      {posts.length > 0 ? (
        <div className="space-y-3">
          {posts.map((item) => (
            <GroupPostCard
              key={item.post._id}
              post={item.post}
              meta={item.meta}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center shadow">
          <FaShoppingCart className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <p className="font-medium text-gray-500">No items for sale yet.</p>
        </div>
      )}

      {/* Load More Button */}
      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="inline-block w-full rounded-lg bg-blue-500 px-6 py-3 text-center text-white transition-colors duration-300 hover:bg-blue-600"
        >
          {isFetchingNextPage ? "Loading..." : "Load More"}
        </button>
      )}
    </div>
  );
};

export default Marketplace;
