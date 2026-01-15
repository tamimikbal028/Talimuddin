import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "../components/ClassRoom/Header";
import Rooms from "../components/ClassRoom/Tabs/Rooms";
import PageLoader from "./Fallbacks/PageLoader";

// Lazy load pages
const RoomDetails = lazy(() => import("./ClassRoom/RoomDetails"));
const CreateRoomPage = lazy(() => import("./ClassRoom/CreateRoomPage"));
const JoinRoomPage = lazy(() => import("./ClassRoom/JoinRoomPage"));
const EditRoomPage = lazy(() => import("./ClassRoom/EditRoomPage"));

const ClassRoom: React.FC = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* All Rooms - Default */}
        <Route
          index
          element={
            <>
              <Header />
              <Rooms type="all" />
            </>
          }
        />

        {/* My Rooms */}
        <Route
          path="my"
          element={
            <>
              <Header />
              <Rooms type="my" />
            </>
          }
        />

        {/* Standalone Routes (No Header) */}
        <Route path="createroom" element={<CreateRoomPage />} />
        <Route path="joinroom" element={<JoinRoomPage />} />
        <Route path="rooms/:roomId/edit" element={<EditRoomPage />} />
        <Route path="rooms/:roomId/*" element={<RoomDetails />} />
      </Routes>
    </Suspense>
  );
};

export default ClassRoom;
