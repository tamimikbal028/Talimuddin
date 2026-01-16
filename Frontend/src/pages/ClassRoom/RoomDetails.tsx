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
import { FaDoorOpen } from "react-icons/fa";

const RoomDetails: React.FC = () => {
  const { data: response, isLoading, error } = roomHooks.useRoomDetails();

  if (isLoading) {
    return <RoomDetailsSkeleton />;
  }

  if (error || !response) {
    return (
      <div className="flex flex-col items-center justify-center gap-5 rounded-xl border-2 border-gray-200 bg-gray-50 py-5">
        <span className="font-semibold text-red-700">
          {error?.message || "Room Not Available"}
        </span>
        <Link
          to="/classroom"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
        >
          <FaDoorOpen className="h-4 w-4" />
          Back to Rooms
        </Link>
      </div>
    );
  }

  const room = response.data.room;
  const meta = response.data.meta;

  if (!meta.hasAccess) {
    return (
      <div className="space-y-5">
        <RoomHeader room={room} meta={meta} />
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-5 rounded-2xl border border-gray-200 bg-white p-5 text-center shadow-sm">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">
              You are not a member of this room.
            </h2>
          </div>
          <Link
            to="/classroom"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-blue-200"
          >
            Back to Classroom
          </Link>
        </div>
      </div>
    );
  }

  // Member or Authorized - Show full room details
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
