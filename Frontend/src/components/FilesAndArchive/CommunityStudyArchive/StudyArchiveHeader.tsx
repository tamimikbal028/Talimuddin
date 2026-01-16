import React from "react";
import { FaFolder, FaChevronDown } from "react-icons/fa";

interface StudyArchiveHeaderProps {
  selectedLevel: string;
  setSelectedLevel: (level: string) => void;
  selectedTerm: string;
  setSelectedTerm: (term: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  levels: string[];
  terms: string[];
}

const StudyArchiveHeader: React.FC<StudyArchiveHeaderProps> = ({
  selectedLevel,
  setSelectedLevel,
  selectedTerm,
  setSelectedTerm,
  levels,
  terms,
}) => {
  return (
    <div className="flex justify-between rounded-lg border border-gray-200 bg-white p-3">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-green-600 p-3 text-white">
          <FaFolder className="text-xl" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Study Archive</h2>
          <p className="text-gray-600">
            A collaborative library of academic resources.
          </p>
        </div>
      </div>

      {/* Level and Term Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2 pr-8 focus:outline-none"
          >
            {levels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
          <FaChevronDown className="pointer-events-none absolute top-3 right-2 text-gray-400" />
        </div>
        <div className="relative">
          <select
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(e.target.value)}
            className="appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2 pr-8 focus:outline-none"
          >
            {terms.map((term) => (
              <option key={term} value={term}>
                {term}
              </option>
            ))}
          </select>
          <FaChevronDown className="pointer-events-none absolute top-3 right-2 text-gray-400" />
        </div>
      </div>
    </div>
  );
};

export default StudyArchiveHeader;
