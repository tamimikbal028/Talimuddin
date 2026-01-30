import React from "react";
import { Link } from "react-router-dom";
import type { BranchListItem } from "../../types";

type Props = {
  branch: BranchListItem;
};

const BranchCard: React.FC<Props> = ({ branch }) => {
  return (
    <div className="overflow-hidden rounded-lg shadow-sm">
      <Link
        to={`/classroom/branches/${branch._id}`}
        className="relative block h-36 w-full bg-gray-100"
      >
        <img
          src={branch.coverImage}
          alt={branch.name}
          className="h-full w-full object-cover"
        />

        <div className="absolute top-0 left-0 w-full bg-black/85 p-2">
          <p className="truncate font-medium text-white">{branch.name}</p>
        </div>
      </Link>
    </div>
  );
};

export default BranchCard;
