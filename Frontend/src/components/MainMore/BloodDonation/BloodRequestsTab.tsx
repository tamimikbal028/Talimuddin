import React from "react";
import { FaTint, FaHospital, FaUser, FaPhone } from "react-icons/fa";

// TODO: Replace with API data
interface BloodRequest {
  id: string;
  patientName: string;
  bloodGroup: string;
  unitsNeeded: number;
  hospital: string;
  contactPerson: string;
  contactPhone: string;
  urgency: string;
  status: string;
  postedDate: string;
}

interface BloodRequestsTabProps {
  requests?: BloodRequest[];
}

const BloodRequestsTab: React.FC<BloodRequestsTabProps> = ({
  requests = [],
}) => {
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "Critical":
        return "bg-red-100 text-red-800 border-red-300";
      case "Urgent":
        return "bg-orange-100 text-orange-800 border-orange-300";
      default:
        return "bg-blue-100 text-blue-800 border-blue-300";
    }
  };

  const activeRequests = requests.filter(
    (request) => request.status === "Active"
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">
          Active Blood Requests
        </h2>
        <button className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-red-700">
          Create Request
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {activeRequests.map((request) => (
          <div
            key={request.id}
            className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {request.patientName}
                </h3>
                <p className="text-sm text-gray-600">{request.postedDate}</p>
              </div>
              <div
                className={`rounded-full border px-3 py-1 text-xs font-semibold ${getUrgencyColor(
                  request.urgency
                )}`}
              >
                {request.urgency}
              </div>
            </div>

            <div className="mb-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <FaTint className="text-red-600" />
                <span className="font-semibold">Blood Group:</span>
                <span className="font-bold text-red-600">
                  {request.bloodGroup}
                </span>
                <span className="ml-2 text-gray-600">
                  ({request.unitsNeeded} units needed)
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <FaHospital className="text-gray-600" />
                <span>{request.hospital}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <FaUser className="text-gray-600" />
                <span>Contact: {request.contactPerson}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <FaPhone className="text-gray-600" />
                <span className="font-semibold">{request.contactPhone}</span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-gray-200 pt-3">
              <span className="text-xs text-gray-600">
                Posted by: {request.postedBy}
              </span>
              <button className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700">
                I Can Donate
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BloodRequestsTab;
