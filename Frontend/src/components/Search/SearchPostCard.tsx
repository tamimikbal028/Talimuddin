import React from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaRegComment } from "react-icons/fa";
import { formatPostDate } from "../../utils/dateUtils";
import SeparatorDot from "../shared/SeparatorDot";
import type { Post } from "../../types";

interface SearchPostCardProps {
  post: Post;
}

const SearchPostCard: React.FC<SearchPostCardProps> = ({ post }) => {
  // Simplified display for search results
  // We don't distinguish between Group/User posts deeply here, distinct logic usually needed for actions.
  // So we just link to the post detail page.

  const postLink = `/post/${post._id}`;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      {/* Header */}
      <div className="mb-3 flex items-center space-x-3">
        <Link to={`/profile/${post.author.userName}`}>
          <img
            src={post.author.avatar}
            alt={post.author.fullName}
            className="h-10 w-10 rounded-full object-cover"
          />
        </Link>
        <div>
          <Link
            to={`/profile/${post.author.userName}`}
            className="font-semibold text-gray-900 hover:underline"
          >
            {post.author.fullName}
          </Link>
          <div className="flex items-center text-sm text-gray-500">
            <span>@{post.author.userName}</span>
            <SeparatorDot />
            <span>{formatPostDate(post.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <Link to={postLink} className="block">
        <p className="mb-3 line-clamp-3 text-gray-800">{post.content}</p>

        {/* Attachments Preview (Just first image if any) */}
        {post.attachments &&
          post.attachments.length > 0 &&
          post.attachments[0].type === "IMAGE" && (
            <div className="mb-3">
              <img
                src={post.attachments[0].url}
                alt="Post attachment"
                className="h-48 w-full rounded-lg object-cover"
              />
              {post.attachments.length > 1 && (
                <p className="mt-1 text-xs text-gray-500">
                  +{post.attachments.length - 1} more
                </p>
              )}
            </div>
          )}
      </Link>

      {/* Footer Stats */}
      <div className="flex items-center gap-4 text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <FaHeart className="text-gray-400" />
          <span>{post.likesCount}</span>
        </div>
        <div className="flex items-center gap-1">
          <FaRegComment className="text-gray-400" />
          <span>{post.commentsCount}</span>
        </div>
      </div>
    </div>
  );
};

export default SearchPostCard;
