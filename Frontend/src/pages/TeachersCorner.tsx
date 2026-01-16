import React from "react";
import {
  FaChalkboardTeacher,
  FaBook,
  FaCalendarAlt,
  FaUsers,
  FaFileAlt,
} from "react-icons/fa";

const TeachersCorner: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-teal-600">
            <FaChalkboardTeacher className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Teachers' Corner
            </h1>
            <p className="text-sm text-gray-500">
              Resources, schedules, and tools for faculty members
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Course Materials */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-4">
            <div className="flex items-center gap-3">
              <FaBook className="h-5 w-5 text-green-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Course Materials
              </h2>
            </div>
          </div>
          <div className="p-4">
            <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-gray-200 bg-gray-50 p-8 text-center">
              <FaBook className="h-10 w-10 text-gray-300" />
              <div>
                <p className="font-medium text-gray-600">
                  No materials uploaded yet
                </p>
                <p className="mt-1 text-sm text-gray-400">
                  Upload course materials, lecture notes, and resources
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Class Schedule */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-4">
            <div className="flex items-center gap-3">
              <FaCalendarAlt className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Class Schedule
              </h2>
            </div>
          </div>
          <div className="p-4">
            <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-gray-200 bg-gray-50 p-8 text-center">
              <FaCalendarAlt className="h-10 w-10 text-gray-300" />
              <div>
                <p className="font-medium text-gray-600">No schedule set</p>
                <p className="mt-1 text-sm text-gray-400">
                  Your class schedule will appear here
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Student Management */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-4">
            <div className="flex items-center gap-3">
              <FaUsers className="h-5 w-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Student Management
              </h2>
            </div>
          </div>
          <div className="p-4">
            <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-gray-200 bg-gray-50 p-8 text-center">
              <FaUsers className="h-10 w-10 text-gray-300" />
              <div>
                <p className="font-medium text-gray-600">
                  No students assigned
                </p>
                <p className="mt-1 text-sm text-gray-400">
                  Manage your students and their progress
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Assignments & Exams */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-4">
            <div className="flex items-center gap-3">
              <FaFileAlt className="h-5 w-5 text-orange-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Assignments & Exams
              </h2>
            </div>
          </div>
          <div className="p-4">
            <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-gray-200 bg-gray-50 p-8 text-center">
              <FaFileAlt className="h-10 w-10 text-gray-300" />
              <div>
                <p className="font-medium text-gray-600">
                  No assignments created
                </p>
                <p className="mt-1 text-sm text-gray-400">
                  Create and manage assignments and exams
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeachersCorner;
