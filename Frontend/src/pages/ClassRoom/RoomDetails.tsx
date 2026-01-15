import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { roomHooks } from "../../hooks/useRoom";
import RoomHeader from "../../components/ClassRoom/details-page/RoomHeader";
import RoomPosts from "../../components/ClassRoom/room-tabs-inside/RoomPosts";
import RoomMembersTab from "../../components/ClassRoom/room-tabs-inside/RoomMembersTab";
import RoomAbout from "../../components/ClassRoom/room-tabs-inside/RoomAbout";
import RoomFiles from "../../components/ClassRoom/room-tabs-inside/RoomFiles";

const RoomDetails: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const { data: response, isLoading, error } = roomHooks.useRoomDetails(roomId);

  const room = response?.data?.room;
  const meta = response?.data?.meta;

  // Loading State
  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
        <p className="text-gray-600">Loading room details...</p>
      </div>
    );
  }

  // Error State or Not Found
  if (error || !room || !meta) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900">Room Not Found</h2>
        <p className="mt-2 text-gray-600">
          The room you're looking for doesn't exist or has been removed.
        </p>
        <div className="mt-4">
          <Link to="/classroom" className="text-blue-600 hover:underline">
            Back to Rooms
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 overflow-hidden">
      <RoomHeader room={room} meta={meta} />

      <div className="mx-auto max-w-5xl">
        <div className="space-y-3 rounded-xl shadow">
          <Routes>
            <Route index element={<RoomPosts />} />
            <Route path="members" element={<RoomMembersTab />} />
            <Route path="files" element={<RoomFiles />} />
            <Route path="about" element={<RoomAbout room={room} />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;
