import React from "react";
import { FaSearch } from "react-icons/fa";

const SearchHeader: React.FC = () => {
  return (
    <div className="space-y-2">
      <div className=" flex items-center space-x-3">
        <FaSearch className="h-8 w-8 text-green-600" />
        <h1 className="text-3xl font-bold text-gray-900">Search</h1>
      </div>
      <p className="text-gray-600">
        Find people, posts, hashtags, and more across SocialHub
      </p>
    </div>
  );
};

export default SearchHeader;
