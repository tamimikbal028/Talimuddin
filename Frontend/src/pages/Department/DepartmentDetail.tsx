import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDepartmentHeader } from "../../hooks/useDepartment";
import DepartmentHeader from "../../components/Department/DepartmentHeader";
import DepartmentFeed from "../../components/Department/tabs/DepartmentFeed";
import DepartmentAbout from "../../components/Department/tabs/DepartmentAbout";

const DepartmentDetail: React.FC = () => {
  const {
    data: headerResponse,
    isLoading: isLoadingHeader,
    error: headerError,
  } = useDepartmentHeader();
  const department = headerResponse?.data?.department;
  const meta = headerResponse?.data?.meta;

  if (isLoadingHeader) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (headerError || !department || !meta) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-20 text-center">
        <div className="mb-4 rounded-full bg-red-50 p-6 text-red-500">
          <svg
            className="h-12 w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          Department Not Found
        </h2>
        <p className="mt-2 text-gray-500">
          The department you are looking for does not exist or has been
          deactivated.
        </p>
        <button
          onClick={() => window.history.back()}
          className="mt-6 rounded-lg bg-blue-600 px-6 py-2.5 font-semibold text-white transition hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-5">
      <DepartmentHeader department={department} meta={meta} />

      <div>
        <Routes>
          <Route index element={<DepartmentFeed />} />
          <Route path="about" element={<DepartmentAbout />} />
          <Route path="*" element={<Navigate to="" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default DepartmentDetail;
