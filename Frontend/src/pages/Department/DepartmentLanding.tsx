import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaGraduationCap,
  FaArrowRight,
  FaPlusCircle,
} from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { authHooks } from "../../hooks/useAuth";
import departmentService from "../../services/department.service";

const DepartmentLanding: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { user } = authHooks.useUser();

  // Redirect if already in a department
  React.useEffect(() => {
    if (user?.academicInfo?.department?._id) {
      navigate(`/departments/${user.academicInfo.department._id}`);
    }
  }, [user, navigate]);

  // Department search
  const { data: searchResults, isLoading } = useQuery({
    queryKey: ["departmentsSearch", searchQuery],
    queryFn: () => departmentService.searchDepartments(searchQuery),
    enabled: searchQuery.length >= 2,
    staleTime: 1000 * 60 * 5,
  });

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-12">
        {/* Hero Section */}
        <div className="space-y-4 text-center">
          <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-200">
            <FaGraduationCap className="h-10 w-10" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Find Your Department
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Join your department to access course materials, connect with
            classmates, and stay updated with departmental announcements.
          </p>
        </div>

        {/* Search Section */}
        <div className="relative">
          <div className="flex items-center rounded-2xl border-2 border-transparent bg-white shadow-lg transition-all focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">
            <FaSearch className="ml-6 h-6 w-6 text-gray-400" />
            <input
              type="text"
              placeholder="Search by department name or code (e.g., CSE, EEE)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border-none px-6 py-5 text-lg text-gray-900 placeholder-gray-400 focus:ring-0 focus:outline-none"
            />
          </div>

          {/* Search Results Dropdown-like List */}
          {searchQuery.length >= 2 && (
            <div className="absolute top-full right-0 left-0 z-10 mt-4 rounded-2xl border border-gray-100 bg-white p-2 shadow-2xl">
              {isLoading ? (
                <div className="flex items-center justify-center py-10">
                  <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
                </div>
              ) : searchResults?.data?.departments?.length ? (
                <div className="grid grid-cols-1 gap-1">
                  {searchResults.data.departments.map((dept) => (
                    <Link
                      key={dept._id}
                      to={`/departments/${dept._id}`}
                      className="group flex items-center justify-between rounded-xl p-4 transition-colors hover:bg-blue-50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 text-gray-500 group-hover:bg-white group-hover:text-blue-600">
                          {dept.logo ? (
                            <img
                              src={dept.logo}
                              alt=""
                              className="h-full w-full rounded-lg object-contain"
                            />
                          ) : (
                            <FaGraduationCap className="h-6 w-6" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 group-hover:text-blue-700">
                            {dept.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {dept.code || "Department"}
                          </p>
                        </div>
                      </div>
                      <FaArrowRight className="h-5 w-5 transform text-gray-300 transition-transform group-hover:translate-x-1 group-hover:text-blue-500" />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="py-10 text-center">
                  <p className="text-gray-500">
                    No departments found matching "{searchQuery}"
                  </p>
                  <p className="mt-2 text-sm text-gray-400">
                    Try searching through your institution's departments page
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Categories/Featured Section */}
        {!searchQuery && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                <FaArrowRight className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                Joining as a Student?
              </h3>
              <p className="text-gray-600">
                First join your institution, then you'll be able to access your
                department. Visit your institution page to see all available
                departments.
              </p>
              <Link
                to="/institutions"
                className="mt-6 inline-flex font-semibold text-purple-700 hover:text-purple-800"
              >
                Go to Institutions →
              </Link>
            </div>

            <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600">
                <FaPlusCircle className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                Department Admin?
              </h3>
              <p className="text-gray-600">
                Manage your department's content, announcements, and student
                community. Contact your institution admin for access.
              </p>
              <button className="mt-6 inline-flex font-semibold text-green-700 hover:text-green-800">
                Request Access →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentLanding;
