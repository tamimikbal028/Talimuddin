import React from "react";

import type { SearchInstitution } from "../../types";

interface InstitutionsResultsProps {
  isVisible: boolean;
  institutions?: SearchInstitution[];
}

const InstitutionsResults: React.FC<InstitutionsResultsProps> = ({
  isVisible,
  institutions = [],
}) => {
  if (!isVisible) return null;
  if (institutions.length === 0) return null;

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold text-gray-900">
        Institutions ({institutions.length})
      </h2>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {institutions.map((inst) => (
          <div
            key={inst._id}
            className="flex items-center space-x-3 rounded-lg border border-gray-200 bg-white p-3 shadow-sm"
          >
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-md bg-gray-100">
              {inst.avatar ? (
                <img
                  src={inst.avatar}
                  alt={inst.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-xl font-bold text-gray-400">
                  {inst.name.charAt(0)}
                </span>
              )}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{inst.name}</p>
              <p className="text-sm text-gray-500 capitalize">
                {inst.type || "Institution"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InstitutionsResults;
