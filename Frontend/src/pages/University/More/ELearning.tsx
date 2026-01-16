import React from "react";
import { FaLaptop, FaArrowLeft } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const ELearning: React.FC = () => {
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
            <div className="mr-4 inline-flex h-16 w-16 items-center justify-center rounded-lg bg-cyan-100">
              <FaLaptop className="h-8 w-8 text-cyan-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">E-Learning</h1>
              <p className="text-gray-600">Access online learning platforms</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Coming Soon
          </h2>
          <p className="leading-relaxed text-gray-600">
            This section will provide access to online learning platforms,
            virtual classrooms, and digital education resources.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ELearning;
