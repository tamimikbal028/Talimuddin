import React from "react";
import { FaBars, FaTimes } from "react-icons/fa";

interface AIHeaderProps {
  onMenuToggle: () => void;
  isSidebarOpen: boolean;
}

const AIHeader: React.FC<AIHeaderProps> = ({ onMenuToggle, isSidebarOpen }) => {
  return (
    <div className="flex items-center gap-3 border-b border-gray-300 bg-blue-50 px-2.5 py-2">
      {/* Menu Toggle Button */}
      <button
        onClick={onMenuToggle}
        aria-label="Toggle sidebar"
        className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-gray-700 transition-colors hover:bg-blue-200"
      >
        {isSidebarOpen ? (
          <FaTimes className="h-5 w-5" />
        ) : (
          <FaBars className="h-5 w-5" />
        )}
      </button>

      {/* Header Card */}
      <div className="flex flex-1 items-center justify-center gap-3">
        {/* <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 shadow-sm">
          <BsStars className="text-2xl text-white" />
        </div> */}

        <div className="flex-1">
          <div className="flex flex-col items-start justify-between">
            <h1 className="text-lg font-bold text-gray-900">Study Helper AI</h1>
            <p className="text-xs text-gray-500">
              Study helper AI to assist you with your learning needs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIHeader;
