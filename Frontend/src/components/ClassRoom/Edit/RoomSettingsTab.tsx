import React, { useState } from "react";
import { useParams } from "react-router-dom";
import type { Room } from "../../../types/room.types";
import { roomHooks } from "../../../hooks/useRoom";

interface RoomSettingsTabProps {
  room: Room;
}

const RoomSettingsTab: React.FC<RoomSettingsTabProps> = ({ room }) => {
  const { roomId } = useParams();
  const [settings, setSettings] = useState({
    allowStudentPosting: room.settings?.allowStudentPosting ?? true,
    allowComments: room.settings?.allowComments ?? true,
  });

  const { mutate: updateDetails, isPending } = roomHooks.useUpdateRoomDetails();

  const handleToggle = (key: keyof typeof settings) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    updateDetails({
      roomId: roomId as string,
      updateData: { settings: newSettings },
    });
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 space-y-6 duration-500">
      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
        <h2 className="mb-6 text-xl font-bold text-gray-900">
          Permissions & Privacy
        </h2>

        <div className="space-y-1">
          {/* Allow Student Posting */}
          <div className="-mx-6 flex items-center justify-between px-6 py-4 transition-colors hover:bg-gray-50">
            <div className="flex-1 pr-4">
              <h3 className="font-bold text-gray-900">Student Posting</h3>
              <p className="mt-1 text-sm text-gray-500">
                Allow students to create posts in this room
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span
                className={`text-xs font-bold tracking-wider uppercase ${settings.allowStudentPosting ? "text-blue-600" : "text-gray-400"}`}
              >
                {settings.allowStudentPosting ? "Enabled" : "Disabled"}
              </span>
              <button
                onClick={() => handleToggle("allowStudentPosting")}
                disabled={isPending}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none ${
                  settings.allowStudentPosting
                    ? "bg-blue-600 shadow-inner"
                    : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${
                    settings.allowStudentPosting
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="-mx-6 h-px bg-gray-100" />

          {/* Allow Comments */}
          <div className="-mx-6 flex items-center justify-between px-6 py-4 transition-colors hover:bg-gray-50">
            <div className="flex-1 pr-4">
              <h3 className="font-bold text-gray-900">Comments</h3>
              <p className="mt-1 text-sm text-gray-500">
                Allow members to comment on posts
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span
                className={`text-xs font-bold tracking-wider uppercase ${settings.allowComments ? "text-blue-600" : "text-gray-400"}`}
              >
                {settings.allowComments ? "Enabled" : "Disabled"}
              </span>
              <button
                onClick={() => handleToggle("allowComments")}
                disabled={isPending}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none ${
                  settings.allowComments
                    ? "bg-blue-600 shadow-inner"
                    : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${
                    settings.allowComments ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomSettingsTab;
