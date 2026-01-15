import React from "react";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
// We'll add a service method for this later if needed, or use inline fetch for now as it's a new feature
// import adminService from "../../services/admin.service";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  // Placeholder content for now
  return (
    <>
      <div className="flex justify-between rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500">Welcome to the administration panel.</p>
        </div>

        <div>
          <button
            onClick={() => navigate("/classroom/createroom")}
            className="flex items-center gap-2 rounded-lg border-2 border-dashed border-blue-300 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 transition-colors hover:border-blue-400 hover:bg-blue-100"
          >
            <FaPlus className="h-4 w-4" />
            Create Room
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
