import React from "react";
import { FaFolder, FaPlus } from "react-icons/fa";
import FileActionButton from "../../shared/FileActionButtons";

interface EmptyStateProps {
  searchQuery: string;
  onNewFolder: () => void;
  onUpload: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  searchQuery,
  onNewFolder,
  onUpload,
}) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
      <FaFolder className="mx-auto mb-3 text-4xl text-gray-300" />
      <h3 className="mb-2 text-base font-medium text-gray-900">
        {searchQuery ? "No files found" : "This folder is empty"}
      </h3>
      <p className="mb-4 text-sm text-gray-500">
        {searchQuery
          ? "Try adjusting your search terms."
          : "Upload files or create folders to get started."}
      </p>
      {!searchQuery && (
        <div className="flex justify-center space-x-3">
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
      )}
    </div>
  );
};

export default EmptyState;
