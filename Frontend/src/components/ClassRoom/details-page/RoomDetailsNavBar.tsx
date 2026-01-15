import { NavLink, useParams } from "react-router-dom";
import { FaUsers, FaFolder, FaInfoCircle } from "react-icons/fa";
import { BsPostcard } from "react-icons/bs";
import type { RoomMeta } from "../../../types";

interface Props {
  meta: RoomMeta;
}

const RoomDetailsNavBar: React.FC<Props> = ({ meta }) => {
  const { roomId } = useParams<{ roomId: string }>();
  const baseUrl = `/classroom/rooms/${roomId}`;

  const tabs = [
    {
      path: baseUrl,
      label: "Posts",
      icon: BsPostcard,
      end: true,
      visible: meta.isMember || meta.isAdmin,
    },
    {
      path: `${baseUrl}/files`,
      label: "Files",
      icon: FaFolder,
      end: true,
      visible: meta.isMember || meta.isAdmin,
    },
    {
      path: `${baseUrl}/members`,
      label: "Members",
      icon: FaUsers,
      end: true,
      visible: meta.isMember || meta.isAdmin,
    },
    {
      path: `${baseUrl}/about`,
      label: "About",
      icon: FaInfoCircle,
      end: true,
      visible: true,
    },
  ];

  return (
    <div className="mt-3">
      <div className="flex items-center justify-around gap-1 px-3">
        {tabs
          .filter((tab) => tab.visible)
          .map((tab) => (
            <NavLink
              key={tab.path}
              to={tab.path}
              end={tab.end}
              className={({ isActive }) =>
                `flex items-center gap-2 border-b-2 px-4 py-4 font-semibold whitespace-nowrap transition-colors ${
                  isActive
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`
              }
            >
              <tab.icon className="h-5 w-5" />
              <span className="hidden sm:inline">{tab.label}</span>
            </NavLink>
          ))}
      </div>
    </div>
  );
};

export default RoomDetailsNavBar;
