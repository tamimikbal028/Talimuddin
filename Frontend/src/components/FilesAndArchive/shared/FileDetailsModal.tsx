import React from "react";
import {
  FaTimes,
  FaFile,
  FaFolder,
  FaCalendar,
  FaUser,
  FaFileAlt,
} from "react-icons/fa";

interface FileDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: {
    id: string;
    name: string;
    type: "file" | "folder";
    size?: string;
    uploadedBy?: string;
    uploadDate?: string;
    description?: string;
    fileCount?: number;
    downloads?: number;
    views?: number;
  } | null;
}

const FileDetailsModal: React.FC<FileDetailsModalProps> = ({
  isOpen,
  onClose,
  file,
}) => {
  if (!isOpen || !file) return null;

  const detailItems = [
    {
      icon: file.type === "file" ? FaFile : FaFolder,
      label: "Type",
      value: file.type === "file" ? "File" : "Folder",
    },
    {
      icon: FaFileAlt,
      label: "Name",
      value: file.name,
    },
    ...(file.size
      ? [
          {
            icon: FaFileAlt,
            label: "Size",
            value: file.size,
          },
        ]
      : []),
    ...(file.uploadedBy
      ? [
          {
            icon: FaUser,
            label: "Uploaded By",
            value: file.uploadedBy,
          },
        ]
      : []),
    ...(file.uploadDate
      ? [
          {
            icon: FaCalendar,
            label: "Upload Date",
            value: file.uploadDate,
          },
        ]
      : []),
    ...(file.fileCount !== undefined && file.type === "folder"
      ? [
          {
            icon: FaFile,
            label: "Files",
            value: `${file.fileCount} file(s)`,
          },
        ]
      : []),
    ...(file.downloads !== undefined
      ? [
          {
            icon: FaFileAlt,
            label: "Downloads",
            value: `${file.downloads} download(s)`,
          },
        ]
      : []),
    ...(file.views !== undefined
      ? [
          {
            icon: FaFileAlt,
            label: "Views",
            value: `${file.views} view(s)`,
          },
        ]
      : []),
  ];

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
      <div className="w-full max-w-md rounded-lg bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 p-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {file.type === "file" ? "File" : "Folder"} Details
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-200"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-4">
            {detailItems.map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="mt-0.5 rounded-lg bg-blue-50 p-2 text-blue-600">
                  <item.icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">
                    {item.label}
                  </p>
                  <p className="mt-1 text-sm break-words text-gray-900">
                    {item.value}
                  </p>
                </div>
              </div>
            ))}

            {file.description && (
              <div className="mt-4 rounded-lg bg-gray-50 p-4">
                <p className="text-sm font-medium text-gray-600">Description</p>
                <p className="mt-2 text-sm text-gray-700">{file.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50 p-4">
          <button
            onClick={onClose}
            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileDetailsModal;
