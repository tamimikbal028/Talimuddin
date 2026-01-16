import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import {
  FriendsHeader,
  FriendsTabs,
  FriendsList,
  FriendRequests,
  FriendSuggestions,
  SentRequests,
} from "../components/Friends";

const Friends: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <FriendsHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <FriendsTabs />
      <Routes>
        <Route index element={<FriendsList />} />
        <Route path="requests" element={<FriendRequests />} />
        <Route path="suggestions" element={<FriendSuggestions />} />
        <Route path="sent" element={<SentRequests />} />
        {/* Redirect unknown sub-routes to main list */}
        <Route path="*" element={<Navigate to="." replace />} />
      </Routes>
    </>
  );
};

export default Friends;
