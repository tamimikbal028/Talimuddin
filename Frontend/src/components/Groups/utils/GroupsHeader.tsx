import React from "react";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";

const GroupsHeader: React.FC = () => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Groups</h1>
        <p className="mt-1 text-gray-600">
          Connect with communities that share your interests
        </p>
      </div>
      <Link
        to="/groups/creategroup"
        className="flex cursor-pointer items-center gap-2 rounded-lg border px-5 py-3 text-black transition-colors hover:bg-[#333] hover:text-white"
      >
        <FaPlus size={15} />
        Create Group
      </Link>
    </div>
  );
};

export default GroupsHeader;
