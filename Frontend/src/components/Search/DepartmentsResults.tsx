import React from "react";

import type { SearchDepartment } from "../../types";

interface DepartmentsResultsProps {
  isVisible: boolean;
  departments?: SearchDepartment[];
}

const DepartmentsResults: React.FC<DepartmentsResultsProps> = ({
  isVisible,
  departments = [],
}) => {
  if (!isVisible) return null;
  if (departments.length === 0) return null;

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold text-gray-900">
        Departments ({departments.length})
      </h2>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {departments.map((dept) => (
          <div
            key={dept._id}
            className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
          >
            <p className="font-semibold text-gray-900">{dept.name}</p>
            {dept.code && (
              <p className="text-sm text-gray-500">Code: {dept.code}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepartmentsResults;
