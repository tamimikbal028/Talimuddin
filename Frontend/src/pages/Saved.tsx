import { FaBookmark } from "react-icons/fa";

const Saved = () => {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="rounded-lg border border-gray-300 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <FaBookmark className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Saved Items</h1>
            <p className="text-sm font-medium text-gray-500">
              Your bookmarked posts.
            </p>
          </div>
        </div>
      </div>

      {/* Empty State */}
      <div className="rounded-lg border border-gray-300 bg-white p-12 text-center shadow-sm">
        <FaBookmark className="mx-auto mb-4 h-16 w-16 text-gray-300" />
        <h2 className="mb-2 text-xl font-semibold text-gray-900">
          No saved post yet
        </h2>
        <p className="font-medium text-gray-500">
          Bookmark posts to save them for later. They&apos;ll appear here.
        </p>
      </div>
    </div>
  );
};

export default Saved;
