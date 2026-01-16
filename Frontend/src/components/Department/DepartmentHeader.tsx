import React from "react";
import {
  FaArrowLeft,
  FaCheck,
  FaEllipsisV,
  FaPencilAlt,
  FaGraduationCap,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import type { Department, DepartmentMeta } from "../../types";
import { FOLLOW_TARGET_MODELS } from "../../constants";
import { useDropdown } from "../../hooks/useDropdown";
import { useToggleFollowDepartment } from "../../hooks/useDepartment";
import DepartmentNavBar from "./DepartmentNavBar";

interface DepartmentHeaderProps {
  department: Department;
  meta: DepartmentMeta;
}

const DepartmentHeader: React.FC<DepartmentHeaderProps> = ({
  department,
  meta,
}) => {
  const navigate = useNavigate();
  const { deptId } = useParams<{ deptId: string }>();

  const {
    isOpen: showMenu,
    openUpward,
    menuRef,
    triggerRef: buttonRef,
    toggle: toggleMenu,
    close: closeMenu,
  } = useDropdown();

  const { mutate: toggleFollow, isPending } = useToggleFollowDepartment();

  const handleFollowClick = () => {
    toggleFollow({
      targetId: department._id,
      targetModel: FOLLOW_TARGET_MODELS.DEPARTMENT,
    });
  };

  return (
    <div className="relative">
      {/* Top Info Bar */}
      <div className="bg-white px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3">
          {/* Logo - Smaller */}
          <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border-2 border-gray-200 bg-gray-100">
            {department.logo ? (
              <img
                src={department.logo}
                alt={department.name}
                className="h-full w-full object-contain"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-blue-600">
                <FaGraduationCap className="h-6 w-6" />
              </div>
            )}
          </div>

          {/* Department Name - Can wrap to next line */}
          <h1 className="flex-1 text-lg font-bold text-gray-900">
            {department.name}
          </h1>

          {/* Follow Button - Stays on same line as logo */}
          <button
            onClick={handleFollowClick}
            disabled={isPending}
            className={`flex flex-shrink-0 items-center gap-2 rounded-lg px-5 py-2 font-semibold transition ${
              meta.isFollowing
                ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                : "bg-blue-600 text-white hover:bg-blue-700"
            } disabled:opacity-50`}
          >
            {meta.isFollowing && <FaCheck />}
            {meta.isFollowing ? "Following" : "Follow"}
          </button>
        </div>
      </div>

      {/* Cover Image with Floating Elements */}
      <div className="relative h-64 w-full overflow-hidden md:h-80">
        <img
          src={department.coverImage}
          alt={department.name}
          className="h-full w-full object-cover"
        />

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/50"
        >
          <FaArrowLeft />
        </button>

        {/* 3-Dot Menu Button */}
        <div className="absolute top-4 right-4" ref={menuRef}>
          <button
            ref={buttonRef}
            onClick={toggleMenu}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/50"
          >
            <FaEllipsisV className="h-5 w-5" />
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <div
              className={`absolute right-0 z-50 w-56 rounded-lg border border-gray-200 bg-white shadow-lg ${
                openUpward ? "bottom-full mb-1" : "top-full mt-1"
              }`}
            >
              <div className="py-1">
                <button
                  onClick={() => {
                    closeMenu();
                    navigate(`/departments/${deptId}/edit`);
                  }}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <FaPencilAlt className="h-4 w-4 flex-shrink-0 text-gray-400" />
                  <span className="font-medium">Edit Department</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Stats Section - Floating at Bottom */}
        <div className="absolute right-4 bottom-4 left-4">
          <div className="rounded-lg bg-white/70 px-4 py-3 shadow-lg backdrop-blur-md">
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm md:justify-start">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-gray-900">
                  {department.postsCount}
                </span>
                <span className="font-medium text-gray-600">
                  {department.postsCount <= 1 ? "Post" : "Posts"}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-gray-900">
                  {department.followersCount}
                </span>
                <span className="font-medium text-gray-600">
                  {department.followersCount <= 1 ? "Follower" : "Followers"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NavBar Section */}
      <div className="bg-white shadow-sm">
        <DepartmentNavBar />
      </div>
    </div>
  );
};

export default DepartmentHeader;
