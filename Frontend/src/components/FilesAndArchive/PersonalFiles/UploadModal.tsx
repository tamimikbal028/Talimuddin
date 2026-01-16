import React, { useState, useRef, useCallback, useMemo } from "react";
import { FaCloudUploadAlt, FaFile, FaTimes } from "react-icons/fa";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadFiles: (files: File[]) => void;
}

const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onUploadFiles,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxFileSize = useMemo(() => 100 * 1024 * 1024, []); // 100MB
  const allowedTypes = useMemo(
    () => [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "text/plain",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ],
    []
  );

  const validateFiles = useCallback(
    (files: File[]): File[] => {
      const validFiles: File[] = [];
      let errorMessage = "";

      for (const file of files) {
        if (file.size > maxFileSize) {
          errorMessage = `${file.name} is too large. Maximum size is 100MB.`;
          break;
        }

        if (
          !allowedTypes.includes(file.type) &&
          !file.name.match(/\.(pdf|doc|docx|jpg|jpeg|png|gif|txt|xls|xlsx)$/i)
        ) {
          errorMessage = `${file.name} is not a supported file type.`;
          break;
        }

        validFiles.push(file);
      }

      if (errorMessage) {
        setError(errorMessage);
        return [];
      }

      setError("");
      return validFiles;
    },
    [maxFileSize, allowedTypes]
  );

  const handleFileSelect = useCallback(
    (files: FileList | null) => {
      if (!files) return;

      const fileArray = Array.from(files);
      const validFiles = validateFiles(fileArray);

      if (validFiles.length > 0) {
        setSelectedFiles((prev) => [...prev, ...validFiles]);
      }
    },
    [validateFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      handleFileSelect(e.dataTransfer.files);
    },
    [handleFileSelect]
  );

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = () => {
    if (selectedFiles.length === 0) {
      setError("Please select at least one file to upload.");
      return;
    }

    onUploadFiles(selectedFiles);
    setSelectedFiles([]);
    setError("");
    onClose();
  };

  const handleClose = () => {
    setSelectedFiles([]);
    setError("");
    setIsDragOver(false);
    onClose();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
      <div className="mx-4 w-full max-w-lg transform rounded-xl bg-white p-6 shadow-2xl transition-all duration-300 ease-out">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Upload Files
        </h3>

        {/* File Drop Zone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`mb-4 cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-all ${
            isDragOver
              ? "border-blue-500 bg-blue-100"
              : "border-blue-300 bg-blue-50 hover:border-blue-400 hover:bg-blue-100"
          }`}
        >
          <FaCloudUploadAlt className="mx-auto mb-3 text-3xl text-blue-500" />
          <p className="mb-2 text-sm font-medium text-gray-700">
            {isDragOver
              ? "Drop files here"
              : "Drop files here or click to browse"}
          </p>
          <p className="text-xs text-gray-500">
            Supports: PDF, DOC, DOCX, JPG, PNG, GIF, TXT, XLS, XLSX (Max: 100MB)
          </p>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.txt,.xls,.xlsx"
        />

        {/* Selected Files List */}
        {selectedFiles.length > 0 && (
          <div className="mb-4 max-h-40 overflow-y-auto">
            <h4 className="mb-2 text-sm font-medium text-gray-700">
              Selected Files ({selectedFiles.length})
            </h4>
            <div className="space-y-2">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border border-gray-200 p-2"
                >
                  <div className="flex items-center space-x-2">
                    <FaFile className="text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                  >
                    <FaTimes className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={handleClose}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={selectedFiles.length === 0}
            className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition-all ${
              selectedFiles.length > 0
                ? "bg-blue-600 hover:bg-blue-700 hover:shadow-md"
                : "cursor-not-allowed bg-gray-400"
            }`}
          >
            Upload {selectedFiles.length > 0 ? `${selectedFiles.length} ` : ""}
            Files
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
