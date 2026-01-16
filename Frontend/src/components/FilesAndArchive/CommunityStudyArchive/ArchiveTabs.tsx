import React from "react";
import { FaUserTie, FaUsers, FaUserFriends } from "react-icons/fa";

type ArchiveTab = "official" | "seniors" | "classmates";

interface ArchiveTabsProps {
  activeArchiveTab: ArchiveTab;
  setActiveArchiveTab: (tab: ArchiveTab) => void;
}

const ArchiveTabs: React.FC<ArchiveTabsProps> = ({
  activeArchiveTab,
  setActiveArchiveTab,
}) => {
  const getArchiveTabInfo = (tab: string) => {
    switch (tab) {
      case "official":
        return {
          icon: <FaUserTie className="text-red-600" />,
          title: "Official Senior Archive",
          description: "Verified content from seniors",
          count: "15 resources",
        };
      case "seniors":
        return {
          icon: <FaUsers className="text-green-600" />,
          title: "Seniors' Personal Files",
          description: "Informal sharing from seniors",
          count: "28 resources",
        };
      case "classmates":
        return {
          icon: <FaUserFriends className="text-blue-600" />,
          title: "Classmates' Personal Files",
          description: "Peer-to-peer sharing",
          count: "12 resources",
        };
      default:
        return { icon: null, title: "", description: "", count: "" };
    }
  };

  return (
    <div className="flex justify-between rounded-lg border border-gray-200 bg-white">
      {(["official", "seniors", "classmates"] as ArchiveTab[]).map((tab) => {
        const tabInfo = getArchiveTabInfo(tab);
        return (
          <button
            key={tab}
            onClick={() => setActiveArchiveTab(tab)}
            className={`rounded-lg border cursor-pointer px-3 py-4 transition-colors ${
              activeArchiveTab === tab
                ? "border-blue-600 bg-blue-50"
                : "border-transparent hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-3">
              {tabInfo.icon}
              <h3
                className={`font-medium ${
                  activeArchiveTab === tab ? "text-blue-900" : "text-gray-900"
                }`}
              >
                {tabInfo.title}
              </h3>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default ArchiveTabs;
