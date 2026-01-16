import React from "react";

const GroupCardSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Group Avatar Skeleton */}
      <div className="h-40 w-full bg-gray-200"></div>

      {/* Content Skeleton */}
      <div className="p-3">
        {/* Group Name Skeleton */}
        <div className="mb-2 h-7 w-3/4 rounded bg-gray-300"></div>

        {/* Member Count Skeleton */}
        <div className="mb-3 flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-gray-200"></div>
          <div className="h-4 w-24 rounded bg-gray-200"></div>
        </div>

        {/* Button Skeleton */}
        <div className="h-10 w-full rounded-lg bg-gray-200"></div>
      </div>
    </div>
  );
};

export default GroupCardSkeleton;
