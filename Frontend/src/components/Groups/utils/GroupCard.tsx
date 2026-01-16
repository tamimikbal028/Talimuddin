import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUsers, FaThumbtack } from "react-icons/fa";
import {
  GROUP_MEMBERSHIP_STATUS,
  GROUP_PRIVACY,
  GROUP_TYPES,
} from "../../../constants/index";
import { groupHooks } from "../../../hooks/useGroup";
import type { GroupCardResponse } from "../../../types";

const GroupCard: React.FC<GroupCardResponse> = ({ group, meta }) => {
  const navigate = useNavigate();
  const { status, settings } = meta;

  const { mutate: joinGroup, isPending: isJoining } = groupHooks.useJoinGroup();
  const { mutate: leaveGroup, isPending: isLeaving } =
    groupHooks.useLeaveGroup();
  const { mutate: cancelJoin, isPending: isCancelling } =
    groupHooks.useCancelJoinRequest();

  const handleViewGroup = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/groups/${group.slug}`);
  };

  const handleJoin = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    joinGroup({ slug: group.slug });
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    cancelJoin({ slug: group.slug });
  };

  const handleAccept = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Accepting an invite is effectively joining the group
    joinGroup({ slug: group.slug });
  };

  const handleReject = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Rejecting an invite is effectively leaving the potential relationship
    leaveGroup({ slug: group.slug });
  };

  const isLoading = isJoining || isLeaving || isCancelling;

  return (
    <Link
      to={`/groups/${group.slug}`}
      className="cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      {/* Group Card Content */}
      <div className="relative overflow-hidden">
        <img
          src={group.avatar}
          alt={group.name}
          className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />

        {/* Status Indicators */}
        {/* Pin Indicator (Top Left) */}
        {status === GROUP_MEMBERSHIP_STATUS.JOINED && (
          <div
            className={`absolute top-3 left-3 z-10 flex h-8 w-8 items-center justify-center rounded-full shadow-sm backdrop-blur-sm transition-all ${
              settings?.isPinned
                ? "scale-110 border-2 border-white bg-blue-600 text-white shadow-blue-500/50"
                : "border border-white/20 bg-black/20 text-white/60"
            }`}
            title={settings?.isPinned ? "Pinned Group" : "Not Pinned"}
          >
            <FaThumbtack
              className={`h-4 w-4 ${settings?.isPinned ? "rotate-0" : "-rotate-45"}`}
            />
          </div>
        )}

        {/* Badges Container (Top Right) */}
        <div className="absolute top-3 right-3 z-10 flex flex-col items-end gap-2">
          {/* Privacy Badge */}
          {group.privacy === GROUP_PRIVACY.CLOSED ? (
            <div className="rounded-full bg-red-600/90 px-2.5 py-1 text-[10px] font-bold tracking-wider text-white shadow-sm backdrop-blur-sm">
              CLOSED
            </div>
          ) : group.privacy === GROUP_PRIVACY.PRIVATE ? (
            <div className="rounded-full bg-gray-900/90 px-2.5 py-1 text-[10px] font-bold tracking-wider text-white shadow-sm backdrop-blur-sm">
              PRIVATE
            </div>
          ) : (
            <div className="rounded-full bg-green-600/90 px-2.5 py-1 text-[10px] font-bold tracking-wider text-white shadow-sm backdrop-blur-sm">
              PUBLIC
            </div>
          )}

          {/* Category Badge */}
          {group.type === GROUP_TYPES.OFFICIAL_INSTITUTION ? (
            <div className="rounded-full bg-purple-600/90 px-2.5 py-1 text-[10px] font-bold tracking-wider text-white shadow-sm backdrop-blur-sm">
              OFFICIAL
            </div>
          ) : (
            group.type === GROUP_TYPES.JOBS_CAREERS && (
              <div className="rounded-full bg-cyan-600/90 px-2.5 py-1 text-[10px] font-bold tracking-wider text-white shadow-sm backdrop-blur-sm">
                CAREER
              </div>
            )
          )}
        </div>
      </div>

      {/*  */}
      <div className="p-3">
        {/* Group Name */}
        <h3 className="mb-2 text-lg font-bold text-gray-900">{group.name}</h3>

        {/* Group Members Count */}
        <div className="mb-3 flex items-center gap-2 text-sm text-gray-600">
          <FaUsers size={14} />
          <span className="font-medium">
            {group.membersCount.toLocaleString()}{" "}
            {group.membersCount === 1 ? "member" : "members"}
          </span>
        </div>

        {/* Join / Cancel / Accept / Reject - Buttons */}
        <div>
          {/* view group button */}
          {status === GROUP_MEMBERSHIP_STATUS.JOINED && (
            <button
              type="button"
              onClick={handleViewGroup}
              className="w-full rounded-lg bg-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-400"
            >
              View Group
            </button>
          )}

          {/* Join */}
          {!status && group.privacy !== GROUP_PRIVACY.CLOSED && (
            <button
              type="button"
              onClick={handleJoin}
              disabled={isLoading}
              className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
            >
              {isJoining ? "Joining..." : "Join Group"}
            </button>
          )}

          {/* Cancel Join Request */}
          {status === GROUP_MEMBERSHIP_STATUS.PENDING && (
            <button
              type="button"
              onClick={handleCancel}
              disabled={isLoading}
              className="w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-400"
            >
              {isCancelling ? "Cancelling..." : "Cancel Request"}
            </button>
          )}

          {/* Accept / Reject Invitation */}
          {status === GROUP_MEMBERSHIP_STATUS.INVITED && (
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={handleAccept}
                disabled={isLoading}
                className="w-full rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-400"
              >
                {isJoining ? "Accepting..." : "Accept"}
              </button>
              <button
                type="button"
                onClick={handleReject}
                disabled={isLoading}
                className="w-full rounded-lg bg-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-400 disabled:cursor-not-allowed disabled:bg-gray-200"
              >
                {isLeaving ? "Rejecting..." : "Reject"}
              </button>
            </div>
          )}

          {/* closed groups */}
          {group.privacy === GROUP_PRIVACY.CLOSED &&
            status !== GROUP_MEMBERSHIP_STATUS.JOINED &&
            status !== GROUP_MEMBERSHIP_STATUS.INVITED &&
            status !== GROUP_MEMBERSHIP_STATUS.PENDING && (
              <div className="mt-2 flex justify-center">
                <button
                  type="button"
                  disabled
                  className="w-full cursor-not-allowed rounded-lg bg-red-300 px-4 py-2 text-sm font-semibold text-gray-700"
                >
                  You can't join this group
                </button>
              </div>
            )}
        </div>
      </div>
    </Link>
  );
};

export default GroupCard;
