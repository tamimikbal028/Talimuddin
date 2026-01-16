import React from "react";
import { FaMagic } from "react-icons/fa";
import FriendCard from "../shared/friends/FriendCard";
import FriendCardSkeleton from "../shared/skeletons/FriendCardSkeleton";
import { friendshipHooks } from "../../hooks/useFriendship";
import { toast } from "sonner";

const FriendSuggestions: React.FC = () => {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = friendshipHooks.useFriendSuggestions();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <FriendCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    toast.error("Failed to fetch suggestions. Please try again.");
    return (
      <div className="p-8 text-center text-red-500">
        Failed to fetch suggestions. Please try again.
        <p>Error: {error.message}</p>
      </div>
    );
  }

  const suggestions = data?.pages.flatMap((page) => page.data.users) || [];
  const totalDocs = data?.pages[0]?.data.pagination?.totalDocs || 0;

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-gray-900">
        Suggestions ({totalDocs})
      </h2>
      {suggestions.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-12 text-center">
          <div className="mb-4 rounded-full bg-white p-4 shadow-sm">
            <FaMagic className="h-8 w-8 text-blue-500" />
          </div>
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            No Suggestions
          </h3>
          <p className="text-sm font-medium text-gray-500">
            We don't have any friend suggestions for you right now.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {suggestions.map((item) => (
            <FriendCard
              key={item.user._id}
              friend={item.user}
              meta={item.meta}
            />
          ))}

          {hasNextPage && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="rounded-full bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md disabled:bg-blue-300"
              >
                {isFetchingNextPage ? "Loading more..." : "Load More"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FriendSuggestions;
