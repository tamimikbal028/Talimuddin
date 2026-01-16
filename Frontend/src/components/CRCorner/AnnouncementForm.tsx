import React from "react";
import { FaBullhorn, FaTimes, FaFile, FaPlus } from "react-icons/fa";

interface AnnouncementFormProps {
  isEditing: boolean;
  title: string;
  content: string;
  existingFiles: Array<{ id: string; name: string; url?: string }>;
  attachedFiles: File[];
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveExistingFile: (fileId: string) => void;
  onRemoveFile: (index: number) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export const AnnouncementForm: React.FC<AnnouncementFormProps> = ({
  isEditing,
  title,
  content,
  existingFiles,
  attachedFiles,
  onTitleChange,
  onContentChange,
  onFileChange,
  onRemoveExistingFile,
  onRemoveFile,
  onSubmit,
  onCancel,
}) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FaBullhorn className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            {isEditing ? "Edit Announcement" : "New Announcement"}
          </h3>
        </div>
        <button
          onClick={onCancel}
          className="rounded p-1 text-gray-500 hover:bg-gray-100"
        >
          <FaTimes className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Announcement Title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-4 py-3 text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
        />

        <textarea
          placeholder="Write your announcement here..."
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          rows={4}
          className="w-full resize-none rounded-md border border-gray-300 px-4 py-3 text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
        />

        {/* File Attachments */}
        <div className="space-y-2">
          {/* Existing files */}
          {existingFiles.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between rounded-md border border-gray-300 bg-gray-50 p-3"
            >
              <div className="flex items-center gap-2">
                <FaFile className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-gray-700">
                  {file.name}
                  <span className="ml-2 text-xs text-gray-500">
                    (Existing file)
                  </span>
                </span>
              </div>
              <button
                onClick={() => onRemoveExistingFile(file.id)}
                className="rounded p-1 text-red-500 hover:bg-red-50"
              >
                <FaTimes className="h-4 w-4" />
              </button>
            </div>
          ))}

          {/* New files */}
          {attachedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-md border border-gray-300 bg-blue-50 p-3"
            >
              <div className="flex items-center gap-2">
                <FaFile className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-gray-700">{file.name}</span>
              </div>
              <button
                onClick={() => onRemoveFile(index)}
                className="rounded p-1 text-red-500 hover:bg-red-50"
              >
                <FaTimes className="h-4 w-4" />
              </button>
            </div>
          ))}

          {/* Add file button */}
          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-md border-2 border-dashed border-gray-300 p-3 transition-colors hover:border-blue-400 hover:bg-blue-50">
            <FaPlus className="h-4 w-4 text-gray-600" />
            <span className="text-sm text-gray-600">
              {existingFiles.length + attachedFiles.length > 0
                ? "Add more files"
                : "Attach files (Notes, Assignment, etc.)"}
            </span>
            <input
              type="file"
              multiple
              onChange={onFileChange}
              className="hidden"
              accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png"
            />
          </label>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-md border border-gray-300 py-2.5 text-base font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={!title.trim() || !content.trim()}
            className="flex-1 rounded-md bg-blue-600 py-2.5 text-base font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {isEditing ? "Update" : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
};
