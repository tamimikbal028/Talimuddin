import React from "react";
import { Link } from "react-router-dom";
import confirm from "../../../utils/sweetAlert";

// TODO: Replace with API types
type Room = {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  privacy: "public" | "private";
  university?: string;
  department?: string;
  year?: string;
  semester?: string;
  section?: string;
  subsection?: string;
  lastActivityAt?: string;
};

type UserData = {
  id: string;
  name: string;
  username: string;
  avatar?: string;
};

interface Props {
  room: Room;
  creator?: {
    id?: string;
    name?: string;
    username?: string;
    avatar?: string;
  };
  admins?: string[];
  memberCount?: number;
  users: UserData[];
  currentUserId?: string;
  roomId?: string;
  onDeleteRoom?: (id: string) => void;
}

const AboutTab: React.FC<Props> = ({
  room,
  creator,
  admins = [],
  memberCount = 0,
  users,
  currentUserId,
  roomId,
  onDeleteRoom,
}) => {
  const handleDelete = async () => {
    if (!roomId || !onDeleteRoom) return;
    const ok = await confirm({
      title: "Delete room?",
      text: "This will mark the room as deleted and remove it from lists.",
      confirmButtonText: "Delete",
      icon: "warning",
    });
    if (!ok) return;
    onDeleteRoom(roomId);
  };

  const isCreator =
    !!creator?.id && !!currentUserId && creator.id === currentUserId;

  return (
    <div className="space-y-6">
      {/* Creator/Owner Section */}
      {creator && (
        <div>
          <h3 className="mb-3 font-bold text-gray-900">Creator</h3>
          <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
            <img
              src={creator.avatar}
              alt={creator.name}
              className="h-12 w-12 rounded-full object-cover"
            />
            <div className="flex-1">
              <Link
                to={`/profile/${creator.id}`}
                className="font-semibold text-gray-900 hover:text-blue-600 hover:underline"
              >
                {creator.name}
              </Link>
              {/* username hidden */}
            </div>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
              Creator
            </span>
          </div>
        </div>
      )}

      {/* Admins Section */}
      {admins.length > 0 && (
        <div>
          <h3 className="mb-3 font-bold text-gray-900">
            Admins ({admins.length})
          </h3>
          <div className="space-y-2">
            {admins.map((adminId) => {
              const admin = users.find((u) => u.id === adminId);
              if (!admin) return null;

              const isCreatorAdmin = adminId === creator?.id;

              return (
                <div
                  key={adminId}
                  className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3"
                >
                  <img
                    src={admin.avatar}
                    alt={admin.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <Link
                      to={`/profile/${admin.id}`}
                      className="font-semibold text-gray-900 hover:text-blue-600 hover:underline"
                    >
                      {admin.name}
                    </Link>
                    <p className="text-sm text-gray-500">
                      {/* username hidden */}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {isCreatorAdmin && (
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                        Creator
                      </span>
                    )}
                    <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
                      Admin
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Room Stats */}
      <div>
        <h3 className="mb-3 font-bold text-gray-900">Room Stats</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <p className="text-2xl font-bold text-gray-900">{memberCount}</p>
            <p className="text-sm text-gray-600">Members</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <p className="text-2xl font-bold text-gray-900">{admins.length}</p>
            <p className="text-sm text-gray-600">Admins</p>
          </div>
        </div>
      </div>

      {/* Room Details */}
      {(room.university || room.department || room.year || room.semester) && (
        <div>
          <h3 className="mb-3 font-bold text-gray-900">Room Details</h3>
          <div className="space-y-2 rounded-lg border border-gray-200 bg-gray-50 p-4">
            {room.university && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  University:
                </span>
                <span className="text-sm text-gray-900">{room.university}</span>
              </div>
            )}
            {room.department && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Department:
                </span>
                <span className="text-sm text-gray-900">{room.department}</span>
              </div>
            )}
            {room.year && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Year:</span>
                <span className="text-sm text-gray-900">{room.year}</span>
              </div>
            )}
            {room.semester && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Semester:
                </span>
                <span className="text-sm text-gray-900">{room.semester}</span>
              </div>
            )}
            {room.section && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Section:
                </span>
                <span className="text-sm text-gray-900">{room.section}</span>
              </div>
            )}
            {room.subsection && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Subsection:
                </span>
                <span className="text-sm text-gray-900">{room.subsection}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Created Date */}
      {room.createdAt && (
        <div>
          <h3 className="mb-2 font-bold text-gray-900">Created</h3>
          <p className="text-gray-700">
            {new Date(room.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      )}

      {/* Last Activity */}
      {room.lastActivityAt && (
        <div>
          <h3 className="mb-2 font-bold text-gray-900">Last Activity</h3>
          <p className="text-gray-700">
            {new Date(room.lastActivityAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      )}

      {/* Delete Room Button (Only for creator) */}
      {isCreator && onDeleteRoom && (
        <div className="border-t border-gray-200 pt-4">
          <h3 className="mb-3 font-bold text-red-600">Danger Zone</h3>
          <button
            onClick={handleDelete}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
          >
            Delete Room
          </button>
          <p className="mt-2 text-xs text-gray-500">
            This action cannot be undone. The room will be permanently deleted.
          </p>
        </div>
      )}
    </div>
  );
};

export default AboutTab;
