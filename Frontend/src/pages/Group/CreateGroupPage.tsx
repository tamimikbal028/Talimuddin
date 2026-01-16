import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  FaArrowLeft,
  FaLock,
  FaGlobe,
  FaBan,
  FaCheck,
  FaUsers,
  FaBriefcase,
  FaUniversity,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { groupHooks } from "../../hooks/useGroup";

// Zod Schema
const createGroupSchema = z.object({
  name: z.string().min(3, "Group name must be at least 3 characters"),
  description: z.string().optional(),
  type: z.enum(["GENERAL", "JOBS_CAREERS", "OFFICIAL_INSTITUTION"]),
  privacy: z.enum(["PUBLIC", "PRIVATE", "CLOSED"]),
  settings: z.object({
    allowMemberPosting: z.boolean(),
    requirePostApproval: z.boolean(),
  }),
});

type CreateGroupFormInputs = z.infer<typeof createGroupSchema>;

const CreateGroupPage: React.FC = () => {
  const navigate = useNavigate();
  const { mutate: createGroup, isPending } = groupHooks.useCreateGroup();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateGroupFormInputs>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "GENERAL",
      privacy: "PUBLIC",
      settings: {
        allowMemberPosting: true,
        requirePostApproval: false,
      },
    },
  });

  const privacyValue = watch("privacy");
  const typeValue = watch("type");

  const onSubmit = (data: CreateGroupFormInputs) => {
    createGroup(data);
  };

  const groupTypes = [
    {
      value: "GENERAL",
      label: "General",
      icon: FaUsers,
      color: "text-blue-600",
      description: "Connect with people who share your hobbies and interests.",
    },
    {
      value: "JOBS_CAREERS",
      label: "Careers",
      icon: FaBriefcase,
      color: "text-indigo-600",
      description: "Network with professionals and find job opportunities.",
    },
    {
      value: "OFFICIAL_INSTITUTION",
      label: "Official",
      icon: FaUniversity,
      color: "text-purple-600",
      description:
        "Official group for schools, universities, or organizations.",
    },
  ];

  const privacyOptions = [
    {
      value: "PUBLIC",
      label: "Public",
      icon: FaGlobe,
      color: "text-blue-600",
      description: "Anyone can see the group, its members and their posts.",
    },
    {
      value: "PRIVATE",
      label: "Private",
      icon: FaLock,
      color: "text-gray-700",
      description:
        "Only members can see who's in the group and what they post.",
    },
    {
      value: "CLOSED",
      label: "Closed",
      icon: FaBan,
      color: "text-red-600",
      description:
        "Hidden from search. Only members can find and join this group.",
    },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="group flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition-all hover:border-blue-500 hover:text-blue-600"
          >
            <FaArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Create New Group
            </h1>
            <p className="text-sm font-medium text-gray-500">
              Start a community for people with shared interests
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:text-gray-900"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="create-group-form"
            disabled={isPending}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg disabled:opacity-70 disabled:shadow-none"
          >
            {isPending ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Creating...
              </>
            ) : (
              <>
                Create Group
                <FaCheck />
              </>
            )}
          </button>
        </div>
      </div>

      <form
        className="space-y-5"
        id="create-group-form"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Basic Information */}
        <div className="space-y-5 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          {/* Name */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Group Name <span className="text-red-500">*</span>
            </label>
            <input
              {...register("name")}
              type="text"
              placeholder="e.g. Computer Science Class of 2025"
              className={`w-full rounded-lg border px-4 py-2.5 text-sm transition-all outline-none focus:ring-2 ${
                errors.name
                  ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
              }`}
            />
            {errors.name && (
              <p className="mt-1.5 text-xs font-medium text-red-500">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              {...register("description")}
              rows={4}
              placeholder="Tell people what this group is about..."
              className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-all outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-3 block text-sm font-medium text-gray-700">
              Group Type
            </label>
            <div className="grid gap-4 sm:grid-cols-3">
              {groupTypes.map((type) => (
                <label
                  key={type.value}
                  className={`relative flex cursor-pointer flex-col rounded-xl border p-4 transition-all hover:shadow-md ${
                    typeValue === type.value
                      ? "border-blue-500 bg-blue-50/50 ring-1 ring-blue-500"
                      : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    value={type.value}
                    {...register("type")}
                    className="sr-only"
                  />
                  <div className={`mb-2 flex items-center gap-2 ${type.color}`}>
                    <type.icon className="text-lg" />
                    <span className="font-semibold">{type.label}</span>
                  </div>
                  <p className="text-xs leading-relaxed text-gray-500">
                    {type.description}
                  </p>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Privacy & Settings */}
        <div className="space-y-5 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div>
            <label className="mb-3 block text-sm font-medium text-gray-700">
              Privacy Level
            </label>
            <div className="grid gap-4 sm:grid-cols-3">
              {privacyOptions.map((option) => (
                <label
                  key={option.value}
                  className={`relative flex cursor-pointer flex-col rounded-xl border p-4 transition-all hover:shadow-md ${
                    privacyValue === option.value
                      ? "border-blue-500 bg-blue-50/50 ring-1 ring-blue-500"
                      : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    value={option.value}
                    {...register("privacy")}
                    className="sr-only"
                  />
                  <div
                    className={`mb-2 flex items-center gap-2 ${option.color}`}
                  >
                    <option.icon className="text-lg" />
                    <span className="font-semibold">{option.label}</span>
                  </div>
                  <p className="text-xs leading-relaxed text-gray-500">
                    {option.description}
                  </p>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50">
              <input
                type="checkbox"
                {...register("settings.allowMemberPosting")}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Allow members to post
                </p>
                <p className="text-xs text-gray-500">
                  If unchecked, only admins and moderators can create posts.
                </p>
              </div>
            </label>

            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50">
              <input
                type="checkbox"
                {...register("settings.requirePostApproval")}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Require post approval
                </p>
                <p className="text-xs text-gray-500">
                  Posts by members must be approved by an admin before
                  appearing.
                </p>
              </div>
            </label>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateGroupPage;


