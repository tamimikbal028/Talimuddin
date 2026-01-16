import React from "react";
import { FaFolder, FaDownload, FaEye, FaCalendarAlt } from "react-icons/fa";

// TODO: Replace with API types
type PublicFileItem = {
  fileId: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  downloads: number;
  views: number;
};

interface PublicFilesProps {
  username: string;
  isOwnProfile: boolean;
}

const PublicFiles: React.FC<PublicFilesProps> = ({
  username,
  isOwnProfile,
}) => {
  // TODO: Fetch user's public folders from API
  // const { data: publicFolders, isLoading } = usePublicFiles(username);
  const publicFolders: PublicFileItem[] = [];
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleDownload = (folder: PublicFileItem) => {
    // Simulate folder download
    alert(`Downloading ${folder.name} as ZIP...`);
  };

  if (publicFolders.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-12 text-center shadow">
        <FaFolder className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">
          No Public Files
        </h3>
        <p className="mt-2 text-gray-500">
          {isOwnProfile
            ? "You haven't shared any files publicly yet."
            : `${username} hasn't shared any files publicly yet.`}
        </p>
      </div>
    );
  }

  return (
    <>
      {publicFolders.map((folder) => (
        <div
          key={folder.fileId}
          className="group rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            {/* Left side - Folder info */}
            <div className="flex items-center space-x-4">
              <div className="rounded-lg bg-blue-100 p-2">
                <FaFolder className="h-5 w-5 text-blue-600" />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {folder.name}
                </h3>

                {/* Metadata */}
                <div className="mt-1 flex items-center space-x-4">
                  <span className="flex items-center text-xs text-gray-500">
                    <FaCalendarAlt className="mr-1 h-3 w-3" />
                    {formatDate(folder.uploadDate)}
                  </span>
                </div>
              </div>
            </div>

            {/* Right side - Action buttons */}
            <div className="flex items-center space-x-2">
              <button
                className="flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                onClick={() => handleDownload(folder)}
              >
                <FaDownload className="mr-2 h-4 w-4" />
                Download
              </button>

              <button className="flex items-center justify-center rounded-md border border-gray-300 p-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
                <FaEye className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default PublicFiles;
