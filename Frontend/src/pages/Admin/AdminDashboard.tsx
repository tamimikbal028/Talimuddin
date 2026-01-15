import React from "react";
import { useNavigate } from "react-router-dom";
// We'll add a service method for this later if needed, or use inline fetch for now as it's a new feature
// import adminService from "../../services/admin.service";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  // Placeholder content for now
  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500">Welcome to the administration panel.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800">Total Users</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">--</p>
        </div>
        {/* Add more stats placeholders */}
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          Quick Actions
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {/* Additional quick actions can go here */}
          <div className="flex flex-col gap-2 rounded-lg border bg-gray-50 p-4">
            <h3 className="font-medium text-gray-900">Classroom Management</h3>
            <p className="text-sm text-gray-500">
              Create new classrooms for verify teachers.
            </p>
            <button
              onClick={() => navigate("/classroom/createroom")}
              className="mt-2 w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              Create Room
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          User Management
        </h2>
        <p className="text-gray-500">User list table will appear here.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
