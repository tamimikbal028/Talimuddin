import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Branch } from "../../../types/branch.types";
import { branchHooks } from "../../../hooks/useBranch";
import { BRANCH_TYPES } from "../../../constants/branch";

interface BranchGeneralTabProps {
  branch: Branch;
  // TODO: Add type for updating branch
}

const BranchGeneralTab: React.FC<BranchGeneralTabProps> = ({ branch }) => {
  const navigate = useNavigate();
  const { branchId } = useParams();
  const [formData, setFormData] = useState({
    name: branch.name,
    description: branch.description || "",
    branchType: branch.branchType,
  });

  const { mutate: updateDetails, isPending } =
    branchHooks.useUpdateBranchDetails();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateDetails(
      {
        ...formData,
      },
      {
        onSuccess: () => {
          navigate(`/classroom/branches/${branchId}`);
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
              Branch Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g., Computer Science 101"
              className="mt-1.5 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              required
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-semibold text-gray-700"
            >
              About the Branch
            </label>
            <textarea
              id="description"
              rows={5}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Tell others what this branch is about..."
              className="mt-1.5 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="branchType"
              className="block text-sm font-semibold text-gray-700"
            >
              Branch Type
            </label>
            <div className="mt-1.5 grid gap-3 sm:grid-cols-2">
              {[
                {
                  id: BRANCH_TYPES.MAIN_BRANCH,
                  label: "Main Branch",
                  desc: "Main Branch",
                },
                {
                  id: BRANCH_TYPES.SUB_BRANCH,
                  label: "Sub Branch",
                  desc: "Sub Branch",
                },
              ].map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      branchType: option.id,
                    })
                  }
                  className={`flex flex-col items-start rounded-xl border-2 p-4 text-left transition-all ${
                    formData.branchType === option.id
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-100 hover:border-blue-200 hover:bg-gray-50"
                  }`}
                >
                  <span
                    className={`text-sm font-bold ${
                      formData.branchType === option.id
                        ? "text-blue-700"
                        : "text-gray-900"
                    }`}
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
              (formData.name === branch.name &&
                formData.description === branch.description &&
                formData.branchType === branch.branchType)
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

export default BranchGeneralTab;
