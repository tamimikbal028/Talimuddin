const CommentSkeleton = () => {
  return (
    <div className="flex animate-pulse gap-3 py-1">
      {/* Avatar Skeleton */}
      <div className="h-8 w-8 flex-shrink-0 rounded-full bg-gray-300"></div>

      {/* Content Skeleton */}
      <div className="flex-1">
        <div className="rounded-lg bg-gray-200 px-3 py-2">
          <div className="mb-2 flex items-center gap-2">
            {/* Name Skeleton */}
            <div className="h-3 w-24 rounded bg-gray-300"></div>
            {/* Date Skeleton */}
            <div className="h-2 w-12 rounded bg-gray-300"></div>
          </div>
          {/* Text Skeleton */}
          <div className="space-y-2">
            <div className="h-3 w-full rounded bg-gray-300"></div>
            <div className="h-3 w-3/4 rounded bg-gray-300"></div>
          </div>
        </div>

        {/* Action Buttons Skeleton */}
        <div className="mt-1 ml-1 flex items-center gap-4">
          <div className="h-2 w-8 rounded bg-gray-300"></div>
          <div className="h-2 w-8 rounded bg-gray-300"></div>
        </div>
      </div>
    </div>
  );
};

export default CommentSkeleton;
