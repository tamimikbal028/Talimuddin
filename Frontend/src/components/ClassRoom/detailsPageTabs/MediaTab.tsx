import React, { useState, useRef } from "react";
import { formatPostDate } from "../../../utils/dateUtils";
import { FaEye, FaDownload } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import { showMediaMenu } from "../../../utils/customModals";

// TODO: Replace with API types
type RoomFile = {
  id: string;
  roomId: string;
  fileName: string;
  fileUrl?: string;
  uploadedBy: string;
  uploadedAt: string;
  isGeneral?: boolean;
  isCT?: boolean;
  isAssignment?: boolean;
};

interface Props {
  roomId: string;
  creatorId?: string;
  admins?: string[];
  currentUserId?: string;
  files?: RoomFile[];
}

const MediaTab: React.FC<Props> = ({
  roomId,
  creatorId,
  admins,
  currentUserId,
  files = [],
}) => {
  const [active, setActive] = useState<"general" | "ct" | "assignments">(
    "general"
  );

  // keep a local copy so we can rename/delete locally in the demo
  const [localFiles, setLocalFiles] = useState(() =>
    files.filter((f) => f.roomId === roomId)
  );

  const filtered = localFiles.filter((f) =>
    active === "general"
      ? !!f.isGeneral
      : active === "ct"
        ? !!f.isCT
        : !!f.isAssignment
  );

  const counts = {
    general: localFiles.filter((f) => f.isGeneral).length,
    ct: localFiles.filter((f) => f.isCT).length,
    assignments: localFiles.filter((f) => f.isAssignment).length,
  };

  const handleFileMenu = async (file: (typeof roomFiles)[number]) => {
    await showMediaMenu(file.fileName, {
      onRename: (newName) => {
        setLocalFiles((s) =>
          s.map((x) => (x.id === file.id ? { ...x, fileName: newName } : x))
        );
      },
      onDelete: () => {
        setLocalFiles((s) => s.filter((x) => x.id !== file.id));
      },
    });
  };
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isManager =
    !!currentUserId &&
    (currentUserId === creatorId || !!admins?.includes(currentUserId));

  const handleUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const newFile: RoomFile = {
      id: `f-${roomId}-${Date.now()}`,
      roomId,
      fileName: file.name,
      fileUrl: url,
      uploadedBy: currentUserId ?? "1",
      uploadedAt: new Date().toISOString(),
      isGeneral: active === "general",
      isCT: active === "ct",
      isAssignment: active === "assignments",
    };
    setLocalFiles((s) => [newFile, ...s]);
    // reset input so same file can be picked again
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div>
      <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActive("general")}
          className={`rounded px-3 py-2 text-sm font-medium ${
            active === "general"
              ? "bg-blue-50 text-blue-700"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          General ({counts.general})
        </button>
        <button
          onClick={() => setActive("ct")}
          className={`rounded px-3 py-2 text-sm font-medium ${
            active === "ct"
              ? "bg-blue-50 text-blue-700"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          Class Test ({counts.ct})
        </button>
        <button
          onClick={() => setActive("assignments")}
          className={`rounded px-3 py-2 text-sm font-medium ${
            active === "assignments"
              ? "bg-blue-50 text-blue-700"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          Assignments ({counts.assignments})
        </button>
        <div className="ml-auto">
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleUploadChange}
            aria-hidden
          />
          {isManager ? (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="rounded-md border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 hover:bg-blue-100"
            >
              Upload
            </button>
          ) : (
            <div className="text-sm text-gray-500">Only admins can upload</div>
          )}
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-6 text-center">
            <h4 className="text-lg font-semibold text-gray-900">No files</h4>
            <p className="mt-2 text-sm text-gray-500">
              There are no files in this category yet.
            </p>
          </div>
        ) : (
          filtered.map((f) => {
            // TODO: Replace with API data
            const uploaderName = "User";
            const extMatch = f.fileName.match(/\.([0-9a-zA-Z]+)$/);
            const ext = extMatch ? extMatch[1].toUpperCase() : "FILE";
            return (
              <div
                key={f.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-blue-50 font-semibold text-blue-700">
                    {ext}
                  </div>
                  <div className="min-w-0">
                    <div
                      className="truncate font-medium text-gray-900"
                      style={{ maxWidth: 420 }}
                    >
                      {f.fileName}
                    </div>
                    <div className="text-xs text-gray-500">
                      <span>{uploaderName}</span>
                      <span className="mx-2">•</span>
                      <span>{formatPostDate(f.uploadedAt)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {f.fileUrl && (
                    <a
                      href={f.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-md border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
                    >
                      <FaEye className="h-3 w-3" />
                      View
                    </a>
                  )}

                  {f.fileUrl && (
                    <a
                      download={f.fileName}
                      href={f.fileUrl}
                      className="inline-flex items-center gap-2 rounded-md border border-gray-100 bg-gray-50 px-3 py-1 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                    >
                      <FaDownload className="h-3 w-3" />
                      Download
                    </a>
                  )}

                  {isManager && (
                    <button
                      onClick={() => handleFileMenu(f)}
                      className="p-1 text-gray-500 hover:text-gray-800"
                      aria-label="File menu"
                    >
                      <BsThreeDots className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MediaTab;
