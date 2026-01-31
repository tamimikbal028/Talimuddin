import type { Post, PostMeta } from "../../../types/post.types";
import dayjs from "dayjs";
import { roomHooks } from "../../../hooks/useRoom";
import { FaCheck, FaTimes, FaTrashAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

interface RoomPendingPostCardProps {
  post: Post;
  meta: PostMeta;
  isAdminView?: boolean;
}

const RoomPendingPostCard = ({
  post,
  meta,
  isAdminView = false,
}: RoomPendingPostCardProps) => {
  const { mutate: approve, isPending: isApproving } =
    roomHooks.useApproveRoomPost();
  const { mutate: reject, isPending: isRejecting } =
    roomHooks.useRejectRoomPost();
  const { mutate: deletePost, isPending: isDeleting } =
    roomHooks.useDeleteRoomPost();

  const handleApprove = () => {
    approve(post._id);
  };

  const handleReject = () => {
    reject(post._id);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to cancel this pending post?")) {
      deletePost({ postId: post._id });
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
      {/* Author Header */}
      <div className="flex items-center justify-between border-b border-gray-50 bg-gray-50/50 p-4">
        <div className="flex items-center space-x-3">
          <Link to={`/profile/${post.author.userName}`}>
            <img
              src={post.author.avatar || "/default-avatar.png"}
              alt={post.author.fullName}
              className="h-10 w-10 cursor-pointer rounded-full object-cover ring-2 ring-white transition-all hover:ring-blue-500"
            />
          </Link>
          <div>
            <Link
              to={`/profile/${post.author.userName}`}
              className="inline-block cursor-pointer text-sm leading-tight font-bold text-gray-900 transition-colors hover:text-blue-600 hover:underline"
            >
              {post.author.fullName}
            </Link>
            <p className="text-[11px] font-medium text-gray-400">
              Submitted on{" "}
              {dayjs(post.createdAt).format("MMM D, YYYY • h:mm A")}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {isAdminView ? (
            <>
              <button
                onClick={handleApprove}
                disabled={isApproving || isRejecting}
                className="flex items-center space-x-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white transition-all hover:bg-emerald-700 disabled:opacity-50"
              >
                {isApproving ? (
                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <FaCheck className="text-[10px]" />
                )}
                <span>Approve</span>
              </button>

              <button
                onClick={handleReject}
                disabled={isApproving || isRejecting}
                className="flex items-center space-x-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 transition-all hover:bg-red-100 disabled:opacity-50"
              >
                {isRejecting ? (
                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                ) : (
                  <FaTimes className="text-[10px]" />
                )}
                <span>Reject</span>
              </button>
            </>
          ) : meta.isMine ? (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center space-x-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 transition-all hover:bg-red-100 disabled:opacity-50"
            >
              {isDeleting ? (
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
              ) : (
                <FaTrashAlt className="text-[10px]" />
              )}
              <span>Cancel Request</span>
            </button>
          ) : null}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-3">
        <div className="prose prose-sm max-w-none text-[15px] leading-relaxed whitespace-pre-wrap text-gray-800">
          {post.content}
        </div>

        {/* Attachments */}
        {post.attachments && post.attachments.length > 0 && (
          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {post.attachments.map((attach, idx) => (
              <div
                key={idx}
                className="relative aspect-video overflow-hidden rounded-xl border border-gray-100 bg-gray-50 shadow-sm"
              >
                {attach.type === "IMAGE" ? (
                  <img
                    src={attach.url}
                    alt={`Attachment ${idx}`}
                    className="h-full w-full cursor-zoom-in object-cover transition-transform hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs font-medium text-gray-500 italic">
                    {attach.type} Attachment
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-gray-50 bg-gray-50/30 px-4 py-2.5">
        <div className="flex items-center space-x-3">
          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-amber-700 uppercase ring-1 ring-amber-200">
            Pending Approval
          </span>
          <span className="text-[11px] font-semibold text-gray-500">
            Post Type: <span className="text-gray-700">{post.type}</span>
          </span>
        </div>
        {meta.isMine && !isAdminView && (
          <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-600">
            Your Post
          </span>
        )}
      </div>
    </div>
  );
};

export default RoomPendingPostCard;
