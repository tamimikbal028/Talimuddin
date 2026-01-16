import React, { Suspense, lazy } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import Header from "../components/ClassRoom/Header";
import Rooms from "../components/ClassRoom/Tabs/Rooms";
import PageLoader from "./Fallbacks/PageLoader";

// Lazy load pages
const RoomDetails = lazy(() => import("./ClassRoom/RoomDetails"));
const RoomLive = lazy(() => import("./ClassRoom/RoomLive"));
const CreateRoomPage = lazy(() => import("./ClassRoom/CreateRoomPage"));
const JoinRoomPage = lazy(() => import("./ClassRoom/JoinRoomPage"));
const EditRoomPage = lazy(() => import("./ClassRoom/EditRoomPage"));

const AllRooms = lazy(() => import("../components/ClassRoom/Tabs/AllRooms"));

const ClassRoomLayout: React.FC = () => {
  return (
    <div className="max-w-7xl space-y-5">
      <Header />
      <Outlet />
    </div>
  );
};

const ClassRoom: React.FC = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<ClassRoomLayout />}>
          <Route index element={<Rooms />} />
          <Route path="all" element={<AllRooms />} />
        </Route>

        {/* Standalone Routes (No Header/Tabs) */}
        <Route path="createroom" element={<CreateRoomPage />} />
        <Route path="joinroom" element={<JoinRoomPage />} />
        <Route path="rooms/:roomId/edit" element={<EditRoomPage />} />
        <Route path="rooms/:roomId/*" element={<RoomDetails />} />
        <Route path="rooms/:roomId/live" element={<RoomLive />} />
      </Routes>
    </Suspense>
  );
};

export default ClassRoom;
