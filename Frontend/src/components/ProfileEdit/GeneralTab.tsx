import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  FaUser,
  FaPhone,
  FaVenusMars,
  FaPray,
  FaInfoCircle,
  FaSpinner,
  FaLinkedin,
  FaGithub,
  FaGlobe,
  FaFacebook,
  FaTags,
  FaHeart,
} from "react-icons/fa";

import { profileHooks } from "../../hooks/useProfile";
import { GENDERS, RELIGIONS } from "../../constants";
import type { User } from "../../types";

// ====================================
// ZOD VALIDATION SCHEMA
// ====================================

const generalInfoSchema = z.object({
  fullName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters"),
  bio: z.string().max(300, "Bio cannot exceed 300 characters").optional(),
  phoneNumber: z
    .string()
    .regex(/^(\+?\d{10,14})?$/, "Invalid phone number format")
    .optional()
    .or(z.literal("")),
  gender: z.enum(["MALE", "FEMALE"]).optional().or(z.literal("")),
  religion: z.string().optional(),
  socialLinks: z
    .object({
      linkedin: z.string().url("Invalid URL").optional().or(z.literal("")),
      github: z.string().url("Invalid URL").optional().or(z.literal("")),
      website: z.string().url("Invalid URL").optional().or(z.literal("")),
      facebook: z.string().url("Invalid URL").optional().or(z.literal("")),
    })
    .optional(),
  skills: z.string().optional(), // Comma-separated
  interests: z.string().optional(), // Comma-separated
});

type GeneralInfoFormData = z.infer<typeof generalInfoSchema>;

// ====================================
// COMPONENT PROPS
// ====================================

interface GeneralTabProps {
  user: User;
}

// ====================================
// COMPONENT
// ====================================

const GeneralTab: React.FC<GeneralTabProps> = ({ user }) => {
  const { mutate: updateGeneral, isPending } = profileHooks.useUpdateGeneral();

  // Form setup with React Hook Form
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty },
  } = useForm<GeneralInfoFormData>({
    resolver: zodResolver(generalInfoSchema),
    defaultValues: {
      fullName: user.fullName || "",
      bio: user.bio || "",
      phoneNumber: user.phoneNumber || "",
      gender: (user.gender as "MALE" | "FEMALE" | "") || "",
      religion: user.religion || "",
      socialLinks: {
        linkedin: user.socialLinks?.linkedin || "",
        github: user.socialLinks?.github || "",
        website: user.socialLinks?.website || "",
        facebook: user.socialLinks?.facebook || "",
      },
      skills: user.skills?.join(", ") || "",
      interests: user.interests?.join(", ") || "",
    },
  });

  const onSubmit = (data: GeneralInfoFormData) => {
    // Transform comma-separated strings to arrays
    const payload = {
      ...data,
      gender: data.gender || undefined,
      skills: data.skills
        ? data.skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : undefined,
      interests: data.interests
        ? data.interests
            .split(",")
            .map((i) => i.trim())
            .filter(Boolean)
        : undefined,
    };

    updateGeneral(payload);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Info Card */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          <FaUser className="mr-2 inline text-blue-600" />
          Basic Information
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Full Name */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("fullName")}
              className={`w-full rounded-lg border px-3 py-2 focus:ring-2 focus:outline-none ${
                errors.fullName
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="Enter your full name"
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-500">
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              <FaPhone className="mr-1 inline text-gray-400" />
              Phone Number
            </label>
            <input
              type="tel"
              {...register("phoneNumber")}
              className={`w-full rounded-lg border px-3 py-2 focus:ring-2 focus:outline-none ${
                errors.phoneNumber
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="+8801XXXXXXXXX"
            />
            {errors.phoneNumber && (
              <p className="mt-1 text-sm text-red-500">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              <FaVenusMars className="mr-1 inline text-gray-400" />
              Gender
            </label>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">Select Gender</option>
                  {Object.entries(GENDERS).map(([key, value]) => (
                    <option key={key} value={value}>
                      {key.charAt(0) + key.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
              )}
            />
          </div>

          {/* Religion */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              <FaPray className="mr-1 inline text-gray-400" />
              Religion
            </label>
            <Controller
              name="religion"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">Select Religion</option>
                  {Object.entries(RELIGIONS).map(([key, value]) => (
                    <option key={key} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              )}
            />
          </div>
        </div>

        {/* Bio */}
        <div className="mt-4">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            <FaInfoCircle className="mr-1 inline text-gray-400" />
            Bio
          </label>
          <textarea
            {...register("bio")}
            rows={3}
            className={`w-full rounded-lg border px-3 py-2 focus:ring-2 focus:outline-none ${
              errors.bio
                ? "border-red-300 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
            placeholder="Write a short bio about yourself..."
          />
          {errors.bio && (
            <p className="mt-1 text-sm text-red-500">{errors.bio.message}</p>
          )}
        </div>
      </div>

      {/* Social Links Card */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          <FaGlobe className="mr-2 inline text-green-600" />
          Social Links
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          {/* LinkedIn */}
          <div>
            <label className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
              <FaLinkedin className="text-[#0077B5]" />
              LinkedIn
            </label>
            <input
              type="url"
              {...register("socialLinks.linkedin")}
              className={`w-full rounded-lg border px-3 py-2 focus:ring-2 focus:outline-none ${
                errors.socialLinks?.linkedin
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="https://linkedin.com/in/username"
            />
            {errors.socialLinks?.linkedin && (
              <p className="mt-1 text-sm text-red-500">
                {errors.socialLinks.linkedin.message}
              </p>
            )}
          </div>

          {/* GitHub */}
          <div>
            <label className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
              <FaGithub className="text-gray-800" />
              GitHub
            </label>
            <input
              type="url"
              {...register("socialLinks.github")}
              className={`w-full rounded-lg border px-3 py-2 focus:ring-2 focus:outline-none ${
                errors.socialLinks?.github
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="https://github.com/username"
            />
            {errors.socialLinks?.github && (
              <p className="mt-1 text-sm text-red-500">
                {errors.socialLinks.github.message}
              </p>
            )}
          </div>

          {/* Facebook */}
          <div>
            <label className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
              <FaFacebook className="text-[#1877F2]" />
              Facebook
            </label>
            <input
              type="url"
              {...register("socialLinks.facebook")}
              className={`w-full rounded-lg border px-3 py-2 focus:ring-2 focus:outline-none ${
                errors.socialLinks?.facebook
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="https://facebook.com/username"
            />
            {errors.socialLinks?.facebook && (
              <p className="mt-1 text-sm text-red-500">
                {errors.socialLinks.facebook.message}
              </p>
            )}
          </div>

          {/* Website */}
          <div>
            <label className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
              <FaGlobe className="text-gray-600" />
              Personal Website
            </label>
            <input
              type="url"
              {...register("socialLinks.website")}
              className={`w-full rounded-lg border px-3 py-2 focus:ring-2 focus:outline-none ${
                errors.socialLinks?.website
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="https://yourwebsite.com"
            />
            {errors.socialLinks?.website && (
              <p className="mt-1 text-sm text-red-500">
                {errors.socialLinks.website.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Skills & Interests Card */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          <FaTags className="mr-2 inline text-orange-600" />
          Skills & Interests
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Skills */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              <FaTags className="mr-1 inline text-gray-400" />
              Skills
            </label>
            <input
              type="text"
              {...register("skills")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="React, Node.js, Python (comma separated)"
            />
            <p className="mt-1 text-xs text-gray-500">
              Separate multiple skills with commas
            </p>
          </div>

          {/* Interests */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              <FaHeart className="mr-1 inline text-gray-400" />
              Interests
            </label>
            <input
              type="text"
              {...register("interests")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Web Dev, AI, Music (comma separated)"
            />
            <p className="mt-1 text-xs text-gray-500">
              Separate multiple interests with commas
            </p>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!isDirty || isPending}
          className="rounded-lg bg-blue-600 px-8 py-2.5 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <FaSpinner className="animate-spin" />
              Saving...
            </span>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>
    </form>
  );
};

export default GeneralTab;


