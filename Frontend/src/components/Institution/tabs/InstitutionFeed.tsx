import React from "react";
import { useParams } from "react-router-dom";
import { institutionHooks } from "../../../hooks/useInstitution";
import InstitutionPostCard from "../InstitutionPostCard";
import CreateInstitutionPost from "../CreateInstitutionPost";
import PostSkeleton from "../../shared/skeletons/PostSkeleton";
import type { ApiError } from "../../../types";
import type { AxiosError } from "axios";

const InstitutionFeed: React.FC = () => {
  const { instId } = useParams<{ instId: string }>();
  const {
    isLoading,
    error,
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = institutionHooks.useInstitutionFeed();

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
      "Could not load posts";

    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-12 text-center shadow">
        <p className="font-medium text-red-600">{errorMessage}</p>
      </div>
    );
  }

  return (
    <>
      {/* Create Post */}
      <CreateInstitutionPost institutionId={instId as string} />

      {/* Posts List */}
      {posts.length > 0 ? (
        <div className="mt-4 space-y-3">
          {posts.map((item) => (
            <InstitutionPostCard
              key={item.post._id}
              post={item.post}
              meta={item.meta}
            />
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-lg border border-gray-200 bg-white p-12 text-center shadow">
          <p className="text-gray-500">No official updates yet.</p>
        </div>
      )}

      {/* Load More Button */}
      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="mt-4 inline-block w-full rounded-lg bg-blue-500 px-6 py-3 text-center text-white transition-colors duration-300 hover:bg-blue-600"
        >
          {isFetchingNextPage ? "Loading..." : "Load More"}
        </button>
      )}
    </>
  );
};

export default InstitutionFeed;
