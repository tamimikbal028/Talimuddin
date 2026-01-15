import React, { useMemo, useState } from "react";
import { FaTint, FaUniversity, FaUsers, FaFilter } from "react-icons/fa";
import { bloodGroups } from "../data/bloodDonationData";

const universities = ["All", "BUET", "RUET", "KUET", "CUET", "HSC"];

// TODO: Replace with API data
interface Donor {
  id: string;
  name: string;
  bloodGroup: string;
  university: string;
  totalDonations: number;
  [key: string]: unknown;
}

interface DonorListTabProps {
  donors?: Donor[];
}

const DonorListTab: React.FC<DonorListTabProps> = ({ donors = [] }) => {
  const [selectedBloodGroup, setSelectedBloodGroup] = useState("All");
  const [selectedUniversity, setSelectedUniversity] = useState("All");

  const handleBloodGroupChange = (bloodGroup: string) => {
    setSelectedBloodGroup(bloodGroup);
  };

  const handleUniversityChange = (university: string) => {
    setSelectedUniversity(university);
  };

  // Filter and sort donors
  const filteredDonors = useMemo(() => {
    return donors
      .filter((donor) => {
        const matchesBloodGroup =
          selectedBloodGroup === "All" ||
          donor.bloodGroup === selectedBloodGroup;
        const matchesUniversity =
          selectedUniversity === "All" ||
          donor.university === selectedUniversity;
        return matchesBloodGroup && matchesUniversity;
      })
      .sort((a, b) => b.totalDonations - a.totalDonations);
  }, [donors, selectedBloodGroup, selectedUniversity]);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">
          All Blood Donors ({filteredDonors.length})
        </h2>
      </div>

      {/* Filters */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <FaFilter className="text-gray-600" />
          <h3 className="font-semibold text-gray-900">Filters</h3>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <select
            value={selectedBloodGroup}
            onChange={(e) => handleBloodGroupChange(e.target.value)}
            className="rounded-md border border-gray-300 px-4 py-2 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
          >
            {bloodGroups.map((group) => (
              <option key={group} value={group}>
                {group === "All" ? "All Blood Groups" : group}
              </option>
            ))}
          </select>
          <select
            value={selectedUniversity}
            onChange={(e) => handleUniversityChange(e.target.value)}
            className="rounded-md border border-gray-300 px-4 py-2 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
          >
            {universities.map((uni) => (
              <option key={uni} value={uni}>
                {uni === "All"
                  ? "All Universities"
                  : uni === "HSC"
                    ? "College Level (HSC)"
                    : uni}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Donor Cards List */}
      <div>
        {filteredDonors.map((donor) => (
          <div
            key={donor.id}
            className="flex items-center gap-4 border-b border-gray-300 bg-white p-3"
          >
            {/* Avatar */}
            <img
              src={donor.avatar}
              alt={donor.name}
              className="h-14 w-14 flex-shrink-0 rounded-full object-cover"
            />

            {/* Info */}
            <div className="flex flex-1 items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{donor.name}</h3>
                <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                  <FaUniversity className="text-gray-500" />
                  <span>{donor.university}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Blood Group */}
                <div className="flex items-center gap-2">
                  <FaTint className="text-red-600" />
                  <span className="rounded-full bg-red-600 px-3 py-1 text-sm font-bold text-white">
                    {donor.bloodGroup}
                  </span>
                </div>

                {/* Total Donations */}
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="font-semibold">Donated:</span>
                  <span className="rounded-full bg-green-100 px-3 py-1 font-bold text-green-800">
                    {donor.totalDonations} times
                  </span>
                </div>

                {/* Contact Button */}
                <button className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700">
                  Contact
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDonors.length === 0 && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
          <FaUsers className="mx-auto mb-3 h-12 w-12 text-gray-400" />
          <p className="text-gray-600">
            No donors found with selected filters.
          </p>
        </div>
      )}
    </div>
  );
};

export default DonorListTab;
