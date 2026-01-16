import React from "react";
import { useDropdown } from "../../../hooks/useDropdown";
import {
  FaEllipsisV,
  FaDownload,
  FaEdit,
  FaTrash,
  FaInfoCircle,
} from "react-icons/fa";

interface FileActionsMenuProps {
  file: {
    id: string;
    name: string;
    type: "file" | "folder";
    size?: string;
  };
  onDownload: () => void;
  onRename: () => void;
  onDelete: () => void;
  onDetails: () => void;
}

const FileActionsMenu: React.FC<FileActionsMenuProps> = ({
  file,
  onDownload,
  onRename,
  onDelete,
  onDetails,
}) => {
  const {
    isOpen,
    openUpward,
    menuRef,
    triggerRef: buttonRef,
    toggle: toggleMenu,
  } = useDropdown();

  const handleAction = (action: () => void) => {
    action();
    toggleMenu(); // useDropdown toggle will close it
  };

  const menuItems = [
    {
      icon: FaDownload,
      label: "Download",
      action: onDownload,
      color: "text-blue-600",
      show: file.type === "file",
    },
    {
      icon: FaEdit,
      label: "Rename",
      action: onRename,
      color: "text-gray-700",
      show: true,
    },
    {
      icon: FaInfoCircle,
      label: "Details",
      action: onDetails,
      color: "text-gray-700",
      show: true,
    },
    {
      icon: FaTrash,
      label: "Delete",
      action: onDelete,
      color: "text-red-600",
      show: true,
    },
  ].filter((item) => item.show);

  return (
    <div ref={menuRef} className="relative">
      {/* 3-dot button */}
      <button
        ref={buttonRef}
        onClick={(e) => {
          e.stopPropagation();
          toggleMenu();
        }}
        className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-200"
        title="More actions"
      >
        <FaEllipsisV className="h-4 w-4" />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          className={`absolute right-0 z-50 w-48 rounded-lg border border-gray-200 bg-white shadow-lg ${
            openUpward ? "bottom-full mb-1" : "top-full mt-1"
          }`}
        >
          <div className="py-1">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAction(item.action);
                }}
                className={`flex w-full items-center gap-3 px-4 py-2 text-left text-sm transition-colors hover:bg-gray-50 ${item.color}`}
              >
                <item.icon className="h-4 w-4" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileActionsMenu;
