import React from "react";
import { roomHooks } from "../../../hooks/useRoom";
import RoomPostSkeleton from "../../shared/skeletons/RoomPostSkeleton";
import type { ApiError } from "../../../types";
import type { AxiosError } from "axios";
import RoomPostCard from "../RoomPostCard";
import CreateRoomPost from "../CreateRoomPost";

const RoomPosts: React.FC = () => {
  const {
    isLoading,
    error,
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = roomHooks.useRoomPosts();

  const { data: roomResponse } = roomHooks.useRoomDetails();
  const roomMeta = roomResponse?.data.meta;

  const canPost =
    roomMeta?.isRoomAdmin || roomMeta?.isAppOwner || roomMeta?.isAppAdmin;

  const posts = data?.pages.flatMap((page) => page.data.posts) || [];

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <RoomPostSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    const axiosError = error as AxiosError<ApiError>;
    const errorMessage =
      axiosError.response?.data?.message ||
      error.message ||
      "Could not load posts";

    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-12 text-center shadow">
        <p className="font-medium text-red-600">{errorMessage}</p>
      </div>
    );
  }

  return (
    <>
      {/* Create Post Card */}
      {canPost && <CreateRoomPost />}

      {/* Posts List */}
      {posts.length > 0 ? (
        <div className="space-y-3">
          {posts.map((item) => (
            <RoomPostCard
              key={item.post._id}
              post={item.post}
              meta={item.meta}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center shadow">
          <p className="text-xl font-semibold text-gray-500">
            No posts available.
          </p>
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
    </>
  );
};

export default RoomPosts;
