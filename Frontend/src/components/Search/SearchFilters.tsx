import React from "react";
import {
  FaSearch,
  FaUser,
  FaFileAlt,
  FaUsers,
  FaUniversity,
  FaComments,
  FaGraduationCap,
} from "react-icons/fa";

interface SearchFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  resultCounts?: {
    users?: number;
    posts?: number;
    groups?: number;
    institutions?: number;
    departments?: number;
    comments?: number;
    total?: number;
  };
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  activeFilter,
  onFilterChange,
  resultCounts = {},
}) => {
  const filters = [
    { id: "all", name: "All", icon: FaSearch, count: resultCounts.total },
    { id: "users", name: "Users", icon: FaUser, count: resultCounts.users },
    { id: "posts", name: "Posts", icon: FaFileAlt, count: resultCounts.posts },
    { id: "groups", name: "Groups", icon: FaUsers, count: resultCounts.groups },
    {
      id: "institutions",
      name: "Institutions",
      icon: FaUniversity,
      count: resultCounts.institutions,
    },
    {
      id: "departments",
      name: "Departments",
      icon: FaGraduationCap,
      count: resultCounts.departments,
    },
    {
      id: "comments",
      name: "Comments",
      icon: FaComments,
      count: resultCounts.comments,
    },
  ];

  return (
    <div className="flex items-center justify-between space-x-2 overflow-x-auto pb-2">
      {filters.map((filter) => {
        const IconComponent = filter.icon;
        const countValue = filter.count;
        const hasCount = typeof countValue === "number";
        const showBadge = hasCount && countValue > 0;

        return (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`relative flex items-center space-x-2 rounded-full px-4 py-2 whitespace-nowrap transition-all ${
              activeFilter === filter.id
                ? "bg-blue-500 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <IconComponent className="h-4 w-4" />
            <span className="text-sm font-medium">{filter.name}</span>

            {/* Result count badge */}
            {showBadge && (
              <span
                className={`ml-1 rounded-full px-2 py-0.5 text-xs ${
                  activeFilter === filter.id
                    ? "bg-white text-blue-500"
                    : "bg-blue-500 text-white"
                }`}
              >
                {filter.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default SearchFilters;
