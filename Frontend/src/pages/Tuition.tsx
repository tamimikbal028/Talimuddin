import React, { useState } from "react";
import FindTutor from "../components/Tuition/FindTutor";
import BecomeTutor from "../components/Tuition/BecomeTutor";

const Tuition: React.FC = () => {
  // TODO: Get loading/error state from API
  const loading = false;
  const error: string | null = null;

  // Local UI state for role switching
  const [activeRole, setActiveRole] = useState<"student" | "tutor">("tutor");

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-lg text-gray-600">Loading tuition data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-lg text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-3 text-center">
          <h1 className="text-4xl font-bold text-gray-900">Tuition Board</h1>
          <p className="mt-2 text-lg text-gray-600">
            Connect with students and tutors for academic opportunities.
          </p>
        </div>

        {/* Role Switcher */}
        <div className="mb-3 flex justify-center">
          <div className="rounded-lg bg-white p-2 shadow-sm">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveRole("student")}
                className={`rounded-md px-6 py-3 text-sm font-medium transition-colors ${
                  activeRole === "student"
                    ? "bg-blue-600 text-white"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Find a Tutor
              </button>
              <button
                onClick={() => setActiveRole("tutor")}
                className={`rounded-md px-6 py-3 text-sm font-medium transition-colors ${
                  activeRole === "tutor"
                    ? "bg-blue-600 text-white"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Tutor Corner
              </button>
            </div>
          </div>
        </div>

        {/* Content based on active role */}
        {activeRole === "student" ? <FindTutor /> : <BecomeTutor />}
      </div>
    </div>
  );
};

export default Tuition;
