import React, { useState } from "react";

import type { Group } from "../../../types";
import { groupHooks } from "../../../hooks/useGroup";

interface SettingsTabProps {
  group: Group;
}

const SettingsTab: React.FC<SettingsTabProps> = ({ group }) => {
  const [settings, setSettings] = useState({
    allowMemberPosting: group.settings?.allowMemberPosting ?? true,
    requirePostApproval: group.settings?.requirePostApproval ?? false,
  });

  const { mutate: updateDetails, isPending } = groupHooks.useUpdateGroupDetails();

  const handleToggle = (key: keyof typeof settings) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    updateDetails({
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
          {/* Allow Member Posting */}
          <div className="-mx-6 flex items-center justify-between px-6 py-4 transition-colors hover:bg-gray-50">
            <div className="flex-1 pr-4">
              <h3 className="font-bold text-gray-900">Post Permissions</h3>
              <p className="mt-1 text-sm text-gray-500">
                Who can create new posts in this group?
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span
                className={`text-xs font-bold tracking-wider uppercase ${settings.allowMemberPosting ? "text-blue-600" : "text-gray-400"}`}
              >
                {settings.allowMemberPosting
                  ? "Everyone"
                  : "Owner, Admins & Moderators"}
              </span>
              <button
                onClick={() => handleToggle("allowMemberPosting")}
                disabled={isPending}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none ${
                  settings.allowMemberPosting
                    ? "bg-blue-600 shadow-inner"
                    : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${
                    settings.allowMemberPosting
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="-mx-6 h-px bg-gray-100" />

          {/* Require Post Approval */}
          <div className="-mx-6 flex items-center justify-between px-6 py-4 transition-colors hover:bg-gray-50">
            <div className="flex-1 pr-4">
              <h3 className="font-bold text-gray-900">Post Approval</h3>
              <p className="mt-1 text-sm text-gray-500">
                Enable this to review and approve posts before they go live.
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

export default SettingsTab;


