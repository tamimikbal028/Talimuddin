const PostSkeleton = () => {
  return (
    <div className="animate-pulse rounded-lg border border-gray-400 bg-white shadow">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          {/* Avatar */}
          <div className="h-10 w-10 rounded-full bg-gray-300"></div>
          <div>
            {/* Name */}
            <div className="mb-2 h-4 w-32 rounded bg-gray-300"></div>
            {/* Date/Time */}
            <div className="flex items-center gap-2">
              <div className="h-3 w-20 rounded bg-gray-300"></div>
              <div className="h-1 w-1 rounded-full bg-gray-300"></div>
              <div className="h-3 w-16 rounded bg-gray-300"></div>
            </div>
          </div>
        </div>
        {/* Menu Icon */}
        <div className="flex items-center space-x-2">
          <div className="h-9 w-20 rounded-lg bg-gray-300"></div>
          <div className="h-9 w-9 rounded-lg bg-gray-300"></div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="px-4 pb-3">
        <div className="space-y-2">
          <div className="h-4 w-full rounded bg-gray-300"></div>
          <div className="h-4 w-5/6 rounded bg-gray-300"></div>
          <div className="h-4 w-4/6 rounded bg-gray-300"></div>
        </div>

        {/* Tags Skeleton */}
        <div className="mt-3 flex flex-wrap gap-2">
          <div className="h-6 w-16 rounded-full bg-gray-300"></div>
          <div className="h-6 w-20 rounded-full bg-gray-300"></div>
          <div className="h-6 w-14 rounded-full bg-gray-300"></div>
        </div>
      </div>

      {/* Image Skeleton (Optional placeholder) */}
      <div className="px-4 pb-3">
        <div className="h-64 w-full rounded-lg bg-gray-300"></div>
      </div>

      {/* Stats Bar Skeleton */}
      <div className="border-t border-gray-100 px-4 py-2">
        <div className="flex items-center space-x-3">
          <div className="h-4 w-16 rounded bg-gray-300"></div>
          <div className="h-1 w-1 rounded-full bg-gray-300"></div>
          <div className="h-4 w-20 rounded bg-gray-300"></div>
          <div className="h-1 w-1 rounded-full bg-gray-300"></div>
          <div className="h-4 w-16 rounded bg-gray-300"></div>
        </div>
      </div>

      {/* Action Buttons Skeleton */}
      <div className="border-t border-gray-100 px-4 py-3">
        <div className="grid grid-cols-3 gap-2">
          <div className="h-9 rounded-lg bg-gray-300"></div>
          <div className="h-9 rounded-lg bg-gray-300"></div>
          <div className="h-9 rounded-lg bg-gray-300"></div>
        </div>
      </div>
    </div>
  );
};

export default PostSkeleton;
