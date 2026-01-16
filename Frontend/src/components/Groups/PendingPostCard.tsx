import React from "react";
import type { Post, PostMeta } from "../../types/post.types";
import dayjs from "dayjs";
import { groupHooks } from "../../hooks/useGroup";
import { FaCheck, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";

interface PendingPostCardProps {
  post: Post;
  meta: PostMeta;
}

const PendingPostCard: React.FC<PendingPostCardProps> = ({ post }) => {
  const { mutate: approve, isPending: isApproving } =
    groupHooks.useApprovePost();
  const { mutate: reject, isPending: isRejecting } = groupHooks.useRejectPost();

  const handleApprove = () => {
    approve(post._id);
  };

  const handleReject = () => {
    reject(post._id);
  };

  return (
    <div className="border border-gray-500 bg-white">
      {/* Author Header */}
      <div className="flex items-center justify-between border-b border-gray-50 bg-gray-50/30 p-3">
        <div className="flex items-center space-x-3">
          <Link to={`/profile/${post.author.userName}`}>
            <img
              src={post.author.avatar}
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
            className="flex items-center space-x-1.5 rounded-lg bg-red-100 px-3 py-1.5 text-xs font-bold text-red-600 transition-all hover:bg-red-200 disabled:opacity-50"
          >
            {isRejecting ? (
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
            ) : (
              <FaTimes className="text-[10px]" />
            )}
            <span>Reject</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-3 py-2">
        <div className="prose prose-sm max-w-none whitespace-pre-wrap text-gray-700">
          {post.content}
        </div>

        {/* Attachments */}
        {post.attachments && post.attachments.length > 0 && (
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {post.attachments.map((attach, idx) => (
              <div
                key={idx}
                className="relative aspect-video overflow-hidden rounded-lg border border-gray-100 shadow-sm"
              >
                {attach.type === "IMAGE" ? (
                  <img
                    src={attach.url}
                    alt={`Attachment ${idx}`}
                    className="h-full w-full cursor-zoom-in object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-50 text-xs font-medium text-gray-500 italic">
                    {attach.type} Attachment
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer / Meta info */}
      <div className="flex items-center justify-start space-x-4 border-t border-gray-50 bg-gray-50/50 px-3 py-2">
        <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-amber-600 uppercase">
          Review Required
        </span>
        <span className="text-[10px] font-semibold text-gray-500">
          Type: {post.type}
        </span>
      </div>
    </div>
  );
};

export default PendingPostCard;
