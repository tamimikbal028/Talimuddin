import React from "react";
import { useNavigate } from "react-router-dom";

const EditDepartmentPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-lg">
        <div className="mb-4 text-6xl">🚧</div>
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Coming Soon</h1>
        <p className="mb-6 text-gray-600">
          Department editing functionality is under development.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="rounded-lg bg-blue-600 px-6 py-2.5 font-semibold text-white transition hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default EditDepartmentPage;
