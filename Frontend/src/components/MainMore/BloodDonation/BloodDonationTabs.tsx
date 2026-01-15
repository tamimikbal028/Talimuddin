import React from "react";
import { FaExclamationCircle, FaUser, FaUsers } from "react-icons/fa";

interface BloodDonationTabsProps {
  activeTab: "requests" | "donors" | "donorList";
  onTabChange: (tab: "requests" | "donors" | "donorList") => void;
  requestsCount?: number;
  donorsCount?: number;
}

const BloodDonationTabs: React.FC<BloodDonationTabsProps> = ({
  activeTab,
  onTabChange,
  requestsCount = 0,
  donorsCount = 0,
}) => {
  return (
    <div className="flex gap-2 rounded-lg border border-gray-200 bg-white p-2 shadow-sm">
      <button
        onClick={() => onTabChange("requests")}
        className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-3 font-semibold transition-colors ${
          activeTab === "requests"
            ? "bg-red-600 text-white"
            : "text-gray-600 hover:bg-gray-100"
        }`}
      >
        <FaExclamationCircle />
        Blood Requests ({requestsCount})
      </button>
      <button
        onClick={() => onTabChange("donors")}
        className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-3 font-semibold transition-colors ${
          activeTab === "donors"
            ? "bg-red-600 text-white"
            : "text-gray-600 hover:bg-gray-100"
        }`}
      >
        <FaUser />
        Find Donors ({donorsCount})
      </button>
      <button
        onClick={() => onTabChange("donorList")}
        className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-3 font-semibold transition-colors ${
          activeTab === "donorList"
            ? "bg-red-600 text-white"
            : "text-gray-600 hover:bg-gray-100"
        }`}
      >
        <FaUsers />
        Donor List ({donorsCount})
      </button>
    </div>
  );
};

export default BloodDonationTabs;
