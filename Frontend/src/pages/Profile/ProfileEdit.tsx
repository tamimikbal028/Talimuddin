import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCamera, FaUser, FaGraduationCap, FaArrowLeft } from "react-icons/fa";

import PageLoader from "../Fallbacks/PageLoader";
import { authHooks } from "../../hooks/useAuth";
import {
  PhotosTab,
  GeneralTab,
  AcademicTab,
} from "../../components/ProfileEdit";

// ====================================
// TAB TYPES
// ====================================

type TabType = "photos" | "general" | "academic";

interface Tab {
  id: TabType;
  label: string;
  icon: React.ReactNode;
}

const TABS: Tab[] = [
  { id: "photos", label: "Photos", icon: <FaCamera /> },
  { id: "general", label: "General", icon: <FaUser /> },
  { id: "academic", label: "Academic", icon: <FaGraduationCap /> },
];

// ====================================
// COMPONENT
// ====================================

const ProfileEdit: React.FC = () => {
  const navigate = useNavigate();
  const { user, isCheckingAuth } = authHooks.useUser();
  const [activeTab, setActiveTab] = useState<TabType>("photos");

  // Loading state
  if (isCheckingAuth || !user) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="mx-auto max-w-4xl px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100"
                aria-label="Go back"
              >
                <FaArrowLeft className="text-xl" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
                  activeTab === tab.id
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mx-auto max-w-4xl px-4 pt-6">
        {activeTab === "photos" && (
          <PhotosTab avatar={user.avatar} coverImage={user.coverImage} />
        )}

        {activeTab === "general" && <GeneralTab user={user} />}

        {activeTab === "academic" && <AcademicTab user={user} />}
      </div>
    </div>
  );
};

export default ProfileEdit;


