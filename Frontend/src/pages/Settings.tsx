import React from "react";
import { FaSignOutAlt } from "react-icons/fa";
import AccountSettings from "../components/Settings/AccountSettings";
import PrivacySettings from "../components/Settings/PrivacySettings";
import NotificationSettings from "../components/Settings/NotificationSettings";
import AppearanceSettings from "../components/Settings/AppearanceSettings";
import SupportSettings from "../components/Settings/SupportSettings";

const Settings: React.FC = () => {
  const handleSignOut = () => {
    console.log("Signing out...");
    // In a real app, this would handle sign out logic
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
        <AppearanceSettings />
        <SupportSettings />

        {/* Logout Section */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <button
            onClick={handleSignOut}
            className="flex items-center space-x-3 text-red-600 transition-colors hover:text-red-700"
          >
            <FaSignOutAlt />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Settings;
