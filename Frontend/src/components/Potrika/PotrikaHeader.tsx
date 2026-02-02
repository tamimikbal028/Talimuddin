import type { Potrika } from "../../types";

interface PotrikaHeaderProps {
  data: Potrika;
}

const PotrikaHeader = ({ data }: PotrikaHeaderProps) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      {/* Cover Image */}
      {data.coverImage && (
        <div className="h-48 w-full overflow-hidden rounded-t-lg">
          <img
            src={data.coverImage}
            alt={`${data.name} cover`}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <div className="relative px-5 pb-5">
        {/* Avatar, Name and Description */}
        <div className="flex items-start gap-4">
          {data.avatar && (
            <div
              className={`${data.coverImage ? "-mt-12" : "mt-0"} relative z-10`}
            >
              <img
                src={data.avatar}
                alt={data.name}
                className="h-28 w-28 rounded-xl border-4 border-white bg-white object-cover shadow-md"
              />
            </div>
          )}

          <div
            className={`min-w-0 flex-1 ${data.avatar && data.coverImage ? "pt-2" : "pt-0"}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900">
                  {data.name}
                </h1>
                <p className="mt-1 text-sm leading-relaxed font-medium text-gray-600">
                  {data.description || "No description added yet."}
                </p>

                {/* Post Count */}
                <div className="mt-2 flex items-center gap-2">
                  <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-700/10 ring-inset">
                    {data.postsCount || 0}{" "}
                    {data.postsCount <= 1 ? "Post" : "Posts"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PotrikaHeader;
