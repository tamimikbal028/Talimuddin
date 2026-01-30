import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FaSignInAlt } from "react-icons/fa";
import { branchHooks } from "../../hooks/useBranch";

type JoinBranchFormValues = {
  joinCode: string;
};

const JoinBranchPage: React.FC = () => {
  const navigate = useNavigate();
  const { mutate: joinBranch, isPending } = branchHooks.useJoinBranch();

  const { register, handleSubmit, formState } = useForm<JoinBranchFormValues>({
    defaultValues: {
      joinCode: "",
    },
  });

  const { errors } = formState;

  const onSubmit = (data: JoinBranchFormValues) => {
    joinBranch(data.joinCode, {
      onSuccess: (response) => {
        const branchId = response.data.branchId;
        navigate(`/classroom/branches/${branchId}`);
      },
    });
  };

  const handleCancel = () => {
    navigate("/classroom");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full space-y-5 rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg">
          <FaSignInAlt className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Join a Branch</h3>
          <p className="mt-1 text-sm font-medium text-gray-500">
            Enter the 6-character join code to join a branch
          </p>
        </div>
      </div>

      {/* Join Code Field */}
      <div>
        <input
          type="text"
          {...register("joinCode", {
            required: "Join code is required",
            pattern: {
              value: /^[A-Z0-9]{6}$/,
              message: "Join code must be 6 characters (letters and numbers)",
            },
          })}
          placeholder="Enter code"
          maxLength={6}
          style={{ textTransform: "uppercase" }}
          autoFocus
          className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-center text-2xl font-bold tracking-widest text-gray-900 placeholder-gray-400 shadow-sm transition-colors focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none"
        />
        {errors.joinCode?.message && (
          <p className="mt-1.5 text-center text-sm font-medium text-red-600">
            {errors.joinCode.message}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={handleCancel}
          className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-gray-300 focus:outline-none"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-green-600 to-green-700 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:from-green-700 hover:to-green-800 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FaSignInAlt className="h-5 w-5" />
          {isPending ? "Joining..." : "Join Branch"}
        </button>
      </div>
    </form>
  );
};

export default JoinBranchPage;
