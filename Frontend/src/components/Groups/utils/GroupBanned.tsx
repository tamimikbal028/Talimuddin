import React from "react";
import { FaBan, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import type { Group } from "../../../types/group.types";

interface GroupBannedProps {
  group: Group;
}

const GroupBanned: React.FC<GroupBannedProps> = ({ group }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-5 overflow-hidden">
      {/* Cover Image Area with Ban Icon */}
      <div className="relative">
        <div className="relative h-64 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300">
          <div className="absolute top-[88px] left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-red-50">
              <div className="absolute h-full w-full animate-ping rounded-full bg-red-100 opacity-20"></div>
              <FaBan className="relative z-10 text-4xl text-red-500" />
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-4">
          <div className="relative -mt-20">
            <div className="rounded-2xl bg-white p-6 shadow-lg">
              <div className="flex flex-col items-center gap-6 text-center">
                {/* Banned Message */}
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    You are Banned
                  </h1>
                  <p className="mt-2 text-gray-600">
                    You have been banned from{" "}
                    <span className="font-semibold">{group.name}</span>
                  </p>
                  <p className="mt-1 text-gray-500">
                    You cannot view or interact with this group's content.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex flex-wrap justify-center gap-3">
                  <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 rounded-lg bg-gray-900 px-6 py-2.5 font-semibold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <FaArrowLeft className="text-sm" />
                    Go Back
                  </button>

                  <button
                    onClick={() => navigate("/groups/suggested")}
                    className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 font-semibold text-gray-700 transition-colors hover:bg-gray-100"
                  >
                    Explore Other Groups
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupBanned;
