import React, { useState, useEffect, useRef } from "react";
import {
  FaShare,
  FaDownload,
  FaEllipsisV,
  FaEdit,
  FaTrash,
  FaCopy,
  FaInfo,
  FaGlobe,
  FaLock,
} from "react-icons/fa";
import {
  inputRename,
  showSuccess,
  confirmDelete,
} from "../../../utils/sweetAlert";

interface FileItem {
  id: string;
  name: string;
  type: "folder" | "file";
  size?: string;
  createdAt: string;
  fileType?: string;
  shared?: boolean;
  isPublic?: boolean;
}

interface FilesListProps {
  files: FileItem[];
  onFolderClick: (folderId: string, folderName: string) => void;
  getFileIcon: (item: FileItem) => React.ReactElement;
  formatDate: (dateString: string) => string;
  formatTime: (dateString: string) => string;
  onRename?: (id: string, newName: string) => void;
  onDelete?: (id: string) => void;
  onCopy?: (id: string) => void;
  onShare?: (id: string) => void;
  onTogglePublic?: (id: string) => void;
}

const FilesList: React.FC<FilesListProps> = ({
  files,
  onFolderClick,
  getFileIcon,
  formatDate,
  formatTime,
  onRename,
  onDelete,
  onCopy,
  onShare,
  onTogglePublic,
}) => {
  const [showContextMenu, setShowContextMenu] = useState<string | null>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(event.target as Node)
      ) {
        setShowContextMenu(null);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowContextMenu(null);
      }
    };

    if (showContextMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("keydown", handleEscapeKey);
      };
    }
  }, [showContextMenu]);

  const handleShare = async (item: FileItem) => {
    try {
      // Toggle share status in Redux
      dispatch(shareItem(item.id));

      // Create a shareable link (for demo purposes)
      const shareLink = `${window.location.origin}/files/${item.id}`;

      // Try to use the Web Share API if available
      if (navigator.share) {
        await navigator.share({
          title: item.name,
          text: `Check out this file: ${item.name}`,
          url: shareLink,
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(shareLink);
        alert("NavLink copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
      alert("Could not share the file");
    }
  };

  const handleDownload = (item: FileItem) => {
    // Create a temporary download link
    const link = document.createElement("a");
    link.href = `#`; // In real app, this would be the actual file URL
    link.download = item.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // For demo purposes, show a message
    alert(`Downloading ${item.name}...`);
  };

  const handleRename = async (item: FileItem) => {
    const newName = await inputRename(item.name);

    if (newName && newName !== item.name) {
      dispatch(renameItem({ itemId: item.id, newName }));
      showSuccess({ title: "Renamed successfully!" });
    }
  };

  const handleCopy = (item: FileItem) => {
    dispatch(copyItem(item.id));
  };

  const handleDelete = async (item: FileItem) => {
    if (await confirmDelete(item.name)) {
      dispatch(deleteItem(item.id));
      showSuccess({
        title: "Deleted!",
        text: `${item.name} has been deleted.`,
      });
    }
  };

  const handleTogglePublic = (item: FileItem) => {
    if (item.type === "folder") {
      dispatch(togglePublic(item.id));
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="divide-y divide-gray-200">
        {files.map((item) => (
          <div
            key={item.id}
            className="group flex cursor-pointer items-center justify-between p-3 transition-colors hover:bg-gray-50"
            onClick={() =>
              item.type === "folder"
                ? onFolderClick(item.id, item.name)
                : undefined
            }
          >
            <div className="flex flex-1 items-center space-x-3">
              <div className="text-xl">{getFileIcon(item)}</div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {item.name}
                  </p>
                  {item.shared && <FaShare className="h-4 w-4 text-blue-500" />}
                </div>
                <p className="text-xs text-gray-500">
                  {formatDate(item.createdAt)} • {formatTime(item.createdAt)}
                  {item.size && ` • ${item.size}`}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Folder Actions */}
              {item.type === "folder" && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTogglePublic(item);
                    }}
                    className={`rounded p-2 transition-colors ${
                      item.isPublic
                        ? "text-green-600 hover:bg-green-50"
                        : "text-gray-500 hover:bg-gray-100"
                    }`}
                    title={
                      item.isPublic
                        ? "Make folder private"
                        : "Make folder public"
                    }
                  >
                    {item.isPublic ? (
                      <FaGlobe className="h-4 w-4" />
                    ) : (
                      <FaLock className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Folder download logic (zip download)
                      alert(`Downloading ${item.name} folder as ZIP...`);
                    }}
                    className="rounded p-2 text-gray-500 transition-colors hover:bg-green-50 hover:text-green-600"
                    title="Download folder as ZIP"
                  >
                    <FaDownload className="h-4 w-4" />
                  </button>
                </>
              )}

              {/* File Actions */}
              {item.type === "file" && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShare(item);
                    }}
                    className="rounded p-2 text-gray-500 transition-colors hover:bg-blue-50 hover:text-blue-600"
                    title="Share file"
                  >
                    <FaShare className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(item);
                    }}
                    className="rounded p-2 text-gray-500 transition-colors hover:bg-green-50 hover:text-green-600"
                    title="Download file"
                  >
                    <FaDownload className="h-4 w-4" />
                  </button>
                </>
              )}

              {/* 3-dot menu for both files and folders */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowContextMenu(
                    showContextMenu === item.id ? null : item.id
                  );
                }}
                className="relative rounded p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
                title="More options"
              >
                <FaEllipsisV className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* folder 3 dot Menu Popup */}
      {showContextMenu && (
        <div
          className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center"
          onClick={() => setShowContextMenu(null)}
        >
          <div
            ref={contextMenuRef}
            className="w-80 rounded-lg bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              File Options
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => {
                  const currentItem = files.find(
                    (f) => f.id === showContextMenu
                  );
                  if (currentItem) handleRename(currentItem);
                  setShowContextMenu(null);
                }}
                className="flex w-full items-center rounded-md px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100"
              >
                <FaEdit className="mr-3 h-5 w-5" />
                Rename
              </button>
              <button
                onClick={() => {
                  const currentItem = files.find(
                    (f) => f.id === showContextMenu
                  );
                  if (currentItem) handleCopy(currentItem);
                  setShowContextMenu(null);
                }}
                className="flex w-full items-center rounded-md px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100"
              >
                <FaCopy className="mr-3 h-5 w-5" />
                Copy
              </button>
              {files.find((f) => f.id === showContextMenu)?.type ===
                "folder" && (
                <button
                  onClick={() => {
                    const currentItem = files.find(
                      (f) => f.id === showContextMenu
                    );
                    if (currentItem) handleTogglePublic(currentItem);
                    setShowContextMenu(null);
                  }}
                  className="flex w-full items-center rounded-md px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100"
                >
                  {files.find((f) => f.id === showContextMenu)?.isPublic ? (
                    <>
                      <FaLock className="mr-3 h-5 w-5" />
                      Make Private
                    </>
                  ) : (
                    <>
                      <FaGlobe className="mr-3 h-5 w-5" />
                      Make Public
                    </>
                  )}
                </button>
              )}
              {files.find((f) => f.id === showContextMenu)?.type === "file" && (
                <button
                  onClick={() => {
                    const currentItem = files.find(
                      (f) => f.id === showContextMenu
                    );
                    if (currentItem) {
                      alert(
                        `File info for ${currentItem.name}\nSize: ${currentItem.size}\nCreated: ${formatDate(currentItem.createdAt)}\nShared: ${currentItem.shared ? "Yes" : "No"}`
                      );
                    }
                    setShowContextMenu(null);
                  }}
                  className="flex w-full items-center rounded-md px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100"
                >
                  <FaInfo className="mr-3 h-5 w-5" />
                  Properties
                </button>
              )}
              <div className="border-t border-gray-200 pt-2">
                <button
                  onClick={() => {
                    const currentItem = files.find(
                      (f) => f.id === showContextMenu
                    );
                    if (currentItem) handleDelete(currentItem);
                    setShowContextMenu(null);
                  }}
                  className="flex w-full items-center rounded-md px-4 py-3 text-sm font-medium text-red-700 hover:bg-red-50"
                >
                  <FaTrash className="mr-3 h-5 w-5" />
                  Delete
                </button>
              </div>
              <div className="border-t border-gray-200 pt-2">
                <button
                  onClick={() => setShowContextMenu(null)}
                  className="flex w-full items-center justify-center rounded-md px-4 py-3 text-sm font-medium text-gray-500 hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilesList;
