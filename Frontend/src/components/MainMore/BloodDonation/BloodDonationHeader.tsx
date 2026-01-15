import React from "react";
import { FaTint } from "react-icons/fa";
import { IoPerson } from "react-icons/io5";
import { bloodGroupStats } from "../data/bloodDonationData";

const BloodDonationHeader: React.FC = () => {
  return (
    <div className="space-y-3 rounded-xl border border-gray-200 bg-red-50 p-3 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600">
              <FaTint className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Blood Donation Portal
              </h1>
              <p className="text-sm font-medium text-red-800">
                Every drop counts. Every donor is a hero.
              </p>
            </div>
          </div>
        </div>
        <button className="rounded-lg bg-red-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-red-700">
          Register as Donor
        </button>
      </div>

      {/* Blood Group Stats */}
      <div className="grid grid-cols-4 gap-3 md:grid-cols-8">
        {Object.entries(bloodGroupStats).map(([group, count]) => (
          <div
            key={group}
            className="rounded-lg border border-red-200 bg-white p-3 text-center shadow-sm"
          >
            <div className="mb-1 text-2xl font-bold text-red-600">{group}</div>
            <div className="flex items-center justify-center gap-1.5">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100">
                <IoPerson className="text-xs text-red-900" />
              </div>
              <span className="text-sm font-semibold text-gray-700">
                {count}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BloodDonationHeader;
