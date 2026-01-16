import React from "react";
import {
  FaEllipsisH,
  FaEdit,
  FaArchive,
  FaTrash,
  FaEyeSlash,
  FaVideo,
  FaSignOutAlt,
  FaArrowLeft,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { Room, RoomMeta } from "../../../types";
import { roomHooks } from "../../../hooks/useRoom";
import confirm from "../../../utils/sweetAlert";
import RoomDetailsNavBar from "./RoomDetailsNavBar";
import { useDropdown } from "../../../hooks/useDropdown";

interface RoomHeaderProps {
  room: Room;
  meta: RoomMeta;
}

const RoomHeader: React.FC<RoomHeaderProps> = ({ room, meta }) => {
  const navigate = useNavigate();

  const { mutate: toggleArchive, isPending: isArchiving } =
    roomHooks.useToggleArchiveRoom();
  const { mutate: deleteRoom, isPending: isDeleting } =
    roomHooks.useDeleteRoom();
  const { mutate: leaveRoom, isPending: isLeaving } = roomHooks.useLeaveRoom();
  const { mutate: hideRoom, isPending: isHiding } = roomHooks.useHideRoom();

  const {
    isOpen: showMenu,
    openUpward,
    menuRef,
    triggerRef: buttonRef,
    toggle: toggleMenu,
    close: closeMenu,
  } = useDropdown();

  const handleCopyJoinCode = async () => {
    if (meta.joinCode) {
      try {
        await navigator.clipboard.writeText(meta.joinCode);
        toast.success("Join code copied to clipboard");
      } catch (error) {
        toast.error(`Failed to copy join code: ${error}`);
      }
      closeMenu();
    }
  };

  const handleToggleArchive = async () => {
    closeMenu();
    const ok = await confirm({
      title: room.isArchived ? "Unarchive Room?" : "Archive Room?",
      text: room.isArchived
        ? "Are you sure you want to unarchive this room?"
        : "Are you sure you want to archive this room? Members won't be able to post.",
      confirmButtonText: room.isArchived ? "Yes, unarchive" : "Yes, archive",
    });

    if (ok) {
      toggleArchive(room._id);
    }
  };

  const handleDelete = async () => {
    closeMenu();
    const ok = await confirm({
      title: "Delete Room?",
      text: "Are you sure you want to delete this room? This action cannot be undone.",
      confirmButtonText: "Yes, delete",
      confirmButtonColor: "#d33",
      isDanger: true,
    });

    if (ok) {
      deleteRoom(room._id);
    }
  };

  const handleHide = async () => {
    closeMenu();
    const ok = await confirm({
      title: meta.isHidden ? "Unhide Room?" : "Hide Room?",
      text: meta.isHidden
        ? "This room will be shown in your main room list again."
        : "This room will be hidden from your room list. You can unhide it later.",
      confirmButtonText: meta.isHidden ? "Yes, unhide" : "Yes, hide",
    });

    if (ok) {
      hideRoom(room._id);
    }
  };

  const handleLeave = async () => {
    closeMenu();
    const ok = await confirm({
      title: "Leave Room?",
      text: "Are you sure you want to leave this room? You'll need the join code to rejoin.",
      confirmButtonText: "Yes, leave",
      confirmButtonColor: "#d33",
      isDanger: true,
    });

    if (ok) {
      leaveRoom(room._id);
    }
  };

  return (
    <div>
      {/* Cover Image with Back Button */}
      <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-blue-500 to-blue-700">
        <img
          src={room.coverImage}
          alt={room.name}
          className="h-full w-full object-cover"
        />

        {/* Back Button */}
        <button
          onClick={() => navigate("/classroom")}
          className="absolute top-4 left-4 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-black/70 active:scale-95"
          title="Go back to classroom"
        >
          <FaArrowLeft className="h-5 w-5" />
        </button>
      </div>

      {/* Header Content */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-5xl space-y-3 p-5">
          {/* Row 1: Name + Count (left) | Action Buttons (right) */}
          <div className="flex items-start justify-between gap-4">
            {/* Left: Name, Badges & Count */}
            <div className="flex-1">
              {/* Name & Badges */}
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-gray-900">
                  {room.name}
                </h1>
                {meta.isHidden && (
                  <span className="rounded-full bg-purple-100 px-3 py-1.5 text-sm font-semibold text-purple-700">
                    Hidden
                  </span>
                )}
                {room.isArchived && (
                  <span className="rounded-full bg-yellow-100 px-3 py-1.5 text-sm font-semibold text-yellow-700">
                    Archived
                  </span>
                )}
              </div>

              {/* Member and Post Count */}
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {/* Privacy Badge */}
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                    room.privacy === "PUBLIC"
                      ? "bg-blue-100 text-blue-700"
                      : room.privacy === "CLOSED"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {room.privacy === "PUBLIC"
                    ? "Public"
                    : room.privacy === "CLOSED"
                      ? "Closed"
                      : "Private"}
                </span>

                {/* Separator */}
                <span className="text-gray-400">•</span>

                {/* Members Count */}
                <span className="text-sm font-medium text-gray-600">
                  <span className="font-semibold text-gray-900">
                    {room.membersCount.toLocaleString()}
                  </span>{" "}
                  {room.membersCount <= 1 ? "Member" : "Members"}
                </span>

                {/* Separator */}
                <span className="text-gray-400">•</span>

                {/* Posts Count */}
                <span className="text-sm font-medium text-gray-600">
                  <span className="font-semibold text-gray-900">
                    {room.postsCount.toLocaleString()}
                  </span>{" "}
                  {room.postsCount <= 1 ? "Post" : "Posts"}
                </span>
              </div>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex items-center gap-2">
              {(meta.isCreator || meta.isAdmin) && (
                <Link
                  to={`/classroom/rooms/${room._id}/live`}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                >
                  <FaVideo className="h-4 w-4" />
                  <span>Go Live</span>
                </Link>
              )}

              {/* Join Code Display */}
              {meta.joinCode && (
                <button
                  onClick={handleCopyJoinCode}
                  className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 transition-all hover:border-blue-400 hover:bg-blue-50 hover:shadow-sm"
                  title="Click to copy join code"
                >
                  <span className="font-mono text-sm font-semibold text-gray-700">
                    {meta.joinCode}
                  </span>
                </button>
              )}

              <div
                className="relative rounded-lg border border-gray-300"
                ref={menuRef}
              >
                <button
                  ref={buttonRef}
                  onClick={toggleMenu}
                  className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-200"
                  title="More actions"
                >
                  <FaEllipsisH className="h-5 w-5" />
                </button>

                {showMenu && (
                  <div
                    className={`absolute right-0 z-50 w-56 rounded-lg border border-gray-200 bg-white shadow-lg ${
                      openUpward ? "bottom-full mb-1" : "top-full mt-1"
                    }`}
                  >
                    <div className="py-1">
                      {!meta.isCreator && !meta.isAdmin && meta.isMember && (
                        <>
                          <button
                            onClick={handleHide}
                            disabled={isHiding}
                            className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <FaEyeSlash className="h-4 w-4 flex-shrink-0" />
                            <span className="font-medium">
                              {isHiding
                                ? "Processing..."
                                : meta.isHidden
                                  ? "Unhide Room"
                                  : "Hide Room"}
                            </span>
                          </button>

                          <button
                            onClick={handleLeave}
                            disabled={isLeaving}
                            className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-red-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <FaSignOutAlt className="h-4 w-4 flex-shrink-0" />
                            <span className="font-medium">
                              {isLeaving ? "Leaving..." : "Leave Room"}
                            </span>
                          </button>
                        </>
                      )}

                      {(meta.isCreator || meta.isAdmin) && (
                        <>
                          <Link
                            to={`/classroom/rooms/${room._id}/edit`}
                            className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
                            onClick={closeMenu}
                          >
                            <FaEdit className="h-4 w-4 flex-shrink-0" />
                            <span className="font-medium">Edit Room</span>
                          </Link>

                          <button
                            onClick={handleToggleArchive}
                            disabled={isArchiving}
                            className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <FaArchive className="h-4 w-4 flex-shrink-0" />
                            <span className="font-medium">
                              {isArchiving
                                ? "Processing..."
                                : room.isArchived
                                  ? "Unarchive Room"
                                  : "Archive Room"}
                            </span>
                          </button>
                        </>
                      )}

                      {meta.isCreator && (
                        <button
                          onClick={handleDelete}
                          disabled={isDeleting}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-red-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <FaTrash className="h-4 w-4 flex-shrink-0" />
                          <span className="font-medium">
                            {isDeleting ? "Deleting..." : "Delete Room"}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Row 2: Description */}
          <div className="mt-4">
            <p
              className={
                room.description
                  ? "text-gray-700"
                  : "font-medium text-gray-500 italic"
              }
            >
              {room.description}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mx-auto max-w-5xl px-6">
          <RoomDetailsNavBar meta={meta} />
        </div>
      </div>
    </div>
  );
};

export default RoomHeader;
