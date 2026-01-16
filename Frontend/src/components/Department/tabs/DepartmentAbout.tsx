import React from "react";
import { useDepartmentDetails } from "../../../hooks/useDepartment";
import {
  FaInfoCircle,
  FaMapMarkerAlt,
  FaGlobe,
  FaCalendarAlt,
  FaUniversity,
} from "react-icons/fa";

const DepartmentAbout: React.FC = () => {
  const { data: detailsResponse, isLoading } = useDepartmentDetails();
  const department = detailsResponse?.data?.department;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!department) {
    return (
      <div className="py-20 text-center text-gray-500">
        Failed to load department details
      </div>
    );
  }

  // Get institution name
  const institutionName =
    typeof department.institution === "string"
      ? "Institution"
      : department.institution?.name || "Institution";

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {/* Left Column: Info Grid */}
      <div className="space-y-6 md:col-span-2">
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="flex items-center gap-2 border-b border-gray-50 pb-4 text-lg font-bold text-gray-900">
            <FaInfoCircle className="text-blue-600" />
            About the Department
          </h3>

          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-1">
              <span className="text-xs font-bold tracking-wider text-gray-400 uppercase">
                Department Code
              </span>
              <p className="flex items-center gap-2 font-semibold text-gray-900 uppercase">
                <FaUniversity className="text-gray-400" />
                {department.code}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold tracking-wider text-gray-400 uppercase">
                Institution
              </span>
              <p className="font-semibold text-gray-900">{institutionName}</p>
            </div>

            {department.location && (
              <div className="space-y-1">
                <span className="text-xs font-bold tracking-wider text-gray-400 uppercase">
                  Location
                </span>
                <p className="flex items-center gap-2 font-semibold text-gray-900">
                  <FaMapMarkerAlt className="text-gray-400" />
                  {department.location}
                </p>
              </div>
            )}

            {department.establishedYear && (
              <div className="space-y-1">
                <span className="text-xs font-bold tracking-wider text-gray-400 uppercase">
                  Established
                </span>
                <p className="flex items-center gap-2 font-semibold text-gray-900">
                  <FaCalendarAlt className="text-gray-400" />
                  {department.establishedYear}
                </p>
              </div>
            )}
          </div>

          {/* Description */}
          {department.description && (
            <div className="mt-6">
              <h4 className="mb-2 text-sm font-bold tracking-wider text-gray-400 uppercase">
                Description
              </h4>
              <p className="text-gray-700">{department.description}</p>
            </div>
          )}
        </div>

        {/* Contact Info */}
        {((department.contactEmails && department.contactEmails.length > 0) ||
          (department.contactPhones &&
            department.contactPhones.length > 0)) && (
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="border-b border-gray-50 pb-4 text-lg font-bold text-gray-900">
              Contact Information
            </h3>
            <div className="mt-4 space-y-4">
              {department.contactEmails?.map((email, index) => (
                <a
                  key={index}
                  href={`mailto:${email}`}
                  className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 transition hover:bg-gray-50"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    <FaGlobe />
                  </div>
                  <div>
                    <p className="text-left text-sm font-bold text-gray-900">
                      Email
                    </p>
                    <p className="truncate text-xs text-blue-600">{email}</p>
                  </div>
                </a>
              ))}
              {department.contactPhones?.map((phone, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-lg border border-gray-200 p-3"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50 text-green-600">
                    <FaGlobe />
                  </div>
                  <div>
                    <p className="text-left text-sm font-bold text-gray-900">
                      Phone
                    </p>
                    <p className="text-xs text-gray-600">{phone}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Column: Sidebar Stats */}
      <div className="space-y-6">
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-bold tracking-wider text-gray-400 uppercase">
            Overview
          </h3>
          <div className="mt-4 flex items-center justify-between text-left">
            <span className="text-sm text-gray-600">Official Posts</span>
            <span className="font-bold text-gray-900">
              {department.postsCount}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-left">
            <span className="text-sm text-gray-600">Students</span>
            <span className="font-bold text-gray-900">
              {department.studentsCount}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-left">
            <span className="text-sm text-gray-600">Status</span>
            <span className="flex items-center gap-1 text-sm font-bold text-green-600">
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
              Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentAbout;
