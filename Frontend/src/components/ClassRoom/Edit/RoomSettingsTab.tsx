import React, { useState, useRef, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";
import type { Room } from "../../../types/room.types";
import { roomHooks } from "../../../hooks/useRoom";

interface RoomSettingsTabProps {
  room: Room;
}

const RoomSettingsTab: React.FC<RoomSettingsTabProps> = ({ room }) => {
  const [settings, setSettings] = useState({
    allowStudentPosting: room.settings.allowStudentPosting,
    allowComments: room.settings.allowComments,
    requirePostApproval: room.settings.requirePostApproval,
  });
  const [privacy, setPrivacy] = useState(room.privacy);
  const [showPrivacyDropdown, setShowPrivacyDropdown] = useState(false);
  const privacyRef = useRef<HTMLDivElement>(null);

  const { mutate: updateDetails, isPending } = roomHooks.useUpdateRoomDetails();

  const privacyOptions: Array<{
    value: "PUBLIC" | "PRIVATE" | "CLOSED";
    label: string;
    description: string;
  }> = [
    {
      value: "PUBLIC",
      label: "Public",
      description: "Anyone with join code can join directly",
    },
    {
      value: "PRIVATE",
      label: "Private",
      description: "Join requests require approval",
    },
    {
      value: "CLOSED",
      label: "Closed",
      description: "Invitation only, cannot join with code",
    },
  ];

  const getPrivacyLabel = (value: string) => {
    return (
      privacyOptions.find((option) => option.value === value)?.label ||
      "Select Privacy"
    );
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        privacyRef.current &&
        !privacyRef.current.contains(event.target as Node)
      ) {
        setShowPrivacyDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = (key: keyof typeof settings) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    updateDetails({
      ...room,
      settings: newSettings,
      privacy,
    });
  };

  const handlePrivacyChange = (newPrivacy: "PUBLIC" | "PRIVATE" | "CLOSED") => {
    setPrivacy(newPrivacy);
    setShowPrivacyDropdown(false);
    updateDetails({
      ...room,
      settings,
      privacy: newPrivacy,
    });
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 space-y-6 duration-500">
      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
        <h2 className="mb-6 text-xl font-bold text-gray-900">
          Permissions & Privacy
        </h2>

        <div className="space-y-1">
          {/* Privacy Setting */}
          <div className="-mx-6 px-6 py-4">
            <div className="mb-3">
              <h3 className="font-bold text-gray-900">Room Privacy</h3>
              <p className="mt-1 text-sm text-gray-500">
                Control who can join this room
              </p>
            </div>
            <div className="relative" ref={privacyRef}>
              <button
                type="button"
                onClick={() => setShowPrivacyDropdown(!showPrivacyDropdown)}
                disabled={isPending}
                className="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-3 text-left text-gray-900 shadow-sm transition-colors hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50"
              >
                <span className="font-medium">{getPrivacyLabel(privacy)}</span>
                <FaChevronDown
                  className={`h-4 w-4 text-gray-500 transition-transform ${
                    showPrivacyDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showPrivacyDropdown && (
                <div className="absolute top-full left-0 z-50 mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
                  {privacyOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handlePrivacyChange(option.value)}
                      disabled={isPending}
                      className={`flex w-full flex-col px-4 py-3 text-left transition-colors hover:bg-gray-50 disabled:opacity-50 ${
                        privacy === option.value ? "bg-blue-50" : ""
                      }`}
                    >
                      <span
                        className={`text-sm font-semibold ${
                          privacy === option.value
                            ? "text-blue-600"
                            : "text-gray-900"
                        }`}
                      >
                        {option.label}
                      </span>
                      <span className="mt-0.5 text-xs text-gray-500">
                        {option.description}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="-mx-6 h-px bg-gray-100" />
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

          <div className="-mx-6 h-px bg-gray-100" />

          {/* Require Post Approval */}
          <div className="-mx-6 flex items-center justify-between px-6 py-4 transition-colors hover:bg-gray-50">
            <div className="flex-1 pr-4">
              <h3 className="font-bold text-gray-900">Post Moderation</h3>
              <p className="mt-1 text-sm text-gray-500">
                Require approval for student posts before they become visible
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span
                className={`text-xs font-bold tracking-wider uppercase ${settings.requirePostApproval ? "text-blue-600" : "text-gray-400"}`}
              >
                {settings.requirePostApproval ? "Enabled" : "Disabled"}
              </span>
              <button
                onClick={() => handleToggle("requirePostApproval")}
                disabled={isPending}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none ${
                  settings.requirePostApproval
                    ? "bg-blue-600 shadow-inner"
                    : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${
                    settings.requirePostApproval
                      ? "translate-x-6"
                      : "translate-x-1"
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
