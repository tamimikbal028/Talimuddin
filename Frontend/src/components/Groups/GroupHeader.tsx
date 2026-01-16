import React from "react";
import {
  FaEllipsisH,
  FaCog,
  FaLink,
  FaUserSlash,
  FaCheck,
  FaBell,
  FaBellSlash,
  FaRss,
  FaTrash,
  FaEdit,
  FaThumbtack,
  FaArrowLeft,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { confirm } from "../../utils/sweetAlert";
import type { Group, GroupMeta } from "../../types";
import { GROUP_MEMBERSHIP_STATUS, GROUP_PRIVACY } from "../../constants";
import { groupHooks } from "../../hooks/useGroup";
import { useDropdown } from "../../hooks/useDropdown";

interface GroupHeaderProps {
  group: Group;
  meta: GroupMeta;
}

const GroupHeader: React.FC<GroupHeaderProps> = ({ group, meta }) => {
  const navigate = useNavigate();
  const {
    isOpen: showMenu,
    openUpward,
    menuRef,
    triggerRef: buttonRef,
    toggle: toggleMenu,
    close: closeMenu,
  } = useDropdown();

  const { mutate: joinGroup, isPending: isJoining } = groupHooks.useJoinGroup();
  const { mutate: leaveGroup, isPending: isLeaving } =
    groupHooks.useLeaveGroup();
  const { mutate: deleteGroup, isPending: isDeleting } =
    groupHooks.useDeleteGroup();
  const { mutate: cancelJoinRequest, isPending: isCancelling } =
    groupHooks.useCancelJoinRequest();
  const { mutate: updateSettings, isPending: isUpdatingSettings } =
    groupHooks.useUpdateMemberSettings();

  const handleJoin = () => {
    joinGroup({ slug: group.slug });
  };

  const handleLeave = async () => {
    closeMenu();
    const ok = await confirm({
      title: "Leave Group?",
      text: "Are you sure you want to leave this group?",
      confirmButtonText: "Yes, leave",
    });

    if (ok) {
      if (group?._id) {
        leaveGroup({ slug: group.slug });
      }
    }
  };

  const handleDelete = async () => {
    closeMenu();
    const ok = await confirm({
      title: "Delete Group?",
      text: "Are you sure you want to delete this group? This action cannot be undone.",
      confirmButtonText: "Yes, delete",
      confirmButtonColor: "#d33",
      isDanger: true,
    });

    if (ok) {
      deleteGroup({ slug: group.slug });
    }
  };

  const handleCancelJoin = () => {
    cancelJoinRequest({ slug: group.slug });
  };

  const handleCopyLink = async () => {
    const slug = group.slug;
    const url = `${window.location.origin}/groups/${slug}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Group link copied to clipboard");
    } catch (error) {
      toast.error(`Failed to copy link: ${error}`);
    }
    closeMenu();
  };

  const { isAdmin, isOwner, status } = meta;

  return (
    <div className="relative">
      {/* Cover Image with Back Button */}
      <div className="relative">
        <img
          src={group.coverImage}
          alt={group.name}
          className="h-64 w-full object-cover"
        />

        {/* Back Button */}
        <button
          onClick={() => navigate("/groups")}
          className="absolute top-4 left-4 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-black/70 active:scale-95"
          title="Go back to groups"
        >
          <FaArrowLeft className="h-5 w-5" />
        </button>
      </div>

      <div className="mx-auto max-w-5xl px-4">
        <div className="relative -mt-20">
          <div className="rounded-2xl bg-white p-6 shadow-lg">
            <div className="flex flex-col items-start gap-6 md:flex-row">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <img
                  src={group.avatar}
                  alt={group.name}
                  className="h-32 w-32 rounded-2xl object-cover shadow-xl"
                />
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      {group.name}
                    </h1>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      {/* Privacy Badge */}
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                          group.privacy === GROUP_PRIVACY.PUBLIC
                            ? "bg-blue-100 text-blue-700"
                            : group.privacy === GROUP_PRIVACY.CLOSED
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {group.privacy === GROUP_PRIVACY.PUBLIC
                          ? "Public"
                          : group.privacy === GROUP_PRIVACY.CLOSED
                            ? "Closed"
                            : "Private"}
                      </span>

                      {/* Separator */}
                      <span className="text-gray-400">•</span>

                      {/* Members Count */}
                      <span className="text-sm font-medium text-gray-600">
                        <span className="font-semibold text-gray-900">
                          {group.membersCount.toLocaleString()}
                        </span>{" "}
                        {group.membersCount <= 1 ? "Member" : "Members"}
                      </span>

                      {/* Separator */}
                      <span className="text-gray-400">•</span>

                      {/* Posts Count */}
                      <span className="text-sm font-medium text-gray-600">
                        <span className="font-semibold text-gray-900">
                          {group.postsCount.toLocaleString()}
                        </span>{" "}
                        {group.postsCount <= 1 ? "Post" : "Posts"}
                      </span>
                    </div>
                  </div>

                  {/* 3-dot menu */}
                  <div className="relative" ref={menuRef}>
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
                          {isAdmin && isOwner && (
                            <Link
                              to={`/groups/${group.slug}/edit`}
                              className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
                            >
                              <FaCog className="h-4 w-4 flex-shrink-0" />
                              <span className="font-medium">
                                Group Settings
                              </span>
                            </Link>
                          )}
                          <button
                            onClick={handleCopyLink}
                            className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
                          >
                            <FaLink className="h-4 w-4 flex-shrink-0" />
                            <span className="font-medium">Copy Group Link</span>
                          </button>

                          {status === GROUP_MEMBERSHIP_STATUS.JOINED && (
                            <>
                              <button
                                onClick={() =>
                                  updateSettings({
                                    settings: {
                                      isFollowing: !meta.settings?.isFollowing,
                                    },
                                  })
                                }
                                disabled={isUpdatingSettings}
                                className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
                              >
                                <FaRss className="h-4 w-4 flex-shrink-0" />
                                <span className="font-medium">
                                  {meta.settings?.isFollowing
                                    ? "Unfollow Group"
                                    : "Follow Group"}
                                </span>
                              </button>

                              <button
                                onClick={() =>
                                  updateSettings({
                                    settings: {
                                      isMuted: !meta.settings?.isMuted,
                                    },
                                  })
                                }
                                disabled={isUpdatingSettings}
                                className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
                              >
                                {meta.settings?.isMuted ? (
                                  <>
                                    <FaBell className="h-4 w-4 flex-shrink-0" />
                                    <span className="font-medium">
                                      Turn on Notifications
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <FaBellSlash className="h-4 w-4 flex-shrink-0" />
                                    <span className="font-medium">
                                      Mute Notifications
                                    </span>
                                  </>
                                )}
                              </button>

                              <button
                                onClick={() =>
                                  updateSettings({
                                    settings: {
                                      isPinned: !meta.settings?.isPinned,
                                    },
                                  })
                                }
                                disabled={isUpdatingSettings}
                                className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
                              >
                                <FaThumbtack
                                  className={`h-4 w-4 flex-shrink-0 ${
                                    meta.settings?.isPinned
                                      ? "text-blue-600"
                                      : ""
                                  }`}
                                />
                                <span className="font-medium">
                                  {meta.settings?.isPinned
                                    ? "Unpin Group"
                                    : "Pin Group"}
                                </span>
                              </button>
                            </>
                          )}

                          {status === GROUP_MEMBERSHIP_STATUS.JOINED &&
                            !isOwner && (
                              <button
                                onClick={handleLeave}
                                disabled={isLeaving}
                                className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-red-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <FaUserSlash className="h-4 w-4 flex-shrink-0" />
                                <span className="font-medium">
                                  {isLeaving ? "Leaving..." : "Leave Group"}
                                </span>
                              </button>
                            )}

                          {isOwner && (
                            <button
                              onClick={handleDelete}
                              disabled={isDeleting}
                              className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-red-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <FaTrash className="h-4 w-4 flex-shrink-0" />
                              <span className="font-medium">
                                {isDeleting ? "Deleting..." : "Delete Group"}
                              </span>
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <p className="mt-4 text-gray-700">{group.description}</p>

                {/* Action Buttons */}
                <div className="mt-6 flex flex-wrap gap-3">
                  {!status && (
                    <button
                      onClick={handleJoin}
                      disabled={isJoining}
                      className="rounded-lg bg-blue-600 px-6 py-2.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isJoining ? "Joining..." : "Join Group"}
                    </button>
                  )}

                  {status === GROUP_MEMBERSHIP_STATUS.PENDING && (
                    <button
                      onClick={handleCancelJoin}
                      disabled={isCancelling}
                      className="rounded-lg bg-red-600 px-6 py-2.5 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isCancelling ? "Cancelling..." : "Cancel Request"}
                    </button>
                  )}

                  {status === GROUP_MEMBERSHIP_STATUS.JOINED && (
                    <div className="flex items-center gap-2 rounded-lg bg-gray-200 px-6 py-2.5 font-semibold text-gray-700">
                      <FaCheck /> Joined
                    </div>
                  )}

                  {(isOwner || isAdmin) && (
                    <Link
                      to={`/groups/${group.slug}/edit`}
                      className="flex cursor-pointer items-center gap-2 rounded-lg bg-gray-100 px-6 py-2.5 font-semibold text-gray-700 transition hover:bg-gray-200"
                    >
                      <FaEdit className="h-4 w-4" />
                      Edit Group
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupHeader;
