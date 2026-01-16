import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  FaGraduationCap,
  FaIdCard,
  FaChalkboardTeacher,
  FaTrash,
  FaLock,
} from "react-icons/fa";

import { profileHooks } from "../../hooks/useProfile";
import { USER_TYPES, TEACHER_RANKS } from "../../constants";
import type { User } from "../../types";

// ====================================
// ZOD VALIDATION SCHEMAS
// ====================================

// Office Hours schema (for teachers)
const officeHourSchema = z.object({
  day: z.string().min(1, "Day is required"),
  timeRange: z.string().min(1, "Time range is required"),
  room: z.string(),
});

// Student Academic Schema
const studentAcademicSchema = z.object({
  session: z.string().optional(),
  section: z.string().optional(),
  studentId: z.string().optional(),
  institution: z.string().optional(),
  department: z.string().optional(),
});

// Teacher Academic Schema
const teacherAcademicSchema = z.object({
  teacherId: z.string().optional(),
  rank: z.string().optional(),
  officeHours: z.array(officeHourSchema).optional(),
  institution: z.string().optional(),
  department: z.string().optional(),
});

// Local form types (inferred from Zod)
type StudentAcademicFormData = z.infer<typeof studentAcademicSchema>;
type TeacherAcademicFormData = z.infer<typeof teacherAcademicSchema>;

// ====================================
// COMPONENT PROPS
// ====================================

interface AcademicTabProps {
  user: User;
}

// ====================================
// DAYS OF WEEK
// ====================================

const DAYS_OF_WEEK = [
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

// ====================================
// STUDENT FORM COMPONENT
// ====================================

const StudentForm: React.FC<{ user: User }> = ({ user }) => {
  const { mutate: updateAcademic, isPending } = profileHooks.useUpdateAcademic();

  const {
    register,
    handleSubmit,
    formState: { isDirty },
  } = useForm<StudentAcademicFormData>({
    resolver: zodResolver(studentAcademicSchema),
    defaultValues: {
      session: user.academicInfo?.session || "",
      section: user.academicInfo?.section || "",
      studentId: user.academicInfo?.studentId || "",
      institution: user.institution?._id || "",
      department: user.academicInfo?.department?._id || "",
    },
  });

  const onSubmit = (data: StudentAcademicFormData) => {
    updateAcademic(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Institution Info (Read-only for institutional email verified users) */}
      {user.isStudentEmail && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <div className="flex items-center gap-2 text-green-800">
            <FaLock className="text-green-600" />
            <span className="font-medium">Institutional Email Verified</span>
          </div>
          <p className="mt-1 text-sm text-green-700">
            Your institution and department are verified via institutional email
            and cannot be changed.
          </p>
        </div>
      )}

      {/* Institution & Department Selection */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
          <FaGraduationCap className="text-blue-600" />
          Institution & Department
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Institution */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Institution ID
            </label>
            <input
              type="text"
              {...register("institution")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500"
              placeholder="Enter Institution ID"
              disabled={user.isStudentEmail}
            />
          </div>

          {/* Department */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Department ID
            </label>
            <input
              type="text"
              {...register("department")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500"
              placeholder="Enter Department ID"
              disabled={user.isStudentEmail}
            />
          </div>
        </div>
      </div>

      {/* Student Info Card */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
          <FaIdCard className="text-green-600" />
          Student Information
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Student ID
            </label>
            <input
              type="text"
              {...register("studentId")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="e.g., 2102028"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Session
            </label>
            <input
              type="text"
              {...register("session")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="e.g., 2020-21"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Section
            </label>
            <input
              type="text"
              {...register("section")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="e.g., A, B, C"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!isDirty || isPending}
          className="rounded-lg bg-green-600 px-8 py-2.5 font-medium text-white transition-colors hover:bg-green-700 disabled:bg-gray-400"
        >
          {isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
};

// ====================================
// TEACHER FORM COMPONENT
// ====================================

const TeacherForm: React.FC<{ user: User }> = ({ user }) => {
  const { mutate: updateAcademic, isPending } = profileHooks.useUpdateAcademic();

  const {
    register,
    handleSubmit,
    control,
    formState: { isDirty },
  } = useForm<TeacherAcademicFormData>({
    resolver: zodResolver(teacherAcademicSchema),
    defaultValues: {
      teacherId: user.academicInfo?.teacherId || "",
      rank: user.academicInfo?.rank || "",
      officeHours: user.academicInfo?.officeHours || [],
      institution: user.institution?._id || "",
      department: user.academicInfo?.department?._id || "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "officeHours",
  });

  const onSubmit = (data: TeacherAcademicFormData) => {
    updateAcademic(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Institution Selection */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
          <FaGraduationCap className="text-blue-600" />
          Institution & Department
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Institution */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Institution ID
            </label>
            <input
              type="text"
              {...register("institution")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
              placeholder="Enter Institution ID"
            />
          </div>

          {/* Department */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Department ID
            </label>
            <input
              type="text"
              {...register("department")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
              placeholder="Enter Department ID"
            />
          </div>
        </div>
      </div>

      {/* Teacher Info */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
          <FaChalkboardTeacher className="text-purple-600" />
          Teacher Information
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Teacher ID
            </label>
            <input
              type="text"
              {...register("teacherId")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="T-2024-001"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Rank
            </label>
            <select
              {...register("rank")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Select Rank</option>
              {Object.values(TEACHER_RANKS).map((rank) => (
                <option key={rank} value={rank}>
                  {rank}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Office Hours */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Office Hours</h2>
          <button
            type="button"
            onClick={() => append({ day: "", timeRange: "", room: "" })}
            className="text-sm font-medium text-orange-600 hover:text-orange-700"
          >
            + Add Slot
          </button>
        </div>

        <div className="space-y-3">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex items-end gap-3 border-b pb-4 last:border-0"
            >
              <div className="flex-1">
                <label className="mb-1 block text-xs text-gray-500">Day</label>
                <select
                  {...register(`officeHours.${index}.day`)}
                  className="w-full rounded border p-1.5 text-sm"
                >
                  <option value="">Select</option>
                  {DAYS_OF_WEEK.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-[2]">
                <label className="mb-1 block text-xs text-gray-500">Time</label>
                <input
                  type="text"
                  {...register(`officeHours.${index}.timeRange`)}
                  className="w-full rounded border p-1.5 text-sm"
                  placeholder="10:00 - 12:00"
                />
              </div>
              <div className="flex-1">
                <label className="mb-1 block text-xs text-gray-500">Room</label>
                <input
                  type="text"
                  {...register(`officeHours.${index}.room`)}
                  className="w-full rounded border p-1.5 text-sm"
                />
              </div>
              <button
                type="button"
                onClick={() => remove(index)}
                className="mb-1.5 text-red-500"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!isDirty || isPending}
          className="rounded-lg bg-purple-600 px-8 py-2.5 font-medium text-white transition-colors hover:bg-purple-700 disabled:bg-gray-400"
        >
          {isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
};

// ====================================
// MAIN COMPONENT
// ====================================

const AcademicTab: React.FC<AcademicTabProps> = ({ user }) => {
  if (user.userType === USER_TYPES.STUDENT) return <StudentForm user={user} />;
  if (user.userType === USER_TYPES.TEACHER) return <TeacherForm user={user} />;
  return (
    <div className="p-6 text-center text-gray-500">
      Account type not supported for academic info.
    </div>
  );
};

export default AcademicTab;


