import React from "react";
import { FaUniversity, FaIdCard, FaTint } from "react-icons/fa";

// TODO: Replace with API data
interface Donor {
  id: string;
  name: string;
  avatar?: string;
  bloodGroup: string;
  department?: string;
  studentId?: string;
  totalDonations: number;
  lastDonation?: string;
  availability: string;
}

interface FindDonorsTabProps {
  donors?: Donor[];
}

const FindDonorsTab: React.FC<FindDonorsTabProps> = ({ donors = [] }) => {
  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "Available":
        return "bg-green-100 text-green-800";
      case "Recently Donated":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">
        Available Blood Donors
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {donors.map((donor) => (
          <div
            key={donor.id}
            className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="mb-3 flex items-start gap-3">
              <img
                src={donor.avatar}
                alt={donor.name}
                className="h-16 w-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{donor.name}</h3>
                <div className="mt-1 flex items-center gap-2">
                  <span className="rounded-full bg-red-600 px-2 py-0.5 text-sm font-bold text-white">
                    {donor.bloodGroup}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${getAvailabilityColor(
                      donor.availability
                    )}`}
                  >
                    {donor.availability}
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-3 space-y-1.5 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <FaUniversity className="text-gray-500" />
                <span>{donor.department}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaIdCard className="text-gray-500" />
                <span>{donor.studentId}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaTint className="text-gray-500" />
                <span>Total Donations: {donor.totalDonations}</span>
              </div>
              {donor.lastDonation && (
                <div className="text-xs text-gray-500">
                  Last Donation: {donor.lastDonation}
                </div>
              )}
            </div>

            <button
              disabled={donor.availability !== "Available"}
              className="w-full rounded-md bg-red-600 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {donor.availability === "Available"
                ? "Contact Donor"
                : donor.availability}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FindDonorsTab;
