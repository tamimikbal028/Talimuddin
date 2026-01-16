import React from "react";
import { FaBookOpen } from "react-icons/fa";

const OpenStudy: React.FC = () => {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center p-4 text-center">
      <div className="mb-6 rounded-full bg-blue-50 p-6">
        <FaBookOpen className="h-16 w-16 text-blue-500" />
      </div>
      <h1 className="mb-4 text-3xl font-bold text-gray-900">Open Study</h1>
      <div className="max-w-md space-y-2 text-gray-600">
        <p className="text-lg">
          We are working on this feature! In the future, you will be able to:
        </p>
        <ul className="list-inside list-disc space-y-1 text-left font-medium">
          <li>Start open discussions</li>
          <li>Join open chat rooms</li>
          <li>Collaborate with other students</li>
        </ul>
        <p className="mt-4 text-sm text-gray-500">Stay tuned for updates!</p>
      </div>
    </div>
  );
};

export default OpenStudy;
