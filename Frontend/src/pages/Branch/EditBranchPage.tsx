import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCamera, FaArrowLeft, FaInfoCircle } from "react-icons/fa";
import PageLoader from "../Fallbacks/PageLoader";
import { branchHooks } from "../../hooks/useBranch";
import BranchPhotosTab from "../../components/Branch/Edit/BranchPhotosTab";
import BranchGeneralTab from "../../components/Branch/Edit/BranchGeneralTab";

type TabType = "photos" | "general";

interface Tab {
  id: TabType;
  label: string;
  icon: React.ReactNode;
}

const TABS: Tab[] = [
  { id: "photos", label: "Cover Image", icon: <FaCamera /> },
  { id: "general", label: "Basic Info", icon: <FaInfoCircle /> },
];

const EditBranchPage = () => {
  const navigate = useNavigate();
  const { data: branchData, isLoading, error } = branchHooks.useBranchDetails();
  const [activeTab, setActiveTab] = useState<TabType>("photos");

  if (isLoading) return <PageLoader />;
  if (error || !branchData) {
    return (
      <div className="animate-in fade-in zoom-in-95 flex h-[80vh] flex-col items-center justify-center gap-6 duration-500">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-500">
          <FaInfoCircle className="text-4xl" />
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-black text-gray-900">
            Branch Not Found
          </h1>
          <p className="mt-2 font-medium text-gray-500">
            The branch you're trying to manage doesn't exist or has been
            removed.
          </p>
        </div>
        <button
          onClick={() => navigate("/classroom")}
          className="mt-4 rounded-xl bg-gray-900 px-8 py-3 font-bold text-white shadow-lg shadow-gray-200 transition-all hover:bg-gray-800 active:scale-95"
        >
          Back to Branches
        </button>
      </div>
    );
  }

  const { branch, meta } = branchData.data;

  // Security: Only admin can access
  if (!meta.isBranchAdmin && !meta.isAppOwner && !meta.isAppAdmin) {
    navigate(`/classroom/branches/${branch._id}`);
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white shadow-sm">
        <div className="mx-auto max-w-4xl px-4">
          {/* Title Section */}
          <div className="flex items-center justify-between border-b border-gray-100 py-5">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(`/classroom/branches/${branch._id}`)}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-600 transition-all hover:bg-gray-200 hover:text-gray-900 active:scale-95"
                aria-label="Go back"
              >
                <FaArrowLeft className="text-base" />
              </button>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-gray-900">
                  Manage Branch
                </h1>
                <p className="text-xs font-semibold text-gray-500">
                  {branch.name}
                </p>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 py-3">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-200"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <span className="text-base">{tab.icon}</span>
                <span className="whitespace-nowrap">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mx-auto max-w-4xl px-4 pt-10">
        <div className="flex flex-col gap-8">
          {activeTab === "photos" && (
            <BranchPhotosTab coverImage={branch.coverImage} />
          )}
          {activeTab === "general" && <BranchGeneralTab branch={branch} />}
        </div>
      </div>
    </div>
  );
};

export default EditBranchPage;
