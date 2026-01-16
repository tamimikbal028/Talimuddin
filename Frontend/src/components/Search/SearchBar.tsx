import React from "react";
import { FaSearch } from "react-icons/fa";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-4">
        <FaSearch className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search for people, posts, hashtags..."
        className="block w-full rounded-xl border border-blue-500 py-2.5 pr-4 pl-12 text-lg focus:border-green-500 focus:ring focus:ring-green-500 focus:outline-none"
        autoFocus
      />
    </div>
  );
};

export default SearchBar;
