import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaUser,
  FaGraduationCap,
  FaBriefcase,
  FaGlobe,
  FaHeart,
  FaLightbulb,
  FaBuilding,
} from "react-icons/fa";
import { authHooks } from "../../hooks/useAuth";
import { profileHooks } from "../../hooks/useProfile";
import PageLoader from "../Fallbacks/PageLoader";
import { USER_TYPES } from "../../constants";

interface OfficeHour {
  day: string;
  timeRange: string;
  room?: string;
}

const ProfileDetails: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = authHooks.useUser();

  const profileUsername = username || currentUser?.userName;
  const { data, isLoading, error } = profileHooks.useProfileDetails(profileUsername);
  const user = data?.user;

  if (isLoading) return <PageLoader />;

  if (error || !user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900">User Not Found</h2>
          <button
            onClick={() => navigate(-1)}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            <FaArrowLeft /> Go Back
          </button>
        </div>
      </div>
    );
  }

  const isStudent = user.userType === USER_TYPES.STUDENT;
  const isTeacher = user.userType === USER_TYPES.TEACHER;

  return (
    <>
      {/* Header */}
      <div className="flex gap-4 rounded-2xl border-2 border-gray-300 bg-white p-4 shadow-md">
        <button
          onClick={() => navigate(-1)}
          className="rounded-full p-3 text-gray-700 transition-colors hover:bg-gray-200"
        >
          <FaArrowLeft className="h-6 w-6" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{user.fullName}</h1>
          <p className="text-sm font-semibold text-gray-600">Profile Details</p>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        {/* Identity */}
        <div className="rounded-2xl border-2 border-gray-300 bg-white p-5 shadow-md">
          <h3 className="mb-4 flex items-center gap-3 text-base font-bold text-gray-800">
            <FaUser className="text-lg text-blue-600" /> Identity
          </h3>
          <div className="space-y-3 text-base">
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span className="font-medium text-gray-600">Full Name</span>
              {user.fullName ? (
                <span className="font-semibold text-gray-900">
                  {user.fullName}
                </span>
              ) : (
                <span className="rounded-md bg-gray-200 px-3 py-1 text-sm font-medium text-gray-600">
                  Not added
                </span>
              )}
            </div>
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span className="font-medium text-gray-600">Username</span>
              {user.userName ? (
                <span className="font-semibold text-gray-900">
                  @{user.userName}
                </span>
              ) : (
                <span className="rounded-md bg-gray-200 px-3 py-1 text-sm font-medium text-gray-600">
                  Not added
                </span>
              )}
            </div>
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span className="font-medium text-gray-600">Email</span>
              {user.email ? (
                <span className="font-semibold text-gray-900">
                  {user.email}
                </span>
              ) : (
                <span className="rounded-md bg-gray-200 px-3 py-1 text-sm font-medium text-gray-600">
                  Not added
                </span>
              )}
            </div>
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span className="font-medium text-gray-600">Phone</span>
              {user.phoneNumber ? (
                <span className="font-semibold text-gray-900">
                  {user.phoneNumber}
                </span>
              ) : (
                <span className="rounded-md bg-gray-200 px-3 py-1 text-sm font-medium text-gray-600">
                  Not added
                </span>
              )}
            </div>
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span className="font-medium text-gray-600">Gender</span>
              {user.gender ? (
                <span className="font-semibold text-gray-900">
                  {user.gender}
                </span>
              ) : (
                <span className="rounded-md bg-gray-200 px-3 py-1 text-sm font-medium text-gray-600">
                  Not added
                </span>
              )}
            </div>
            <div className="flex justify-between py-1">
              <span className="font-medium text-gray-600">Religion</span>
              {user.religion ? (
                <span className="font-semibold text-gray-900">
                  {user.religion}
                </span>
              ) : (
                <span className="rounded-md bg-gray-200 px-3 py-1 text-sm font-medium text-gray-600">
                  Not added
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="rounded-2xl border-2 border-gray-300 bg-white p-5 shadow-md">
          <h3 className="mb-4 flex items-center gap-3 text-base font-bold text-gray-800">
            <FaUser className="text-lg text-blue-600" /> Bio
          </h3>
          {user.bio ? (
            <p className="text-base font-medium text-gray-700">{user.bio}</p>
          ) : (
            <p className="inline-block rounded-md bg-gray-200 px-3 py-1 text-sm font-medium text-gray-600">
              Not added
            </p>
          )}
        </div>

        {/* Social Links */}
        <div className="rounded-2xl border-2 border-gray-300 bg-white p-5 shadow-md">
          <h3 className="mb-4 flex items-center gap-3 text-base font-bold text-gray-800">
            <FaGlobe className="text-lg text-blue-600" /> Social Links
          </h3>
          <div className="space-y-3 text-base">
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span className="font-medium text-gray-600">LinkedIn</span>
              {user.socialLinks?.linkedin ? (
                <span className="font-semibold text-gray-900">
                  {user.socialLinks.linkedin}
                </span>
              ) : (
                <span className="rounded-md bg-gray-200 px-3 py-1 text-sm font-medium text-gray-600">
                  Not added
                </span>
              )}
            </div>
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span className="font-medium text-gray-600">GitHub</span>
              {user.socialLinks?.github ? (
                <span className="font-semibold text-gray-900">
                  {user.socialLinks.github}
                </span>
              ) : (
                <span className="rounded-md bg-gray-200 px-3 py-1 text-sm font-medium text-gray-600">
                  Not added
                </span>
              )}
            </div>
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span className="font-medium text-gray-600">Facebook</span>
              {user.socialLinks?.facebook ? (
                <span className="font-semibold text-gray-900">
                  {user.socialLinks.facebook}
                </span>
              ) : (
                <span className="rounded-md bg-gray-200 px-3 py-1 text-sm font-medium text-gray-600">
                  Not added
                </span>
              )}
            </div>
            <div className="flex justify-between py-1">
              <span className="font-medium text-gray-600">Website</span>
              {user.socialLinks?.website ? (
                <span className="font-semibold text-gray-900">
                  {user.socialLinks.website}
                </span>
              ) : (
                <span className="rounded-md bg-gray-200 px-3 py-1 text-sm font-medium text-gray-600">
                  Not added
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="rounded-2xl border-2 border-gray-300 bg-white p-5 shadow-md">
          <h3 className="mb-4 flex items-center gap-3 text-base font-bold text-gray-800">
            <FaLightbulb className="text-lg text-blue-600" /> Skills
          </h3>
          {user.skills && user.skills.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {user.skills.map((skill: string, i: number) => (
                <span
                  key={i}
                  className="rounded-full border border-blue-200 bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-800"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="inline-block rounded-md bg-gray-200 px-3 py-1 text-sm font-medium text-gray-600">
              Not added
            </p>
          )}
        </div>

        {/* Interests */}
        <div className="rounded-2xl border-2 border-gray-300 bg-white p-5 shadow-md">
          <h3 className="mb-4 flex items-center gap-3 text-base font-bold text-gray-800">
            <FaHeart className="text-lg text-blue-600" /> Interests
          </h3>
          {user.interests && user.interests.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {user.interests.map((interest: string, i: number) => (
                <span
                  key={i}
                  className="rounded-full border border-pink-200 bg-pink-100 px-4 py-2 text-sm font-semibold text-pink-800"
                >
                  {interest}
                </span>
              ))}
            </div>
          ) : (
            <p className="inline-block rounded-md bg-gray-200 px-3 py-1 text-sm font-medium text-gray-600">
              Not added
            </p>
          )}
        </div>

        {/* Institution */}
        <div className="rounded-2xl border-2 border-gray-300 bg-white p-5 shadow-md">
          <h3 className="mb-4 flex items-center gap-3 text-base font-bold text-gray-800">
            <FaBuilding className="text-lg text-blue-600" /> Institution
          </h3>
          <div className="space-y-3 text-base">
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span className="font-medium text-gray-600">User Type</span>
              {user.userType ? (
                <span className="font-semibold text-gray-900">
                  {user.userType}
                </span>
              ) : (
                <span className="rounded-md bg-gray-200 px-3 py-1 text-sm font-medium text-gray-600">
                  Not added
                </span>
              )}
            </div>
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span className="font-medium text-gray-600">Institution</span>
              {user.institution?.name ? (
                <span className="font-semibold text-gray-900">
                  {user.institution.name}
                </span>
              ) : (
                <span className="rounded-md bg-gray-200 px-3 py-1 text-sm font-medium text-gray-600">
                  Not added
                </span>
              )}
            </div>
            <div className="flex justify-between border-b border-gray-100 py-1">
              <span className="font-medium text-gray-600">
                Institution Type
              </span>
              {user.institutionType ? (
                <span className="font-semibold text-gray-900">
                  {user.institutionType}
                </span>
              ) : (
                <span className="rounded-md bg-gray-200 px-3 py-1 text-sm font-medium text-gray-600">
                  Not added
                </span>
              )}
            </div>
            <div className="flex justify-between py-1">
              <span className="font-medium text-gray-600">Department</span>
              {user.academicInfo?.department?.name ? (
                <span className="font-semibold text-gray-900">
                  {user.academicInfo.department.name}
                </span>
              ) : (
                <span className="rounded-md bg-gray-200 px-3 py-1 text-sm font-medium text-gray-600">
                  Not added
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Student Info */}
        {isStudent && (
          <div className="rounded-2xl border-2 border-gray-300 bg-white p-5 shadow-md">
            <h3 className="mb-4 flex items-center gap-3 text-base font-bold text-gray-800">
              <FaGraduationCap className="text-lg text-blue-600" /> Student Info
            </h3>
            <div className="space-y-3 text-base">
              <div className="flex justify-between border-b border-gray-100 py-1">
                <span className="font-medium text-gray-600">Student ID</span>
                {user.academicInfo?.studentId ? (
                  <span className="font-semibold text-gray-900">
                    {user.academicInfo.studentId}
                  </span>
                ) : (
                  <span className="rounded-md bg-gray-200 px-3 py-1 text-sm font-medium text-gray-600">
                    Not added
                  </span>
                )}
              </div>
              <div className="flex justify-between border-b border-gray-100 py-1">
                <span className="font-medium text-gray-600">Session</span>
                {user.academicInfo?.session ? (
                  <span className="font-semibold text-gray-900">
                    {user.academicInfo.session}
                  </span>
                ) : (
                  <span className="rounded-md bg-gray-200 px-3 py-1 text-sm font-medium text-gray-600">
                    Not added
                  </span>
                )}
              </div>
              <div className="flex justify-between border-b border-gray-100 py-1">
                <span className="font-medium text-gray-600">Semester</span>
                {user.academicInfo?.currentSemester ? (
                  <span className="font-semibold text-gray-900">
                    {user.academicInfo.currentSemester}
                  </span>
                ) : (
                  <span className="rounded-md bg-gray-200 px-3 py-1 text-sm font-medium text-gray-600">
                    Not added
                  </span>
                )}
              </div>
              <div className="flex justify-between py-1">
                <span className="font-medium text-gray-600">Section</span>
                {user.academicInfo?.section ? (
                  <span className="font-semibold text-gray-900">
                    {user.academicInfo.section}
                  </span>
                ) : (
                  <span className="rounded-md bg-gray-200 px-3 py-1 text-sm font-medium text-gray-600">
                    Not added
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Teacher Info */}
        {isTeacher && (
          <div className="rounded-2xl border-2 border-gray-300 bg-white p-5 shadow-md">
            <h3 className="mb-4 flex items-center gap-3 text-base font-bold text-gray-800">
              <FaBriefcase className="text-lg text-blue-600" /> Teacher Info
            </h3>
            <div className="space-y-3 text-base">
              <div className="flex justify-between border-b border-gray-100 py-1">
                <span className="font-medium text-gray-600">Teacher ID</span>
                {user.academicInfo?.teacherId ? (
                  <span className="font-semibold text-gray-900">
                    {user.academicInfo.teacherId}
                  </span>
                ) : (
                  <span className="rounded-md bg-gray-200 px-3 py-1 text-sm font-medium text-gray-600">
                    Not added
                  </span>
                )}
              </div>
              <div className="flex justify-between py-1">
                <span className="font-medium text-gray-600">Rank</span>
                {user.academicInfo?.rank ? (
                  <span className="font-semibold text-gray-900">
                    {user.academicInfo.rank}
                  </span>
                ) : (
                  <span className="rounded-md bg-gray-200 px-3 py-1 text-sm font-medium text-gray-600">
                    Not added
                  </span>
                )}
              </div>
            </div>
            {user.academicInfo?.officeHours &&
              user.academicInfo.officeHours.length > 0 && (
                <div className="mt-4 border-t-2 border-gray-200 pt-4">
                  <p className="mb-3 text-sm font-semibold text-gray-600">
                    Office Hours
                  </p>
                  {user.academicInfo.officeHours.map(
                    (oh: OfficeHour, i: number) => (
                      <p
                        key={i}
                        className="text-base font-medium text-gray-800"
                      >
                        {oh.day} - {oh.timeRange} {oh.room && `(${oh.room})`}
                      </p>
                    )
                  )}
                </div>
              )}
          </div>
        )}
      </div>
    </>
  );
};

export default ProfileDetails;



