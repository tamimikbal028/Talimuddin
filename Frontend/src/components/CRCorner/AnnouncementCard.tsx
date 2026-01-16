import React from "react";
import { useNavigate } from "react-router-dom";
import { FaEllipsisH, FaEdit, FaTrash, FaFile } from "react-icons/fa";
import type { Announcement } from "./types";

interface AnnouncementCardProps {
  announcement: Announcement;
  currentUserId: string;
  isExpanded: boolean;
  isMenuOpen: boolean;
  onToggleExpanded: (id: number) => void;
  onToggleMenu: (id: number) => void;
  onToggleRead: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onDownload: (announcement: Announcement) => void;
}

export const AnnouncementCard: React.FC<AnnouncementCardProps> = ({
  announcement,
  currentUserId,
  isExpanded,
  isMenuOpen,
  onToggleExpanded,
  onToggleMenu,
  onToggleRead,
  onEdit,
  onDelete,
  onDownload,
}) => {
  const navigate = useNavigate();
  const isRead = (announcement.readBy || []).includes(currentUserId);

  return (
    <div
      className={`relative flex flex-col overflow-visible rounded-md border p-3 transition-shadow hover:shadow-sm ${
        isRead
          ? "border-gray-200 bg-gray-100 text-gray-500"
          : "border-gray-500 bg-blue-100"
      }`}
    >
      {/* 3-dot menu button */}
      <div className="absolute top-3 right-3">
        <button
          onClick={() => onToggleMenu(announcement.id)}
          className="cursor-pointer rounded-lg bg-blue-100 p-2 text-gray-600 transition-colors hover:bg-blue-50"
          aria-label="Open menu"
        >
          <FaEllipsisH className="h-4 w-4" />
        </button>

        {/* menu popup */}
        {isMenuOpen && (
          <div className="absolute top-full right-0 z-50 mt-1 w-48 rounded-lg border border-gray-200 bg-white shadow-lg">
            <div className="py-1">
              <button
                onClick={() => onEdit(announcement.id)}
                className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
              >
                <FaEdit className="h-4 w-4" />
                <span className="font-medium">Edit</span>
              </button>
              <button
                onClick={() => onDelete(announcement.id)}
                className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-red-600 transition-colors hover:bg-gray-50"
              >
                <FaTrash className="h-4 w-4" />
                <span className="font-medium">Delete</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <h4 className="mb-2 line-clamp-2 text-base font-semibold text-gray-900">
        {announcement.title}
      </h4>

      <div className="mb-3 text-sm leading-relaxed text-gray-700">
        <p
          className={`text-justify text-sm leading-relaxed text-gray-700 ${
            isExpanded ? "" : "line-clamp-3"
          }`}
        >
          {announcement.content}
        </p>

        {/* See more / See less toggle */}
        {announcement.content &&
          announcement.content.split("\n").join(" ").length > 180 && (
            <button
              onClick={() => onToggleExpanded(announcement.id)}
              className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              {isExpanded ? "See less" : "See more"}
            </button>
          )}
      </div>

      {/* File Attachments Display */}
      {announcement.hasFile && (
        <div className="mb-3 space-y-2">
          {/* New multiple files */}
          {announcement.files && announcement.files.length > 0
            ? announcement.files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between rounded bg-blue-50 px-3 py-2"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-2">
                    <FaFile className="h-4 w-4 flex-shrink-0 text-blue-600" />
                    <span className="truncate text-sm font-medium text-blue-700">
                      {file.name}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      if (file.url) {
                        const link = document.createElement("a");
                        link.href = file.url;
                        link.download = file.name;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }
                    }}
                    className="ml-2 flex-shrink-0 text-sm font-semibold text-blue-600 hover:text-blue-800"
                  >
                    Download
                  </button>
                </div>
              ))
            : /* Backward compatibility - single file */
              announcement.fileName && (
                <div className="flex items-center justify-between rounded bg-blue-50 px-3 py-2">
                  <div className="flex min-w-0 flex-1 items-center gap-2">
                    <FaFile className="h-4 w-4 flex-shrink-0 text-blue-600" />
                    <span className="truncate text-sm font-medium text-blue-700">
                      {announcement.fileName}
                    </span>
                  </div>
                  <button
                    onClick={() => onDownload(announcement)}
                    className="ml-2 flex-shrink-0 text-sm font-semibold text-blue-600 hover:text-blue-800"
                  >
                    Download
                  </button>
                </div>
              )}
        </div>
      )}

      <div className="mt-auto flex items-center justify-between text-sm text-gray-600">
        <span className="flex items-center gap-2">
          Posted by{" "}
          {announcement.postedById ? (
            <button
              onClick={() => navigate(`/profile/${announcement.postedById}`)}
              className="cursor-pointer text-sm font-medium text-gray-900 transition-colors hover:text-blue-600 hover:underline"
            >
              {announcement.postedBy}
            </button>
          ) : (
            announcement.postedBy
          )}
        </span>
        <div className="ml-2 flex items-center gap-3">
          <span className="flex-shrink-0">{announcement.date}</span>

          {/* Render mark-as-read toggle */}
          <button
            onClick={() => onToggleRead(announcement.id)}
            disabled={isRead}
            className={`cursor-pointer rounded px-2 py-0.5 text-sm font-medium transition-colors disabled:cursor-not-allowed ${
              isRead ? "bg-gray-200 text-gray-700" : "bg-red-50 text-red-700"
            }`}
          >
            {isRead ? "Marked" : "Mark as read"}
          </button>
        </div>
      </div>
    </div>
  );
};
