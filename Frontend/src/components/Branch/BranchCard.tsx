import React from "react";
import { Link } from "react-router-dom";
import type { RoomListItem } from "../../types";

type Props = {
  room: RoomListItem;
};

const RoomCard: React.FC<Props> = ({ room }) => {
  return (
    <div className="overflow-hidden rounded-lg shadow-sm">
      <Link
        to={`/classroom/rooms/${room._id}`}
        className="relative block h-36 w-full bg-gray-100"
      >
        <img
          src={room.coverImage}
          alt={room.name}
          className="h-full w-full object-cover"
        />

        <div className="absolute top-0 left-0 w-full bg-black/85 p-2">
          <p className="truncate font-medium text-white">{room.name}</p>
          {room.creator && (
            <p className="mt-0.5 truncate text-xs text-gray-200">
              <Link
                onClick={(e) => e.stopPropagation()}
                to={`/profile/${room.creator.userName}`}
                className="font-medium text-blue-300 hover:underline"
              >
                {room.creator.fullName}
              </Link>
            </p>
          )}
        </div>
      </Link>
    </div>
  );
};

export default RoomCard;
