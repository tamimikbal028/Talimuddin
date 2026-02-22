import PotrikaPostCard from "./PotrikaPostCard";
import PostSkeleton from "../shared/skeletons/PostSkeleton";
import { potrikaHooks } from "../../hooks/usePotrika";

interface PotrikaPostsProps {
  potrikaId?: string;
}

const PotrikaPosts = ({ potrikaId }: PotrikaPostsProps) => {
  const {
    data: postsData,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = potrikaHooks.usePotrikaPosts(potrikaId);

  const posts = postsData?.pages.flatMap((page) => page.data.posts) || [];

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <PostSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-12 text-center shadow">
        <p className="font-medium text-red-600">{error.message}</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-12 text-center shadow">
        <p className="text-gray-500">Create first post on Al-Kausar!</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {posts.map((item) => (
          <PotrikaPostCard
            key={item.post._id}
            post={item.post}
            meta={item.meta}
          />
        ))}
      </div>

      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="mt-3 inline-block w-full rounded-lg bg-blue-500 px-6 py-3 text-center text-white transition-colors duration-300 hover:bg-blue-600"
        >
          {isFetchingNextPage ? "Loading..." : "Load More"}
        </button>
      )}
    </>
  );
};

export default PotrikaPosts;
