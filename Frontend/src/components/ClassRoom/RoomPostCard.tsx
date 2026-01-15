import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  FaEllipsisH,
  FaRegComment,
  FaBookmark,
  FaRegBookmark,
  FaEdit,
  FaTrash,
  FaLink,
  FaCheckDouble,
} from "react-icons/fa";
import {
  formatPostDate,
  formatPostClock,
  formatPostDateTime,
} from "../../utils/dateUtils";
import SeparatorDot from "../shared/SeparatorDot";
import CommentItem from "../shared/CommentItem";
import CommentSkeleton from "../shared/skeletons/CommentSkeleton";
import PostContent from "../shared/PostContent";
import type { Attachment, Post, PostMeta } from "../../types";
import { authHooks } from "../../hooks/useAuth";
import { roomHooks } from "../../hooks/useRoom";
import { commentHooks } from "../../hooks/common/useComment";
import { ATTACHMENT_TYPES } from "../../constants";
import confirm from "../../utils/sweetAlert";

interface RoomPostCardProps {
  post: Post;
  meta: PostMeta;
}

const RoomPostCard: React.FC<RoomPostCardProps> = ({ post, meta }) => {
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const [commentText, setCommentText] = useState("");

  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Edit Mode States
  const [isEditing, setIsEditing] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);

  // Get current logged-in user
  const { user: currentUser } = authHooks.useUser();

  // Post hooks
  const { mutate: deletePost, isPending: isDeleting } =
    roomHooks.useDeleteRoomPost();
  const { mutate: updatePost, isPending: isUpdating } =
    roomHooks.useUpdateRoomPost();
  const { mutate: toggleReadStatus, isPending: isTogglingRead } =
    roomHooks.useToggleReadStatusRoomPost();
  const { mutate: toggleBookmark, isPending: isBookmarking } =
    roomHooks.useToggleBookmarkRoomPost();

  // Comment hooks
  const {
    data: commentsData,
    isLoading: isLoadingComments,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = commentHooks.usePostComments({
    postId: post._id,
    enabled: showCommentBox,
  });

  const { mutate: addComment, isPending: isAddingComment } =
    roomHooks.useAddRoomComment({
      postId: post._id,
    });
  const { mutate: deleteComment } = roomHooks.useDeleteRoomComment({
    postId: post._id,
  });
  const { mutate: updateComment } = commentHooks.useUpdateComment({
    postId: post._id,
  });

  const postComments =
    commentsData?.pages.flatMap((page) => page.data.comments) || [];

  const handleToggleCommentBox = () => {
    setShowCommentBox(!showCommentBox);
  };

  // Ref for textarea
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleAddComment = (
    e?: React.FormEvent | React.KeyboardEvent | React.MouseEvent
  ) => {
    if (e) e.preventDefault();
    if (!commentText.trim() || isAddingComment) return;

    addComment(
      { content: commentText },
      {
        onSuccess: () => {
          setCommentText("");
          // Reset textarea height
          if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
          }
        },
      }
    );
  };

  const handleToggleBookmark = () => {
    toggleBookmark({ postId: post._id });
    setShowMenu(false);
  };

  const handleDelete = async () => {
    setShowMenu(false);
    const isConfirmed = await confirm({
      title: "Delete Post?",
      text: "This action cannot be undone.",
      confirmButtonText: "Yes, delete it",
      icon: "warning",
    });

    if (isConfirmed) {
      deletePost({ postId: post._id });
    }
  };

  const handleCopyLink = async () => {
    try {
      const link = `${window.location.origin}/post/${post._id}`;
      await navigator.clipboard.writeText(link);
      toast.success("Post link copied to clipboard");
      setShowMenu(false);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleUpdatePost = (data: {
    content: string;
    tags: string[];
    visibility: string;
  }) => {
    updatePost(
      { postId: post._id, data },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      }
    );
  };

  const images = post.attachments.filter(
    (attachment: Attachment) => attachment.type === ATTACHMENT_TYPES.IMAGE
  );

  return (
    <div className="rounded border border-gray-400 bg-white shadow">
      {/* Post Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <Link to={`/profile/${post.author.userName}`}>
            <img
              src={post.author.avatar}
              alt={post.author.fullName}
              className="h-10 w-10 rounded-full bg-gray-300 object-cover"
            />
          </Link>
          <div>
            <Link
              to={`/profile/${post.author.userName}`}
              className="font-semibold text-gray-900 hover:underline"
            >
              {post.author.fullName}
            </Link>
            <p className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
              <span>{formatPostDate(post.createdAt)}</span>
              <SeparatorDot ariaHidden />
              <span>{formatPostClock(post.createdAt)}</span>
              {post.isEdited && post.editedAt && (
                <>
                  <SeparatorDot ariaHidden />
                  <span className="text-gray-400 italic">
                    Edited {formatPostDateTime(post.editedAt)}
                  </span>
                </>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Reply button */}
          <button
            onClick={handleToggleCommentBox}
            className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
              showCommentBox
                ? "border-blue-500 bg-blue-50 text-blue-600"
                : "border-gray-300 text-gray-600 hover:border-blue-400 hover:bg-gray-50"
            }`}
          >
            <FaRegComment className="h-4 w-4" />
            <span>Reply</span>
          </button>

          <button
            onClick={() => toggleReadStatus({ postId: post._id })}
            disabled={isTogglingRead}
            className={`flex h-9 items-center gap-2 rounded-lg px-3 transition-colors hover:bg-gray-200 disabled:opacity-50 ${
              meta.isRead ? "text-blue-600" : "text-gray-500"
            }`}
            title={meta.isRead ? "Mark as unread" : "Mark as read"}
          >
            <FaCheckDouble className="h-4 w-4" />
            <span className="text-sm font-medium">
              {meta.isRead ? "Read" : "Mark as read"}
            </span>
          </button>

          <div className="relative" ref={menuRef}>
            <button
              ref={buttonRef}
              onClick={() => {
                if (!showMenu && buttonRef.current) {
                  const rect = buttonRef.current.getBoundingClientRect();
                  const spaceBelow = window.innerHeight - rect.bottom;
                  setOpenUpward(spaceBelow < 300);
                }
                setShowMenu(!showMenu);
              }}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-gray-200"
              title="More actions"
            >
              <FaEllipsisH className="h-4 w-4" />
            </button>

            {showMenu && (
              <div
                className={`absolute right-0 z-50 w-56 rounded-lg border border-gray-200 bg-white shadow-lg ${
                  openUpward ? "bottom-full mb-1" : "top-full mt-1"
                }`}
              >
                <div className="py-1">
                  {/* save/unsave button */}
                  <button
                    onClick={handleToggleBookmark}
                    disabled={isBookmarking}
                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-gray-50 disabled:opacity-50 ${
                      meta.isSaved ? "text-blue-600" : "text-gray-700"
                    }`}
                  >
                    {meta.isSaved ? (
                      <>
                        <FaBookmark className="h-4 w-4 flex-shrink-0" />
                        <span className="font-medium">Remove from saved</span>
                      </>
                    ) : (
                      <>
                        <FaRegBookmark className="h-4 w-4 flex-shrink-0" />
                        <span className="font-medium">Save post</span>
                      </>
                    )}
                  </button>
                  {/* copy link button */}
                  <button
                    onClick={handleCopyLink}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    <FaLink className="h-4 w-4 flex-shrink-0" />
                    <span className="font-medium">Copy link</span>
                  </button>

                  {meta.isMine && (
                    <>
                      {/* edit button */}
                      <button
                        onClick={() => {
                          setShowMenu(false);
                          setIsEditing(true);
                        }}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
                      >
                        <FaEdit className="h-4 w-4 flex-shrink-0" />
                        <span className="font-medium">Edit post</span>
                      </button>
                    </>
                  )}

                  {(meta.canDelete || meta.isMine) && (
                    <>
                      {/* delete button */}
                      <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-red-600 transition-colors hover:bg-gray-50 disabled:opacity-50"
                      >
                        <FaTrash className="h-4 w-4 flex-shrink-0" />
                        <span className="font-medium">
                          {isDeleting ? "Deleting..." : "Delete post"}
                        </span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="px-4 pb-3">
        <PostContent
          content={post.content}
          tags={post.tags}
          visibility={post.visibility}
          isEditing={isEditing}
          isUpdating={isUpdating}
          onUpdate={handleUpdatePost}
          onCancel={() => setIsEditing(false)}
          allowedVisibilities={["CONNECTIONS", "ONLY_ME"]}
        />

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-3">
            <div className="flex flex-wrap gap-2">
              {(showAllTags || isEditing
                ? post.tags
                : post.tags.slice(0, 5)
              ).map((tag, index) => (
                <span
                  key={index}
                  className="inline-block cursor-pointer rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100"
                >
                  #{tag}
                </span>
              ))}
              {/* Show "See more" if truncated */}
              {!isEditing && !showAllTags && post.tags.length > 5 && (
                <button
                  onClick={() => setShowAllTags(true)}
                  className="inline-block cursor-pointer rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200 hover:underline"
                >
                  +{post.tags.length - 5} more
                </button>
              )}
              {/* Show "See less" if expanded */}
              {!isEditing && showAllTags && post.tags.length > 5 && (
                <button
                  onClick={() => setShowAllTags(false)}
                  className="inline-block cursor-pointer rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200 hover:underline"
                >
                  Show less
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Post Images */}
      {images && images.length > 0 && (
        <div className="px-4 pb-3">
          {images.length === 1 ? (
            <img
              src={images[0].url}
              alt="Post content"
              className="h-auto max-h-96 w-full rounded-lg object-cover"
            />
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {images.slice(0, 4).map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image.url}
                    alt={`Post content ${index + 1}`}
                    className="h-48 w-full rounded-lg object-cover"
                  />
                  {index === 3 && images.length > 4 && (
                    <div className="bg-opacity-50 absolute inset-0 flex items-center justify-center rounded-lg bg-black">
                      <span className="text-lg font-semibold text-white">
                        +{images.length - 4}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Comments Section & Input - Show only when reply button is clicked */}
      {showCommentBox && (
        <div className="border-t border-gray-100">
          {/* Loading State */}
          {isLoadingComments && (
            <div className="space-y-1 px-2.5 py-2">
              <CommentSkeleton />
              <CommentSkeleton />
              <CommentSkeleton />
            </div>
          )}

          {/* Comments List - Scrollable */}
          {!isLoadingComments && postComments.length > 0 && (
            <div className="px-2.5 py-2">
              <div className="max-h-[400px] space-y-1 overflow-y-auto">
                {/* Display all comments - Newest first */}
                {postComments.map((item) => (
                  <CommentItem
                    key={item.comment._id}
                    comment={item.comment}
                    meta={item.meta}
                    currentUserId={currentUser?._id}
                    onDeleteComment={(commentId) => deleteComment(commentId)}
                    onUpdateComment={(commentId, content) =>
                      updateComment({ commentId, content })
                    }
                    hideLike={true}
                  />
                ))}
                {/* Load More Button */}
                {hasNextPage && (
                  <button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="w-full rounded-lg border border-blue-600 p-2 text-center text-sm font-medium text-blue-600 transition-colors hover:bg-blue-600 hover:text-white disabled:opacity-50"
                  >
                    {isFetchingNextPage
                      ? "Loading more..."
                      : "Load more comments"}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Create Comment Input */}
          <div className="border-t border-gray-100 p-4">
            {currentUser?.restrictions.isCommentBlocked ? (
              <div className="rounded-lg bg-red-50 p-3 text-center text-sm text-red-600">
                You are restricted from commenting.
                {currentUser.restrictions.commentRestriction?.reason && (
                  <span className="block text-xs text-red-500">
                    Reason: {currentUser.restrictions.commentRestriction.reason}
                  </span>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <img
                  src={currentUser?.avatar}
                  alt="Your avatar"
                  className="h-8 w-8 rounded-full bg-gray-300 object-cover"
                />
                <textarea
                  ref={textareaRef}
                  value={commentText}
                  onChange={(e) => {
                    setCommentText(e.target.value);
                    // Auto-resize
                    e.target.style.height = "auto";
                    e.target.style.height = e.target.scrollHeight + "px";
                  }}
                  placeholder="Write a comment (max 1000 chars)..."
                  className="max-h-32 flex-1 resize-none overflow-y-auto rounded-xl border border-gray-300 px-3 py-2 text-sm font-medium focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  rows={1}
                  style={{ minHeight: "38px" }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleAddComment(e);
                    }
                  }}
                  maxLength={1000}
                />
                <button
                  onClick={handleAddComment}
                  disabled={!commentText.trim() || isAddingComment}
                  className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isAddingComment ? "Sending..." : "Send"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomPostCard;
