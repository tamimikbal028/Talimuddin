import React from "react";
import { FaGraduationCap, FaArrowLeft } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const FacultyDirectory: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl">
        {/* Back Button */}
        <NavLink
          to=".."
          className="mb-6 inline-flex items-center text-blue-600 transition-colors hover:text-blue-800"
        >
          <FaArrowLeft className="mr-2 h-4 w-4" />
          Back to More
        </NavLink>

        {/* Header */}
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="mb-4 flex items-center">
            <div className="mr-4 inline-flex h-16 w-16 items-center justify-center rounded-lg bg-teal-100">
              <FaGraduationCap className="h-8 w-8 text-teal-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Faculty Directory
              </h1>
              <p className="text-gray-600">Find faculty contact information</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Coming Soon
          </h2>
          <p className="leading-relaxed text-gray-600">
            This section will contain faculty directory, contact information,
            office hours, and department details.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FacultyDirectory;
