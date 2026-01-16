import React from "react";
import { useInstitutionDepartments } from "../../../hooks/useInstitution";
import { Link } from "react-router-dom";
import { FaGraduationCap, FaChevronRight } from "react-icons/fa";

const DepartmentsList: React.FC = () => {
  const { data: response, isLoading } = useInstitutionDepartments();
  const departments = response?.data?.departments || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (departments.length === 0) {
    return (
      <div className="rounded-xl bg-white py-20 text-center shadow-sm">
        <p className="text-gray-500">No departments found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="px-1 text-lg font-bold text-gray-900">Departments</h2>
      <div className="space-y-3">
        {departments.map((dept) => (
          <Link
            key={dept._id}
            to={`/departments/${dept._id}`}
            className="group flex items-start justify-between rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                {dept.logo ? (
                  <img
                    src={dept.logo}
                    alt={dept.name}
                    className="h-full w-full rounded-lg object-contain"
                  />
                ) : (
                  <FaGraduationCap className="h-7 w-7" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 transition-colors group-hover:text-blue-600">
                  {dept.name}
                </h3>
                <p className="text-sm font-semibold text-gray-500">
                  {dept.code}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-gray-600">
                <span className="text-lg font-bold text-gray-900">
                  {dept.studentsCount}
                </span>
                <span className="text-sm font-medium">
                  {dept.studentsCount <= 1 ? "Student" : "Students"}
                </span>
              </div>
              <FaChevronRight className="h-4 w-4 text-gray-400 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DepartmentsList;
