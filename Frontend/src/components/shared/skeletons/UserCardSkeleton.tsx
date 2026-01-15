import React from "react";

const UserCardSkeleton = () => {
  return (
    <div className="flex items-center space-x-3 rounded-lg border border-gray-300 bg-white p-2 shadow-sm">
      {/* Avatar Skeleton */}
      <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"></div>

      {/* Info Skeleton */}
      <div className="flex-1 space-y-2">
        <div className="h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-3 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
      </div>

      {/* Menu Button Skeleton */}
      <div className="h-5 w-5 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
    </div>
  );
};

export default UserCardSkeleton;
