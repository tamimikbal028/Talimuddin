import React from "react";
import type { SearchHashtag } from "../../types";

interface HashtagsResultsProps {
  isVisible: boolean;
  hashtags?: SearchHashtag[];
}

const HashtagsResults: React.FC<HashtagsResultsProps> = ({
  isVisible,
  hashtags = [],
}) => {
  if (!isVisible) return null;
  if (hashtags.length === 0) return null;

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold text-gray-900">
        Hashtags ({hashtags.length})
      </h2>
      <div className="space-y-4">
        {hashtags.map((tag) => (
          <div
            key={tag.name}
            className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
          >
            <p className="font-semibold text-blue-600">#{tag.name}</p>
            <p className="text-sm text-gray-500">
              {tag.count} {tag.count === 1 ? "post" : "posts"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HashtagsResults;
