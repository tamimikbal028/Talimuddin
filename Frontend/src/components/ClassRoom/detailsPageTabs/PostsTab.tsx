import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BsThreeDots } from "react-icons/bs";
import { formatPostDate, formatPostClock } from "../../../utils/dateUtils";
import SeparatorDot from "../../shared/SeparatorDot";
import { showPostMenu } from "../../../utils/customModals";

// TODO: Replace with API types
type RoomPost = {
  id: string;
  roomId: string;
  authorId: string;
  content: string;
  createdAt: string;
  pinned?: boolean;
  replies: {
    id: string;
    authorId: string;
    content: string;
    createdAt: string;
  }[];
  attachments?: { id: string; fileName: string; url: string }[];
};

type UserData = {
  id: string;
  name: string;
  avatar?: string;
};

interface Props {
  roomId: string;
  posts: RoomPost[];
  users: UserData[];
  showReplyFor: Record<string, boolean>;
  replyText: Record<string, string>;
  toggleReply: (postId: string) => void;
  setReplyText: (
    updater: (r: Record<string, string>) => Record<string, string>
  ) => void;
  submitReply: (postId: string) => void;
  currentUserId?: string;
  creatorId?: string;
  admins?: string[];
  onEditPost?: (postId: string, content: string) => void;
  onDeletePost?: (postId: string) => void;
  onTogglePin?: (postId: string) => void;
  onEditReply?: (postId: string, replyId: string, content: string) => void;
  onDeleteReply?: (postId: string, replyId: string) => void;
}

const PostsTab: React.FC<Props> = ({
  roomId,
  posts,
  users,
  showReplyFor,
  replyText,
  toggleReply,
  setReplyText,
  submitReply,
  currentUserId,
  creatorId,
  admins,
  onEditPost,
  onDeletePost,
  onTogglePin,
  onEditReply,
  onDeleteReply,
}) => {
  const [postEditingId, setPostEditingId] = useState<string | null>(null);
  const [replyEditing, setReplyEditing] = useState<{
    postId: string;
    replyId: string;
  } | null>(null);
  const [postEditText, setPostEditText] = useState<Record<string, string>>({});
  const [replyEditText, setReplyEditText] = useState<Record<string, string>>(
    {}
  );

  const [expandedPosts, setExpandedPosts] = useState<Record<string, boolean>>(
    {}
  );

  const REPLIES_SHOWN = 3;

  const toggleExpand = (postId: string) =>
    setExpandedPosts((s) => ({ ...s, [postId]: !s[postId] }));

  const handlePostMenu = async (post: RoomPost) => {
    const isCreator = !!currentUserId && currentUserId === creatorId;
    const isAdmin = !!currentUserId && !!admins?.includes(currentUserId);
    const isAuthor = !!currentUserId && currentUserId === post.authorId;

    const canEdit = isAuthor;
    const canPin = isCreator || isAdmin;
    const canDelete = isAuthor || isCreator; // Only author or creator can delete

    await showPostMenu({
      onEdit: canEdit
        ? () => {
            setPostEditingId(post.id);
            setPostEditText((s) => ({ ...s, [post.id]: post.content }));
          }
        : undefined,
      onPin:
        canPin && !post.pinned
          ? () => {
              // TODO: Replace with API call
              onTogglePin?.(post.id);
            }
          : undefined,
      onUnpin:
        canPin && post.pinned
          ? () => {
              // TODO: Replace with API call
              onTogglePin?.(post.id);
            }
          : undefined,
      onDelete: canDelete
        ? () => {
            // TODO: Replace with API call
            onDeletePost?.(post.id);
          }
        : undefined,
    });
  };

  const roomPosts = posts
    .filter((p) => p.roomId === roomId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  if (roomPosts.length === 0)
    return (
      <div className="flex items-center justify-center rounded-lg border border-gray-200 bg-white p-8">
        <div className="max-w-md text-center">
          <h3 className="text-lg font-semibold text-gray-900">No posts yet</h3>
          <p className="mt-2 text-sm text-gray-500">
            This room doesn't have any posts yet.
          </p>
        </div>
      </div>
    );

  return (
    <div className="space-y-4">
      {roomPosts.map((p) => {
        const author = users.find((u) => u.id === p.authorId);
        return (
          <div
            key={p.id}
            className="max-w-full overflow-hidden rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <Link to={`/profile/${author?.id}`}>
                <img
                  src={author?.avatar}
                  alt={author?.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
              </Link>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">
                      <Link
                        to={`/profile/${author?.id}`}
                        className="cursor-pointer transition-colors hover:text-blue-600 hover:underline"
                      >
                        {author?.name || "Unknown"}
                      </Link>
                    </div>
                    <p className="flex items-center gap-2 text-sm text-gray-500">
                      <span>{formatPostDate(p.createdAt)}</span>
                      <SeparatorDot ariaHidden />
                      <span>{formatPostClock(p.createdAt)}</span>
                      <SeparatorDot ariaHidden />
                      <button
                        onClick={() => toggleReply(p.id)}
                        className="cursor-pointer text-sm font-medium text-blue-600 hover:underline"
                      >
                        Reply
                      </button>
                    </p>
                  </div>

                  <div className="relative">
                    <button
                      onClick={() => handlePostMenu(p)}
                      className="p-1 text-gray-500 hover:text-gray-800"
                      aria-label="Post menu"
                    >
                      <BsThreeDots className="h-5 w-5 cursor-pointer" />
                    </button>
                  </div>
                </div>
                {postEditingId === p.id ? (
                  <div className="mt-2">
                    <textarea
                      className="w-full rounded border border-gray-200 p-2 text-sm"
                      rows={4}
                      value={postEditText[p.id] ?? p.content}
                      onChange={(e) =>
                        setPostEditText((s) => ({
                          ...s,
                          [p.id]: e.target.value,
                        }))
                      }
                    />
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => {
                          const text = (postEditText[p.id] ?? p.content).trim();
                          if (text)
                            // TODO: Replace with API call
                            onEditPost?.(p.id, text);
                          setPostEditingId(null);
                        }}
                        className="rounded bg-blue-600 px-3 py-1 text-sm font-medium text-white"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setPostEditingId(null)}
                        className="rounded border border-gray-300 px-3 py-1 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="mt-2 text-justify break-words whitespace-pre-wrap text-gray-700">
                    {p.content}
                  </p>
                )}

                {p.attachments && p.attachments.length > 0 && (
                  <div className="mt-3">
                    {/* show image attachments as thumbnails, other files as list */}
                    {(() => {
                      const images = p.attachments.filter((a) =>
                        (a.mimeType || "").startsWith("image/")
                      );
                      const others = p.attachments.filter(
                        (a) => !(a.mimeType || "").startsWith("image/")
                      );
                      return (
                        <div className="space-y-2">
                          {images.length > 0 && (
                            <div
                              className={`grid gap-2 ${images.length === 1 ? "grid-cols-1" : images.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}
                            >
                              {images.map((a) => (
                                <a
                                  key={a.id}
                                  href={a.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="overflow-hidden rounded bg-gray-100"
                                >
                                  <img
                                    src={a.url}
                                    alt={a.fileName}
                                    className="h-36 w-full object-cover"
                                  />
                                </a>
                              ))}
                            </div>
                          )}

                          {others.length > 0 && (
                            <div className="space-y-2">
                              {others.map((a) => (
                                <div
                                  key={a.id}
                                  className="flex items-center justify-between rounded border border-gray-100 bg-gray-50 p-2 text-sm"
                                >
                                  <div className="truncate text-gray-800">
                                    {a.fileName}
                                  </div>
                                  <div className="flex items-center gap-3">
                                    {a.url ? (
                                      <a
                                        href={a.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-blue-600 hover:underline"
                                      >
                                        View
                                      </a>
                                    ) : null}
                                    {a.url ? (
                                      <a
                                        download={a.fileName}
                                        href={a.url}
                                        className="text-gray-600 hover:text-gray-800"
                                      >
                                        Download
                                      </a>
                                    ) : null}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                )}

                {showReplyFor[p.id] && (
                  <div className="mt-2">
                    <textarea
                      value={replyText[p.id] || ""}
                      onChange={(e) =>
                        setReplyText((r) => ({ ...r, [p.id]: e.target.value }))
                      }
                      className="w-full rounded border border-gray-200 p-2 text-sm"
                      rows={3}
                    />
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => submitReply(p.id)}
                        className="rounded bg-blue-600 px-3 py-1 text-sm font-medium text-white"
                      >
                        Reply
                      </button>
                      <button
                        onClick={() => toggleReply(p.id)}
                        className="rounded border border-gray-300 px-3 py-1 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {(p.replies?.length ?? 0) > 0 &&
                  (() => {
                    const replies = p.replies || [];
                    const total = replies.length;
                    const isExpanded = !!expandedPosts[p.id];
                    const visible = isExpanded
                      ? replies
                      : replies.slice(0, REPLIES_SHOWN);

                    return (
                      <div className="mt-4 space-y-3">
                        {visible.map((r) => {
                          const rauthor = users.find(
                            (u) => u.id === r.authorId
                          );
                          const isReplyAuthor =
                            !!currentUserId && currentUserId === r.authorId;
                          const isCreator =
                            !!currentUserId && currentUserId === creatorId;
                          const canEditReply = isReplyAuthor; // Only author can edit
                          const canDeleteReply = isReplyAuthor || isCreator; // Author or creator can delete
                          return (
                            <div key={r.id} className="flex items-start gap-3">
                              <img
                                src={rauthor?.avatar}
                                alt={rauthor?.name}
                                className="h-8 w-8 rounded-full object-cover"
                              />
                              <div className="relative flex-1">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className="font-semibold text-gray-900">
                                      {rauthor ? (
                                        <Link
                                          to={`/profile/${rauthor.id}`}
                                          className="cursor-pointer transition-colors hover:text-blue-600 hover:underline"
                                        >
                                          {rauthor.name}
                                        </Link>
                                      ) : r.authorId === currentUserId ? (
                                        "You"
                                      ) : (
                                        "Unknown"
                                      )}
                                    </div>
                                    <div className="mt-1 flex items-center space-x-2 text-xs text-gray-400">
                                      <span>{formatPostDate(r.createdAt)}</span>
                                      <SeparatorDot ariaHidden />
                                      <span>
                                        {formatPostClock(r.createdAt)}
                                      </span>

                                      {(canEditReply || canDeleteReply) && (
                                        <>
                                          <SeparatorDot ariaHidden />
                                          {canEditReply && (
                                            <button
                                              onClick={() => {
                                                setReplyEditing({
                                                  postId: p.id,
                                                  replyId: r.id,
                                                });
                                                setReplyEditText((s) => ({
                                                  ...s,
                                                  [r.id]: r.content,
                                                }));
                                              }}
                                              className="cursor-pointer text-sm font-medium text-blue-600 hover:underline"
                                            >
                                              Edit
                                            </button>
                                          )}
                                          {canDeleteReply && (
                                            <button
                                              onClick={() => {
                                                // TODO: Replace with API call
                                                onDeleteReply?.(p.id, r.id);
                                              }}
                                              className="cursor-pointer text-sm font-medium text-red-600 hover:underline"
                                            >
                                              Delete
                                            </button>
                                          )}
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                {replyEditing &&
                                replyEditing.postId === p.id &&
                                replyEditing.replyId === r.id ? (
                                  <div className="mt-1">
                                    <textarea
                                      className="w-full rounded border border-gray-200 p-2 text-sm"
                                      rows={3}
                                      value={replyEditText[r.id] ?? r.content}
                                      onChange={(e) =>
                                        setReplyEditText((s) => ({
                                          ...s,
                                          [r.id]: e.target.value,
                                        }))
                                      }
                                    />
                                    <div className="mt-2 flex gap-2">
                                      <button
                                        onClick={() => {
                                          const text = (
                                            replyEditText[r.id] ?? r.content
                                          ).trim();
                                          if (text)
                                            // TODO: Replace with API call
                                            onEditReply?.(p.id, r.id, text);
                                          setReplyEditing(null);
                                        }}
                                        className="rounded bg-blue-600 px-3 py-1 text-sm font-medium text-white"
                                      >
                                        Save
                                      </button>
                                      <button
                                        onClick={() => setReplyEditing(null)}
                                        className="rounded border border-gray-300 px-3 py-1 text-sm"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div>
                                    <p className="mt-1 text-justify text-sm break-words whitespace-pre-wrap text-gray-700">
                                      {r.content}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}

                        {total > REPLIES_SHOWN && (
                          <div className="mt-1">
                            {!isExpanded ? (
                              <button
                                onClick={() => toggleExpand(p.id)}
                                className="text-sm font-medium text-gray-600 hover:underline"
                              >
                                View {total - REPLIES_SHOWN} more repl
                                {total - REPLIES_SHOWN === 1 ? "y" : "ies"}
                              </button>
                            ) : (
                              <button
                                onClick={() => toggleExpand(p.id)}
                                className="text-sm font-medium text-gray-600 hover:underline"
                              >
                                Hide replies
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })()}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PostsTab;
