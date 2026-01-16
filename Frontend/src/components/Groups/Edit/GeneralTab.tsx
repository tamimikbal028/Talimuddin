import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Group } from "../../../types";
import { groupHooks } from "../../../hooks/useGroup";
import { GROUP_PRIVACY } from "../../../constants";

interface GeneralTabProps {
  group: Group;
}

const GeneralTab: React.FC<GeneralTabProps> = ({ group }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: group.name,
    description: group.description,
    privacy: group.privacy,
  });

  const { mutate: updateDetails, isPending } =
    groupHooks.useUpdateGroupDetails();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateDetails(
      {
        updateData: formData,
      },
      {
        onSuccess: () => {
          navigate(`/groups/${group.slug}`);
        },
      }
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="animate-in fade-in slide-in-from-bottom-2 space-y-6 duration-500"
    >
      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
        <h2 className="mb-6 text-xl font-bold text-gray-900">
          General Information
        </h2>

        <div className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-gray-700"
            >
              Group Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g., Computer Science Hub"
              className="mt-1.5 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              required
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-semibold text-gray-700"
            >
              About the Group
            </label>
            <textarea
              id="description"
              rows={5}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Tell others what this group is about..."
              className="mt-1.5 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="privacy"
              className="block text-sm font-semibold text-gray-700"
            >
              Privacy Mode
            </label>
            <div className="mt-1.5 grid gap-3 sm:grid-cols-2">
              {[
                {
                  id: GROUP_PRIVACY.PUBLIC,
                  label: "Public",
                  desc: "Open for everyone to see and join.",
                },
                {
                  id: GROUP_PRIVACY.CLOSED,
                  label: "Closed",
                  desc: "Hidden content, requests required to join.",
                },
                {
                  id: GROUP_PRIVACY.PRIVATE,
                  label: "Private",
                  desc: "Invite-only, hidden from search.",
                },
              ].map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      privacy:
                        option.id as (typeof GROUP_PRIVACY)[keyof typeof GROUP_PRIVACY],
                    })
                  }
                  className={`flex flex-col items-start rounded-xl border-2 p-4 text-left transition-all ${
                    formData.privacy === option.id
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-100 hover:border-blue-200 hover:bg-gray-50"
                  }`}
                >
                  <span
                    className={`text-sm font-bold ${formData.privacy === option.id ? "text-blue-700" : "text-gray-900"}`}
                  >
                    {option.label}
                  </span>
                  <span className="mt-1 line-clamp-1 text-xs text-gray-500">
                    {option.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-end gap-3 border-t border-gray-100 pt-6">
          <button
            type="submit"
            disabled={
              isPending ||
              (formData.name === group.name &&
                formData.description === group.description &&
                formData.privacy === group.privacy)
            }
            className="flex min-w-[140px] items-center justify-center rounded-lg bg-blue-600 px-6 py-3 font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 hover:shadow-blue-300 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
          >
            {isPending ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Saving...
              </>
            ) : (
              "Update Details"
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default GeneralTab;
