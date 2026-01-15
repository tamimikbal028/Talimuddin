import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatPostDateTime } from "../../utils/dateUtils";
import { confirmDelete } from "../../utils/sweetAlert";
import SeparatorDot from "./SeparatorDot";
import type { CommentItemProps } from "../../types";

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  meta,
  currentUserId = "",
  onLikeComment,
  onDeleteComment,
  onUpdateComment,
  hideLike = false, // Default false - show like button
}) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isExpanded, setIsExpanded] = useState(false);

  // Check if current user can delete/edit this comment
  const isOwner = meta.isMine || currentUserId === comment.author._id;
  const canDelete = isOwner;
  const canEdit = isOwner;

  const isLiked = meta.isLiked;
  const likesCount = comment.likesCount;
  const isLongContent =
    comment.content.length > 300 || comment.content.split("\n").length > 5;

  const handleProfileClick = () => {
    navigate(`/profile/${comment.author.userName}`);
  };

  const handleDelete = async () => {
    const result = await confirmDelete("this comment");

    if (result) {
      onDeleteComment?.(comment._id);
    }
  };

  const handleUpdate = () => {
    if (editContent.trim() !== comment.content) {
      onUpdateComment?.(comment._id, editContent);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditContent(comment.content);
    setIsEditing(false);
  };

  return (
    <div className="flex gap-3 py-1">
      {/* Avatar */}
      <div
        className="h-8 w-8 flex-shrink-0 cursor-pointer overflow-hidden rounded-full object-cover"
        onClick={handleProfileClick}
      >
        <img
          src={comment.author.avatar}
          alt={comment.author.fullName}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className="rounded-lg bg-gray-100 px-3 py-2">
          <div className="flex items-center gap-2">
            <span
              className="cursor-pointer text-sm font-semibold text-gray-900 hover:underline"
              onClick={handleProfileClick}
            >
              {comment.author.fullName}
            </span>
            {/* Post time */}
            <span className="text-xs text-gray-500">
              {formatPostDateTime(comment.createdAt)}
            </span>
          </div>

          {isEditing ? (
            <div className="mt-2">
              <div className="relative">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  rows={3}
                  autoFocus
                  maxLength={1000}
                />
              </div>
              <div className="mt-2 flex justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCancelEdit}
                    className="rounded px-2 py-1 text-xs font-medium text-red-500 hover:bg-red-50 hover:text-red-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdate}
                    className="rounded bg-blue-600 px-2 py-1 text-xs font-medium text-white hover:bg-blue-700"
                    disabled={!editContent.trim()}
                  >
                    Save
                  </button>
                </div>
                <span className="text-xs font-medium text-gray-700">
                  {editContent.length}/1000
                </span>
              </div>
            </div>
          ) : (
            <div>
              <div
                className={`mt-2 text-sm whitespace-pre-wrap text-gray-800 ${
                  !isExpanded ? "line-clamp-5" : ""
                }`}
              >
                {comment.content}
              </div>
              {isLongContent && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="mt-1 cursor-pointer text-xs font-medium text-blue-500 hover:text-blue-700 hover:underline"
                >
                  {isExpanded ? "See less" : "See more"}
                </button>
              )}
            </div>
          )}
        </div>

        {!isEditing && (
          <div className="mt-1 ml-1 flex items-center gap-4 text-xs font-semibold text-gray-500">
            {!hideLike && (
              <button
                onClick={() => onLikeComment?.(comment._id)}
                className={`transition-colors hover:text-blue-600 ${
                  isLiked ? "text-blue-600" : ""
                }`}
              >
                Like{likesCount > 0 ? ` (${likesCount})` : ""}
              </button>
            )}

            {canEdit && (
              <button
                onClick={() => setIsEditing(true)}
                className="transition-colors hover:text-blue-600"
              >
                Edit
              </button>
            )}

            {canDelete && (
              <button
                onClick={handleDelete}
                className="transition-colors hover:text-red-600"
              >
                Delete
              </button>
            )}

            {comment.isEdited && comment.editedAt && (
              <>
                <SeparatorDot />
                <span className="text-xs text-gray-400 italic">Edited </span>
                <SeparatorDot />
                <span className="text-xs text-gray-400 italic">
                  {formatPostDateTime(comment.editedAt)}
                </span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentItem;
