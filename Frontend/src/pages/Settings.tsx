import React from "react";
import { FaSignOutAlt } from "react-icons/fa";
import AccountSettings from "../components/Settings/AccountSettings";
import PrivacySettings from "../components/Settings/PrivacySettings";
import NotificationSettings from "../components/Settings/NotificationSettings";
import { authHooks } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { mutate: logout, isPending } = authHooks.useLogout();

  const handleSignOut = () => {
    logout(undefined, {
      onSuccess: () => {
        toast.success("Logged out successfully");
        navigate("/login");
      },
      onError: () => {
        toast.error("Failed to logout");
      },
    });
  };

  return (
    <>
      {/* Header */}
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="space-y-6">
        <AccountSettings />
        <PrivacySettings />
        <NotificationSettings />

        {/* Logout Section */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <button
            onClick={handleSignOut}
            disabled={isPending}
            className="flex items-center space-x-3 text-red-600 transition-colors hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FaSignOutAlt />
            <span className="font-medium">
              {isPending ? "Signing out..." : "Sign Out"}
            </span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Settings;
