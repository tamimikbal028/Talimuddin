import React from "react";
import { FaBan } from "react-icons/fa";

interface ProfileBlockedProps {
  fullName: string;
  isBlockedByMe: boolean;
  onUnblock?: () => void;
}

const ProfileBlocked: React.FC<ProfileBlockedProps> = ({
  fullName,
  isBlockedByMe,
  onUnblock,
}) => {
  if (isBlockedByMe) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white p-10 text-center shadow-sm">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-500">
          <FaBan className="h-10 w-10" />
        </div>
        <h2 className="mb-3 text-2xl font-bold text-gray-900">
          You have blocked {fullName}
        </h2>
        <p className="mb-8 max-w-md text-gray-500">
          You've restricted this user. You can't see their updates, and they
          can't interact with you.
        </p>
        {onUnblock && (
          <button
            onClick={onUnblock}
            className="rounded-lg bg-gray-900 px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-gray-800 hover:shadow-md"
          >
            Unblock User
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white p-10 text-center shadow-sm">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-gray-500">
        <FaBan className="h-10 w-10" />
      </div>
      <h2 className="mb-2 text-2xl font-bold text-gray-900">
        User Not Available
      </h2>
      <p className="text-gray-500">
        {fullName} has blocked you. You cannot view this profile.
      </p>
    </div>
  );
};

export default ProfileBlocked;
