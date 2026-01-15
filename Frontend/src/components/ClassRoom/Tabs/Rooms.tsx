import React from "react";
import RoomCard from "../RoomCard";
import { roomHooks } from "../../../hooks/useRoom";
import { authHooks } from "../../../hooks/useAuth";
import { USER_TYPES } from "../../../constants/user";
import type { RoomListItem } from "../../../types";

interface RoomsProps {
  type: "all" | "my";
}

const Rooms: React.FC<RoomsProps> = ({ type }) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = type === "all" ? roomHooks.useAllRooms() : roomHooks.useMyRooms();

  const { user } = authHooks.useUser();

  const rooms: RoomListItem[] =
    data?.pages.flatMap((page) => page.data.rooms) || [];
  const totalDocs = data?.pages[0]?.data.pagination.totalDocs || 0;

  if (isLoading) {
    return (
      <div className="rounded-xl border border-gray-300 bg-white p-6 shadow">
        <p className="text-sm text-gray-600">Loading rooms...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-300 bg-red-50 p-6 shadow">
        <p className="text-sm text-red-600">Failed to load rooms</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          {type === "all" ? "All Rooms" : "My Rooms"}{" "}
          {totalDocs ? `(${totalDocs})` : ""}
        </h2>
      </div>

      {/* no rooms message */}
      {rooms.length === 0 ? (
        <div className="rounded-xl border border-gray-300 bg-white p-6 shadow">
          <p className="text-center text-sm font-medium text-gray-600">
            {type === "all"
              ? "No rooms available yet."
              : user?.userType === USER_TYPES.TEACHER
                ? "Create or join a room to get started."
                : "Join a room to get started."}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {rooms.map((r) => (
              <RoomCard key={r._id} room={r} />
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

          {/* Loading Skeleton for Next Page */}
          {isFetchingNextPage && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={`skeleton-${i}`}
                  className="h-64 animate-pulse rounded-xl bg-gray-100"
                ></div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Rooms;
