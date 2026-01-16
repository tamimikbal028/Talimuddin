import React from "react";
import RoomCard from "../RoomCard";
import RoomCardSkeleton from "../../shared/skeletons/RoomCardSkeleton";
import ErrorState from "../../shared/ErrorState";
import EmptyState from "../../shared/EmptyState";
import { roomHooks } from "../../../hooks/useRoom";
import { ROOM_LIMIT } from "../../../constants";
import type { RoomListItem } from "../../../types";
import { FaDoorOpen } from "react-icons/fa";

const AllRooms: React.FC = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = roomHooks.useAllRooms();

  const rooms: RoomListItem[] =
    data?.pages.flatMap((page) => page.data.rooms) || [];
  const totalDocs = data?.pages[0]?.data.pagination.totalDocs || 0;

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-7 w-32 animate-pulse rounded bg-gray-200"></div>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(ROOM_LIMIT)].map((_, i) => (
            <RoomCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return <ErrorState message="Failed to load rooms" />;
  }

  return (
    <div className="space-y-3">
      {/* header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          All Rooms {totalDocs ? `(${totalDocs})` : ""}
        </h2>
      </div>

      {/* no rooms message */}
      {rooms.length === 0 ? (
        <EmptyState icon={FaDoorOpen} message="No rooms found in the system." />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {rooms.map((r) => (
              <RoomCard key={r._id} room={r} />
            ))}
            {/* Loading Skeleton for Next Page */}
            {isFetchingNextPage &&
              [...Array(ROOM_LIMIT)].map((_, i) => (
                <RoomCardSkeleton key={`skeleton-${i}`} />
              ))}
          </div>

          {/* Load More Button */}
          {hasNextPage && (
            <div className="flex justify-center pt-4">
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-gray-300 focus:outline-none disabled:opacity-50"
              >
                {isFetchingNextPage ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AllRooms;
