import React from "react";
import SearchPostCard from "./SearchPostCard";
import type { SearchPost } from "../../types";

interface PostsResultsProps {
  isVisible: boolean;
  posts?: SearchPost[];
}

const PostsResults: React.FC<PostsResultsProps> = ({
  isVisible,
  posts = [],
}) => {
  if (!isVisible) return null;
  if (posts.length === 0) return null;

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold text-gray-900">
        Posts ({posts.length})
      </h2>
      <div className="space-y-4">
        {posts.map((post) => (
          <SearchPostCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default PostsResults;
