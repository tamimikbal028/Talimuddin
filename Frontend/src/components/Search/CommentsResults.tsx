import React from "react";
import { Link } from "react-router-dom";

import type { SearchComment } from "../../types";

interface CommentsResultsProps {
  isVisible: boolean;
  comments?: SearchComment[];
}

const CommentsResults: React.FC<CommentsResultsProps> = ({
  isVisible,
  comments = [],
}) => {
  if (!isVisible) return null;
  if (comments.length === 0) return null;

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold text-gray-900">
        Comments ({comments.length})
      </h2>
      <div className="space-y-3">
        {comments.map((comment) => (
          <div
            key={comment._id}
            className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="mb-2 flex items-center space-x-2">
              <img
                src={comment.author.avatar}
                alt={comment.author.fullName}
                className="h-6 w-6 rounded-full"
              />
              <span className="text-sm font-semibold">
                {comment.author.fullName}
              </span>
            </div>
            <p className="text-gray-700">{comment.content}</p>
            {comment.post && (
              <Link
                to={`/post/${comment.post}`}
                className="mt-2 inline-block text-xs font-medium text-blue-600 hover:underline"
              >
                View Post
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentsResults;
