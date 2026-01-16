import React from "react";
import {
  FaTimes,
  FaDownload,
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFilePowerpoint,
  FaFileAlt,
} from "react-icons/fa";

interface FilePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: {
    id: string;
    name: string;
    type: "file" | "folder";
    size?: string;
    uploadedBy?: string;
    uploadDate?: string;
    url?: string;
  } | null;
}

const FilePreviewModal: React.FC<FilePreviewModalProps> = ({
  isOpen,
  onClose,
  file,
}) => {
  if (!isOpen || !file) return null;

  // Get file extension
  const getFileExtension = (filename: string) => {
    return filename.split(".").pop()?.toLowerCase() || "";
  };

  const extension = getFileExtension(file.name);

  // Get file icon based on extension
  const getFileIcon = () => {
    switch (extension) {
      case "pdf":
        return <FaFilePdf className="h-16 w-16 text-red-500" />;
      case "doc":
      case "docx":
        return <FaFileWord className="h-16 w-16 text-blue-500" />;
      case "xls":
      case "xlsx":
        return <FaFileExcel className="h-16 w-16 text-green-500" />;
      case "ppt":
      case "pptx":
        return <FaFilePowerpoint className="h-16 w-16 text-orange-500" />;
      default:
        return <FaFileAlt className="h-16 w-16 text-gray-500" />;
    }
  };

  // Check if file can be previewed in browser
  const canPreview = [
    "pdf",
    "jpg",
    "jpeg",
    "png",
    "gif",
    "webp",
    "svg",
  ].includes(extension);

  const handleDownload = () => {
    // Simulate download
    const link = document.createElement("a");
    link.href = file.url || "#";
    link.download = file.name;
    link.click();
  };

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
      <div className="relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 p-4">
          <div className="flex-1 pr-4">
            <h3 className="truncate text-lg font-semibold text-gray-900">
              {file.name}
            </h3>
            <div className="mt-1 flex items-center gap-4 text-sm text-gray-600">
              {file.size && <span>{file.size}</span>}
              {file.uploadedBy && <span>Uploaded by {file.uploadedBy}</span>}
              {file.uploadDate && <span>{file.uploadDate}</span>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              <FaDownload className="h-4 w-4" />
              Download
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-200"
            >
              <FaTimes className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div
          className="overflow-auto"
          style={{ maxHeight: "calc(90vh - 80px)" }}
        >
          {canPreview ? (
            <div className="p-4">
              {["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(
                extension
              ) ? (
                // Image preview
                <div className="flex justify-center">
                  <img
                    src={file.url || "/placeholder-image.jpg"}
                    alt={file.name}
                    className="max-h-[70vh] max-w-full rounded-lg object-contain"
                  />
                </div>
              ) : extension === "pdf" ? (
                // PDF preview
                <div className="h-[70vh]">
                  <iframe
                    src={file.url || ""}
                    className="h-full w-full rounded-lg border border-gray-300"
                    title={file.name}
                  />
                </div>
              ) : null}
            </div>
          ) : (
            // No preview available - show file icon
            <div className="flex flex-col items-center justify-center p-12">
              {getFileIcon()}
              <p className="mt-4 text-lg font-medium text-gray-900">
                {file.name}
              </p>
              <p className="mt-2 text-sm text-gray-600">
                Preview not available for this file type
              </p>
              <button
                onClick={handleDownload}
                className="mt-6 flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                <FaDownload className="h-4 w-4" />
                Download to view
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilePreviewModal;
