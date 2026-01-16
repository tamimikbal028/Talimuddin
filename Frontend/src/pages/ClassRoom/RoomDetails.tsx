import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import { roomHooks } from "../../hooks/useRoom";
import RoomHeader from "../../components/ClassRoom/details-page/RoomHeader";
import RoomPosts from "../../components/ClassRoom/details-page-tabs/RoomPosts";
import RoomMembersTab from "../../components/ClassRoom/details-page-tabs/RoomMembersTab";
import RoomAbout from "../../components/ClassRoom/details-page-tabs/RoomAbout";
import RoomFiles from "../../components/ClassRoom/details-page-tabs/RoomFiles";
import RoomRequestsTab from "../../components/ClassRoom/details-page-tabs/RoomRequestsTab";
import RoomModerationTab from "../../components/ClassRoom/details-page-tabs/RoomModerationTab";
import RoomDetailsSkeleton from "../../components/shared/skeletons/RoomDetailsSkeleton";
import { FaDoorOpen, FaLock, FaBan } from "react-icons/fa";

const RoomDetails: React.FC = () => {
  const { data: response, isLoading, error } = roomHooks.useRoomDetails();
  const { mutate: cancelRequest, isPending: isCancelling } =
    roomHooks.useCancelJoinRequest();

  const room = response?.data.room;
  const meta = response?.data.meta;

  // Loading State
  if (isLoading) {
    return <RoomDetailsSkeleton />;
  }

  // Error State or Not Found
  if (error || !room) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="max-w-md rounded-xl border-2 border-gray-200 bg-gray-50 p-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <FaDoorOpen className="h-8 w-8 text-gray-600" />
            </div>
          </div>
          <div className="mb-3 inline-block rounded-full bg-red-100 px-3 py-1">
            <span className="text-xs font-semibold text-red-700">
              ERROR: Server Failed or Room Not Found
            </span>
          </div>
          <h2 className="mb-2 text-xl font-bold text-gray-900">
            Room Not Available
          </h2>
          <p className="mb-6 text-gray-600">
            This room could not be found or the server encountered an error.
            Please try again later.
          </p>
          <Link
            to="/classroom"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            <FaDoorOpen className="h-4 w-4" />
            Back to Rooms
          </Link>
        </div>
      </div>
    );
  }

  // Room Deleted
  if (room.isDeleted) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="max-w-md rounded-xl border-2 border-red-200 bg-red-50 p-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <FaBan className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <div className="mb-3 inline-block rounded-full bg-red-100 px-3 py-1">
            <span className="text-xs font-semibold text-red-700">
              REASON: Room Deleted by Creator
            </span>
          </div>
          <h2 className="mb-2 text-xl font-bold text-gray-900">Room Deleted</h2>
          <p className="mb-6 text-gray-600">
            This room has been deleted by the creator and is no longer
            available.
          </p>
          <Link
            to="/classroom"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            <FaDoorOpen className="h-4 w-4" />
            Back to Rooms
          </Link>
        </div>
      </div>
    );
  }

  // Not a Member - Show different messages based on status
  if (!meta?.isMember) {
    // Banned
    if (meta?.isBanned) {
      return (
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="max-w-md rounded-xl border-2 border-red-200 bg-red-50 p-8 text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <FaBan className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <h2 className="mb-2 text-xl font-bold text-gray-900">
              Access Denied
            </h2>
            <p className="mb-6 text-gray-600">
              You have been banned from this room.
            </p>
            <Link
              to="/classroom"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
            >
              <FaDoorOpen className="h-4 w-4" />
              Back to Rooms
            </Link>
          </div>
        </div>
      );
    }

    // Rejected
    if (meta?.isRejected) {
      return (
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="max-w-md rounded-xl border-2 border-orange-200 bg-orange-50 p-8 text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
                <FaBan className="h-8 w-8 text-orange-600" />
              </div>
            </div>
            <h2 className="mb-2 text-xl font-bold text-gray-900">
              Request Rejected
            </h2>
            <p className="mb-6 text-gray-600">
              Your join request was rejected. Please contact the room creator
              for more information.
            </p>
            <Link
              to="/classroom"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
            >
              <FaDoorOpen className="h-4 w-4" />
              Back to Rooms
            </Link>
          </div>
        </div>
      );
    }

    // Pending Request
    if (meta?.hasPendingRequest) {
      return (
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="max-w-md rounded-xl border-2 border-yellow-200 bg-yellow-50 p-8 text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
                <FaLock className="h-8 w-8 text-yellow-600" />
              </div>
            </div>
            <h2 className="mb-2 text-xl font-bold text-gray-900">
              Request Pending
            </h2>
            <p className="mb-6 text-gray-600">
              Your join request is pending approval from the room creator or
              admin.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => cancelRequest(room._id)}
                disabled={isCancelling}
                className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-red-600 bg-white px-6 py-2.5 text-sm font-semibold text-red-600 shadow-sm transition-colors hover:bg-red-50 disabled:opacity-50"
              >
                {isCancelling ? "Cancelling..." : "Cancel Request"}
              </button>
              <Link
                to="/classroom"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-gray-700"
              >
                <FaDoorOpen className="h-4 w-4" />
                Back to Rooms
              </Link>
            </div>
          </div>
        </div>
      );
    }

    // CLOSED Room
    if (room.privacy === "CLOSED") {
      return (
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="max-w-md rounded-xl border-2 border-gray-200 bg-gray-50 p-8 text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <FaLock className="h-8 w-8 text-gray-600" />
              </div>
            </div>
            <h2 className="mb-2 text-xl font-bold text-gray-900">
              Room Closed
            </h2>
            <p className="mb-6 text-gray-600">
              This room is closed. Only invited members can join.
            </p>
            <Link
              to="/classroom"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
            >
              <FaDoorOpen className="h-4 w-4" />
              Back to Rooms
            </Link>
          </div>
        </div>
      );
    }

    // PRIVATE Room (can send join request)
    if (room.privacy === "PRIVATE") {
      return (
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="max-w-md rounded-xl border-2 border-blue-200 bg-blue-50 p-8 text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <FaLock className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <h2 className="mb-2 text-xl font-bold text-gray-900">
              Private Room
            </h2>
            <p className="mb-6 text-gray-600">
              This is a private room. You need to join with the room code to
              send a join request.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                to="/classroom/joinroom"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
              >
                Join with Code
              </Link>
              <Link
                to="/classroom"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-gray-700"
              >
                <FaDoorOpen className="h-4 w-4" />
                Back to Rooms
              </Link>
            </div>
          </div>
        </div>
      );
    }

    // PUBLIC Room (can join with code)
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="max-w-md rounded-xl border-2 border-gray-200 bg-gray-50 p-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <FaDoorOpen className="h-8 w-8 text-gray-600" />
            </div>
          </div>
          <h2 className="mb-2 text-xl font-bold text-gray-900">Not a Member</h2>
          <p className="mb-6 text-gray-600">
            You are not a member of this room. Join with the room code to
            access.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              to="/classroom/joinroom"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
            >
              Join with Code
            </Link>
            <Link
              to="/classroom"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-gray-700"
            >
              <FaDoorOpen className="h-4 w-4" />
              Back to Rooms
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Member - Show full room details
  return (
    <div className="space-y-5 overflow-hidden">
      <RoomHeader room={room} meta={meta} />

      <div className="mx-auto max-w-5xl">
        <div className="space-y-3 rounded-xl shadow">
          <Routes>
            <Route index element={<RoomPosts />} />
            <Route path="members" element={<RoomMembersTab />} />
            <Route path="files" element={<RoomFiles />} />
            <Route path="requests" element={<RoomRequestsTab />} />
            <Route path="moderation" element={<RoomModerationTab />} />
            <Route path="about" element={<RoomAbout room={room} />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;
