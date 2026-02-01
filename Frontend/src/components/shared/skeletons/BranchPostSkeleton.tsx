const BranchPostSkeleton = () => {
  return (
    <div className="animate-pulse rounded border border-gray-400 bg-white shadow">
      {/* Post Header Skeleton */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-200"></div>
          <div className="space-y-2">
            <div className="h-4 w-32 rounded bg-gray-200"></div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-20 rounded bg-gray-100"></div>
              <div className="h-1 w-1 rounded-full bg-gray-100"></div>
              <div className="h-3 w-16 rounded bg-gray-100"></div>
            </div>
          </div>
        </div>

        {/* Action Buttons Skeleton */}
        <div className="flex items-center space-x-2">
          {/* Reply Button */}
          <div className="h-9 w-[72px] rounded-lg border border-gray-200 bg-gray-50"></div>
          {/* Mark as Read Button */}
          <div className="h-9 w-28 rounded-lg bg-gray-100"></div>
          {/* More Button */}
          <div className="h-9 w-9 rounded-lg bg-gray-100"></div>
        </div>
      </div>

      {/* Post Content Skeleton */}
      <div className="px-4 pb-3">
        <div className="space-y-2">
          <div className="h-4 w-full rounded bg-gray-100"></div>
          <div className="h-4 w-5/6 rounded bg-gray-100"></div>
          <div className="h-4 w-4/6 rounded bg-gray-100"></div>
        </div>

        {/* Tags Skeleton */}
        <div className="mt-4 flex flex-wrap gap-2">
          <div className="h-7 w-16 rounded-full bg-gray-100"></div>
          <div className="h-7 w-20 rounded-full bg-gray-100"></div>
        </div>
      </div>
    </div>
  );
};

export default BranchPostSkeleton;
