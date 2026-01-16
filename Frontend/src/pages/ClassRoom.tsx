import React, { Suspense, lazy } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import Header from "../components/ClassRoom/Header";
import ClassRoomNavBar from "../components/ClassRoom/ClassRoomNavBar";
import Rooms from "../components/ClassRoom/Tabs/Rooms";
import HiddenRooms from "../components/ClassRoom/Tabs/HiddenRooms";
import ArchivedRooms from "../components/ClassRoom/Tabs/ArchivedRooms";
import MoreTab from "../components/ClassRoom/Tabs/MoreTab";
import PageLoader from "./Fallbacks/PageLoader";

// Lazy load pages
const RoomDetails = lazy(() => import("./ClassRoom/RoomDetails"));
const RoomLive = lazy(() => import("./ClassRoom/RoomLive"));
const CreateRoomPage = lazy(() => import("./ClassRoom/CreateRoomPage"));
const JoinRoomPage = lazy(() => import("./ClassRoom/JoinRoomPage"));
const EditRoomPage = lazy(() => import("./ClassRoom/EditRoomPage"));

const ClassRoomLayout: React.FC = () => {
  return (
    <>
      <Header />
      <ClassRoomNavBar />
      <Outlet />
    </>
  );
};

const ClassRoom: React.FC = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<ClassRoomLayout />}>
          <Route index element={<Rooms />} />
          <Route path="hidden" element={<HiddenRooms />} />
          <Route path="archived" element={<ArchivedRooms />} />
          <Route path="more" element={<MoreTab />} />
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
