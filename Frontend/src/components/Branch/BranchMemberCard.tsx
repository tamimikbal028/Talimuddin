import { NavLink } from "react-router-dom";
import { BsThreeDots } from "react-icons/bs";
import { FaUserShield, FaUserMinus } from "react-icons/fa";
import { branchHooks } from "../../hooks/useBranch";
import confirm from "../../utils/sweetAlert";
import { useDropdown } from "../../hooks/useDropdown";
import type { BranchMember } from "../../types";

interface BranchMemberCardProps {
  member: BranchMember;
  isPendingRequest?: boolean;
}

const BranchMemberCard = ({
  member,
  isPendingRequest = false,
}: BranchMemberCardProps) => {
  const { user, meta, isAdmin } = member;
  const {
    isOpen: showMenu,
    openUpward,
    menuRef,
    triggerRef: buttonRef,
    toggle: toggleMenu,
    close: closeMenu,
  } = useDropdown();

  const { mutate: removeMember } = branchHooks.useRemoveBranchMember();
  const { mutate: promoteMember } = branchHooks.usePromoteBranchMember();
  const { mutate: demoteMember } = branchHooks.useDemoteBranchMember();

  const canManage = meta.canManage;

  const handleRemove = async () => {
    closeMenu();
    const ok = await confirm({
      title: "Remove Member?",
      text: `${user.fullName} will be removed from this branch.`,
      confirmButtonText: "Yes, remove",
      icon: "warning",
    });
    if (ok) {
      removeMember({ userId: user._id });
    }
  };

  const handlePromote = async () => {
    closeMenu();
    const ok = await confirm({
      title: "Make Admin?",
      text: `${user.fullName} will be promoted to admin.`,
      confirmButtonText: "Yes, promote",
      icon: "info",
    });
    if (ok) {
      promoteMember({ userId: user._id });
    }
  };

  const handleDemote = async () => {
    closeMenu();
    const ok = await confirm({
      title: "Demote Admin?",
      text: `${user.fullName} will be demoted to member.`,
      confirmButtonText: "Yes, demote",
      icon: "warning",
    });
    if (ok) {
      demoteMember({ userId: user._id });
    }
  };

  const renderActions = () => {
    if (isPendingRequest) {
      // Pending request logic removal
      return null;
    }
  };

  const institutionName = user.institution?.name || "No Institution";

  const getRoleBadge = () => {
    if (isAdmin) {
      return (
        <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
          Admin
        </span>
      );
    }
    return null;
  };

  return (
    <div
      className={`flex items-center space-x-3 rounded-lg border p-2 shadow-sm ${
        meta.isSelf ? "border-blue-200 bg-blue-50" : "border-gray-300 bg-white"
      }`}
    >
      <NavLink to={`/profile/${user.userName}`}>
        <img
          src={user.avatar}
          alt={user.fullName}
          className="h-10 w-10 rounded-full object-cover transition-opacity hover:opacity-80"
        />
      </NavLink>
      <div className="flex-1">
        <h3 className="flex items-center">
          <NavLink
            to={`/profile/${user.userName}`}
            className="font-medium text-gray-800 transition-colors hover:text-blue-600 hover:underline"
          >
            {user.fullName}
          </NavLink>
          {getRoleBadge()}
        </h3>
        <p className="text-sm font-medium text-gray-500">{institutionName}</p>
      </div>
      <div className="flex items-center gap-2">
        {renderActions()}

        {/* 3-dot dropdown menu */}
        {canManage && (
          <div className="relative" ref={menuRef}>
            <button
              ref={buttonRef}
              onClick={toggleMenu}
              className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-200"
              title="More actions"
            >
              <BsThreeDots className="h-5 w-5" />
            </button>

            {showMenu && (
              <div
                className={`absolute right-0 z-50 w-52 rounded-lg border border-gray-200 bg-white shadow-lg ${
                  openUpward ? "bottom-full mb-1" : "top-full mt-1"
                } animate-in fade-in zoom-in duration-200`}
              >
                <div className="py-1">
                  {!isAdmin && (
                    <button
                      onClick={handlePromote}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      <FaUserShield className="h-4 w-4 flex-shrink-0 text-blue-500" />
                      <span className="font-medium">Make Admin</span>
                    </button>
                  )}
                  {isAdmin && (
                    <button
                      onClick={handleDemote}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      <FaUserMinus className="h-4 w-4 flex-shrink-0 text-orange-500" />
                      <span className="font-medium">Demote to Member</span>
                    </button>
                  )}

                  {/* Remove action */}
                  <button
                    onClick={handleRemove}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-orange-600 transition-colors hover:bg-gray-50"
                  >
                    <FaUserMinus className="h-4 w-4 flex-shrink-0" />
                    <span className="font-medium">Remove from Branch</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BranchMemberCard;
