import React, { useState } from "react";
import { FaFolder, FaUsers } from "react-icons/fa";
import PersonalFiles from "../components/FilesAndArchive/PersonalFiles";
import CommunityStudyArchive from "../components/FilesAndArchive/CommunityStudyArchive";

const FilesAndArchive: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"personal" | "community">(
    "personal"
  );

  const tabs: {
    id: "personal" | "community";
    label: string;
    Icon: React.ElementType;
  }[] = [
    { id: "personal", label: "My Personal Files", Icon: FaFolder },
    { id: "community", label: "Community Study Archive", Icon: FaUsers },
  ];

  return (
    <>
      {/* Tab Navigation */}
      <div className="flex justify-evenly rounded-2xl border border-gray-300 bg-gray-50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 border-b-3 px-5 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:border-gray-500 hover:text-gray-700"
            }`}
          >
            <tab.Icon className="text-lg" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="w-full">
        {activeTab === "personal" && <PersonalFiles />}
        {activeTab === "community" && <CommunityStudyArchive />}
      </div>
    </>
  );
};

export default FilesAndArchive;
