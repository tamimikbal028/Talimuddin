import React from "react";
import { FaPlus, FaSearch } from "react-icons/fa";
import FileActionButton from "../../shared/FileActionButtons";

interface ActionBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onNewFolder: () => void;
  onUpload: () => void;
}

const ActionBar: React.FC<ActionBarProps> = ({
  searchQuery,
  onSearchChange,
  onNewFolder,
  onUpload,
}) => {
  return (
    <div className="flex items-center justify-between">
      {/* Buttons */}
      <div className="flex items-center space-x-3">
        <FileActionButton
          icon={FaPlus}
          label="New Folder"
          onClick={onNewFolder}
        />
        <FileActionButton
          icon={FaPlus}
          label="Upload File"
          onClick={onUpload}
        />
      </div>

      {/* search bar */}
      <div className="flex items-center space-x-3">
        <div className="relative">
          <FaSearch className="absolute top-1/2 left-3 h-3 w-3 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search files..."
            className="w-full rounded-md border border-blue-500 py-2 pr-3 pl-8 text-sm font-medium focus:ring-1 focus:ring-blue-500 focus:outline-none"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default ActionBar;
