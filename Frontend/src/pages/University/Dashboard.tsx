import React from "react";
import { NavLink } from "react-router-dom";

const UniversityDashboard: React.FC = () => {
  return (
    <div className="space-y-3 rounded-lg bg-white p-5 shadow-sm">
      <h2 className="text-2xl font-bold text-gray-900">
        Institution Dashboard
      </h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg bg-blue-50 p-4 text-center">
          <div className="text-3xl font-bold text-blue-700">3.8</div>
          <div className="text-gray-600">CGPA</div>
        </div>
        <div className="rounded-lg bg-green-50 p-4 text-center">
          <div className="text-3xl font-bold text-green-700">5</div>
          <div className="text-gray-600">Upcoming Events</div>
        </div>
        <div className="rounded-lg bg-yellow-50 p-4 text-center">
          <div className="text-3xl font-bold text-yellow-700">2</div>
          <div className="text-gray-600">Pending Assignments</div>
        </div>
      </div>
      <div>
        <h3 className="mb-2 text-lg font-semibold">Quick Shortcuts</h3>
        <div className="flex gap-4">
          <NavLink
            to="../notices"
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Notice Board
          </NavLink>
          <NavLink
            to="../events"
            className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
          >
            Events
          </NavLink>
        </div>
      </div>
      <div>
        <h3 className="mb-2 text-lg font-semibold">Upcoming Events</h3>
        <ul className="ml-6 list-disc text-gray-700">
          <li>Midterm Exam - 10 Oct 2025</li>
          <li>Science Fair - 15 Oct 2025</li>
          <li>Semester Registration - 20 Oct 2025</li>
        </ul>
      </div>
    </div>
  );
};

export default UniversityDashboard;
