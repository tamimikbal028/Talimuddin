import { useForm, Controller } from "react-hook-form";
import { FaChalkboardTeacher, FaChevronDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { branchHooks } from "../../hooks/useBranch";
import { useState, useRef, useEffect } from "react";
import { BRANCH_TYPES } from "../../constants/branch";

export type BranchFormValues = {
  name: string;
  description?: string;
  branchType: string;
  parentBranchJoinCode?: string;
};

const CreateBranchForm = () => {
  const navigate = useNavigate();
  const [showBranchTypeDropdown, setShowBranchTypeDropdown] = useState(false);
  const branchTypeRef = useRef<HTMLDivElement>(null);

  const { mutate: createBranch, isPending } = branchHooks.useCreateBranch();

  const handleCreate = (data: BranchFormValues) => {
    createBranch(data);
  };

  const { register, handleSubmit, formState, control, watch } =
    useForm<BranchFormValues>({
      defaultValues: {
        name: "",
        description: "",
        branchType: BRANCH_TYPES.MAIN_BRANCH,
        parentBranchJoinCode: "",
      },
    });

  const selectedBranchType = watch("branchType");
  const { errors } = formState;

  const branchTypes = [
    { value: BRANCH_TYPES.MAIN_BRANCH, label: "Main Branch" },
    { value: BRANCH_TYPES.SUB_BRANCH, label: "Sub Branch" },
  ];

  const getBranchTypeLabel = (value: string) => {
    return branchTypes.find((type) => type.value === value)?.label;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        branchTypeRef.current &&
        !branchTypeRef.current.contains(event.target as Node)
      ) {
        setShowBranchTypeDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <form onSubmit={handleSubmit(handleCreate)} className="w-full space-y-5">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
          <FaChalkboardTeacher className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            Create a New Study Branch
          </h3>
          <p className="mt-1 text-sm font-medium text-gray-500">
            Set up a collaborative space for your class
          </p>
        </div>
      </div>

      {/* Branch Name Field */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Branch Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register("name", {
            required: "Branch name is required",
            minLength: {
              value: 3,
              message: "Branch name must be at least 3 characters",
            },
          })}
          placeholder="e.g., CSE 2-1 Study Group"
          className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        {errors.name?.message && (
          <p className="mt-1.5 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      {/* Description Field */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Description
        </label>
        <textarea
          {...register("description")}
          placeholder="Brief description of the branch (optional)"
          rows={3}
          className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Branch Type */}
      <div className="flex justify-between gap-5">
        <div className="w-full">
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Branch Type <span className="text-red-500">*</span>
          </label>
          <Controller
            name="branchType"
            control={control}
            rules={{ required: "Branch type is required" }}
            render={({ field }) => (
              <div className="relative" ref={branchTypeRef}>
                <button
                  type="button"
                  onClick={() =>
                    setShowBranchTypeDropdown(!showBranchTypeDropdown)
                  }
                  className="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-3 text-left text-gray-900 shadow-sm transition-colors hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <span className="font-medium">
                    {getBranchTypeLabel(field.value)}
                  </span>
                  <FaChevronDown
                    className={`h-4 w-4 text-gray-500 transition-transform ${
                      showBranchTypeDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {showBranchTypeDropdown && (
                  <div className="absolute top-full left-0 z-50 mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
                    {branchTypes.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => {
                          field.onChange(type.value);
                          setShowBranchTypeDropdown(false);
                        }}
                        className={`flex w-full items-center px-4 py-3 text-left transition-colors hover:bg-gray-50 ${
                          field.value === type.value ? "bg-blue-50" : ""
                        }`}
                      >
                        <span
                          className={`text-sm font-semibold ${
                            field.value === type.value
                              ? "text-blue-600"
                              : "text-gray-900"
                          }`}
                        >
                          {type.label}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          />
          {errors.branchType?.message && (
            <p className="mt-1.5 text-sm text-red-600">
              {errors.branchType.message}
            </p>
          )}
        </div>
      </div>

      {/* Sub Branch Join Code */}
      {selectedBranchType === BRANCH_TYPES.SUB_BRANCH && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Main Branch Join Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("parentBranchJoinCode", {
              required:
                selectedBranchType === BRANCH_TYPES.SUB_BRANCH
                  ? "Main branch join code is required"
                  : false,
              pattern: {
                value: /^[A-Z0-9]{6}$/,
                message: "Join code must be 6 alphanumeric characters",
              },
            })}
            placeholder="Enter the 6-digit join code of the main branch"
            className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 font-mono text-gray-900 placeholder-gray-400 shadow-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          {errors.parentBranchJoinCode?.message && (
            <p className="mt-1.5 text-sm text-red-600">
              {errors.parentBranchJoinCode.message}
            </p>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-5">
        <button
          type="button"
          onClick={() => navigate("/classroom")}
          className="cursor-pointer rounded-lg border border-red-500 bg-white px-5 py-2.5 text-sm font-semibold text-red-500 shadow-sm transition-colors hover:bg-red-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-blue-700"
        >
          {isPending ? "Creating..." : "Create Branch"}
        </button>
      </div>
    </form>
  );
};

export default CreateBranchForm;
