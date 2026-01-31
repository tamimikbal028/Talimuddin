import React from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaSignInAlt } from "react-icons/fa";
import { authHooks } from "../../hooks/useAuth";
import { USER_TYPES } from "../../constants";

const Header: React.FC = () => {
  const { user } = authHooks.useUser();
  const isAppOwner = user?.userType === USER_TYPES.OWNER;
  const isAppAdmin = user?.userType === USER_TYPES.ADMIN;

  return (
    <header className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">ClassRoom</h1>
        <p className="text-gray-600">Join and manage your classes.</p>
      </div>
      <div>
        {isAppOwner && (
          <Link
            to="/branch/createbranch"
            className="flex items-center gap-2 rounded-lg border-2 border-dashed border-blue-300 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 transition-colors hover:border-blue-400 hover:bg-blue-100"
          >
            <FaPlus className="h-4 w-4" />
            Create Branch
          </Link>
        )}
        {!(isAppOwner || isAppAdmin) && (
          <Link
            to="/branch/joinbranch"
            className="flex items-center gap-2 rounded-lg border-2 border-dashed border-green-300 bg-green-50 px-4 py-2 text-sm font-semibold text-green-600 transition-colors hover:border-green-400 hover:bg-green-100"
          >
            <FaSignInAlt className="h-4 w-4" />
            Join Branch
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
