import React from "react";
import { Link } from "react-router-dom";
import type { Potrika } from "../../types";

type Props = {
  potrika: Potrika;
};

const PotrikaCard: React.FC<Props> = ({ potrika }) => {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm transition-transform hover:scale-[1.02]">
      <Link
        to={`/potrika/${potrika._id}`}
        className="relative block h-36 w-full bg-gray-100"
      >
        <img
          src={
            potrika.coverImage || potrika.avatar || "/placeholder-potrika.jpg"
          }
          alt={potrika.name}
          className="h-full w-full object-cover"
        />

        <div className="absolute top-0 left-0 w-full bg-black/70 p-2 backdrop-blur-sm">
          <p className="truncate font-medium text-white">{potrika.name}</p>
        </div>

        {potrika.postsCount > 0 && (
          <div className="absolute right-2 bottom-2 rounded bg-blue-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
            {potrika.postsCount} POSTS
          </div>
        )}
      </Link>
    </div>
  );
};

export default PotrikaCard;
