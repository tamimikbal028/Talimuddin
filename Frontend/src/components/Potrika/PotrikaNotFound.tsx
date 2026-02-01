import React from "react";
import { Link } from "react-router-dom";
import { FaNewspaper } from "react-icons/fa";

const PotrikaNotFound: React.FC = () => {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
            <FaNewspaper className="h-12 w-12 text-gray-400" />
          </div>
        </div>
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Potrika Not Found
        </h1>
        <p className="mb-6 text-gray-600">
          The potrika you're looking for doesn't exist or has been removed.
        </p>
        <Link
          to="/"
          className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
};

export default PotrikaNotFound;
