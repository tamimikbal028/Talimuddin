import React from "react";
import {
  FaGlobe,
  FaLock,
  FaUserFriends,
  FaCalendarAlt,
  FaUsers,
  FaFileAlt,
  FaInfoCircle,
  FaShieldAlt,
  FaChartBar,
} from "react-icons/fa";
import type { Group } from "../../types";

const GroupAboutTab: React.FC<{ group: Group }> = ({ group }) => {
  const getPrivacyInfo = () => {
    switch (group.privacy) {
      case "public":
        return {
          icon: FaGlobe,
          label: "Public Group",
          description: "Anyone can see who's in the group and what they post.",
          color: "text-green-600",
          bgColor: "bg-green-50",
        };
      case "private":
        return {
          icon: FaLock,
          label: "Private Group",
          description:
            "Only members can see who's in the group and what they post.",
          color: "text-red-600",
          bgColor: "bg-red-50",
        };
      default:
        return {
          icon: FaUserFriends,
          label: "Closed Group",
          description:
            "Anyone can find this group but only members can see posts.",
          color: "text-yellow-600",
          bgColor: "bg-yellow-50",
        };
    }
  };

  const privacyInfo = getPrivacyInfo();
  const PrivacyIcon = privacyInfo.icon;

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
          <FaInfoCircle className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Group Details</h1>
          <p className="text-gray-500">Learn more about this Group</p>
        </div>
      </div>

      {/* Description Card */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <FaFileAlt className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">About</h2>
        </div>
        <p className="leading-relaxed text-gray-700">{group.description}</p>
      </div>

      {/* Privacy Card */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <FaShieldAlt className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Privacy</h2>
        </div>
        <div
          className={`flex items-start gap-4 rounded-lg ${privacyInfo.bgColor} p-4`}
        >
          <div
            className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white ${privacyInfo.color}`}
          >
            <PrivacyIcon className="h-5 w-5" />
          </div>
          <div>
            <h3 className={`font-semibold ${privacyInfo.color}`}>
              {privacyInfo.label}
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              {privacyInfo.description}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Card */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <FaChartBar className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Statistics</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-4 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600">
              <FaUsers className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {group.membersCount.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Members</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-lg bg-gradient-to-r from-purple-50 to-purple-100 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-600">
              <FaFileAlt className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {group.postsCount.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Posts</p>
            </div>
          </div>
        </div>
      </div>

      {/* History Card */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <FaCalendarAlt className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">History</h2>
        </div>
        <div className="flex items-center gap-4 rounded-lg bg-gray-50 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
            <FaCalendarAlt className="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">Group Created</p>
            <p className="text-sm text-gray-600">
              {formatDate(group.createdAt)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupAboutTab;
