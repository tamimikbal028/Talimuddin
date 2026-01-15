import React from "react";
import { useNavigate } from "react-router-dom";

const ProfileNotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
      <h2 className="text-2xl font-bold text-gray-900">User Not Found</h2>
      <p className="mt-2 text-gray-600">
        The user you're looking for doesn't exist.
      </p>
      <button
        onClick={() => navigate("/")}
        className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Go Home
      </button>
    </div>
  );
};

export default ProfileNotFound;
