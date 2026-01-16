import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

const VideosHeader: React.FC = () => {
  const [query, setQuery] = useState("");

  return (
    <div className="mb-6 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-gray-900">Videos</h1>

      {/* Search box (replaced filter tabs) */}
      <div className="ml-4">
        <label className="relative block">
          <FaSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search videos"
            className="w-50 rounded-md border border-gray-500 py-2 pr-2 pl-10 placeholder-gray-400 focus:border-blue-500 focus:outline-none"
          />
        </label>
      </div>
    </div>
  );
};

export default VideosHeader;
