const ProfileHeaderSkeleton = () => {
  return (
    <div className="relative animate-pulse rounded-lg border border-gray-300 bg-white p-5 shadow-sm">
      {/* 3-Dot Menu Skeleton */}
      <div className="absolute top-4 right-4 h-9 w-9 rounded-full bg-gray-300"></div>

      <div className="flex items-start space-x-5">
        {/* Avatar Skeleton */}
        <div className="flex-shrink-0">
          <div className="h-32 w-32 rounded-full border-4 border-white bg-gray-300 shadow-lg"></div>
        </div>

        {/* Profile Info Skeleton */}
        <div className="flex-1">
          <div>
            {/* Name Skeleton */}
            <div className="mb-2 h-8 w-64 rounded bg-gray-300"></div>

            {/* Institution & Department Skeleton */}
            <div className="mt-2 space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-gray-300"></div>
                <div className="h-4 w-48 rounded bg-gray-300"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-gray-300"></div>
                <div className="h-4 w-56 rounded bg-gray-300"></div>
              </div>
            </div>

            {/* Bio Skeleton */}
            <div className="mt-4 space-y-2">
              <div className="h-4 w-full max-w-prose rounded bg-gray-300"></div>
              <div className="h-4 w-3/4 rounded bg-gray-300"></div>
            </div>

            {/* Stats Skeleton */}
            <div className="mt-4 flex gap-4">
              <div className="h-4 w-20 rounded bg-gray-300"></div>
              <div className="h-4 w-20 rounded bg-gray-300"></div>
              <div className="h-4 w-20 rounded bg-gray-300"></div>
            </div>
          </div>

          {/* Action Buttons Skeleton */}
          <div className="pt-4">
            <div className="flex gap-3">
              <div className="h-10 w-32 rounded-md bg-gray-300"></div>
              <div className="h-10 w-32 rounded-md bg-gray-300"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeaderSkeleton;
