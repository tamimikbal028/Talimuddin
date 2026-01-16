import React, { useState, useRef, useEffect } from "react";

interface NewFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateFolder: (folderName: string) => void;
}

const NewFolderModal: React.FC<NewFolderModalProps> = ({
  isOpen,
  onClose,
  onCreateFolder,
}) => {
  const [folderName, setFolderName] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setFolderName("");
      setError("");
      // Focus the input when modal opens
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!folderName.trim()) {
      setError("Folder name is required");
      return;
    }

    if (folderName.trim().length > 50) {
      setError("Folder name must be less than 50 characters");
      return;
    }

    // Check for invalid characters
    const invalidChars = /[<>:"/\\|?*]/;
    if (invalidChars.test(folderName)) {
      setError("Folder name contains invalid characters");
      return;
    }

    onCreateFolder(folderName.trim());
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
      <div className="mx-4 w-full max-w-md transform rounded-xl bg-white p-6 shadow-2xl transition-all duration-300 ease-out">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Create New Folder
        </h3>

        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Enter folder name"
            value={folderName}
            onChange={(e) => {
              setFolderName(e.target.value);
              setError(""); // Clear error when user types
            }}
            onKeyDown={handleKeyDown}
            className={`mb-2 w-full rounded-lg border px-4 py-3 text-sm shadow-sm transition-all focus:outline-none ${
              error
                ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            }`}
            maxLength={50}
          />

          {error && <p className="mb-4 text-xs text-red-600">{error}</p>}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!folderName.trim()}
              className={`rounded-lg px-4 py-2 text-sm text-white transition-all ${
                folderName.trim()
                  ? "bg-blue-600 hover:bg-blue-700 hover:shadow-md"
                  : "cursor-not-allowed bg-gray-400"
              }`}
            >
              Create Folder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewFolderModal;
