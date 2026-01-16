import React, { useState } from "react";
import {
  FaSearch,
  FaBars,
  FaArrowLeft,
  FaUser,
  FaUsers,
  FaUniversity,
  FaGlobe,
} from "react-icons/fa";
import {
  mockConversations,
  directMessages,
  groupChats,
  universityGroups,
  globalChats,
} from "./data/messagesData";

type FilterType = "all" | "direct" | "group" | "university" | "global";

interface ConversationListProps {
  selectedConversation?: string;
  onSelectConversation?: (id: string) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  selectedConversation: propSelectedConversation,
  onSelectConversation,
}) => {
  // TODO: Replace with local state or API data
  const [selectedConversation, setSelectedConversation] = useState(
    propSelectedConversation || ""
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const handleSelectConversation = (id: string) => {
    setSelectedConversation(id);
    onSelectConversation?.(id);
  };

  // Filter conversations based on active filter and search
  const getFilteredConversations = () => {
    let conversations = mockConversations;

    // Filter by type
    if (activeFilter === "direct") {
      conversations = directMessages;
    } else if (activeFilter === "group") {
      conversations = groupChats;
    } else if (activeFilter === "university") {
      conversations = universityGroups;
    } else if (activeFilter === "global") {
      conversations = globalChats;
    }

    // Filter by search query
    if (searchQuery) {
      conversations = conversations.filter((conv) =>
        conv.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort by time (most recent first)
    return conversations.slice().sort((a, b) => {
      const timeToMinutes = (time: string): number => {
        if (time.includes("m")) return parseInt(time);
        if (time.includes("h")) return parseInt(time) * 60;
        if (time.includes("d")) return parseInt(time) * 1440;
        if (time.includes("w")) return parseInt(time) * 10080;
        return 0;
      };
      return timeToMinutes(a.time) - timeToMinutes(b.time);
    });
  };

  const filteredConversations = getFilteredConversations();

  const chatTypes = [
    {
      id: "all" as FilterType,
      label: "All Messages",
      icon: FaBars,
      color: "text-gray-600",
      bgColor: "bg-gray-100",
    },
    {
      id: "direct" as FilterType,
      label: "Direct Messages",
      icon: FaUser,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      id: "university" as FilterType,
      label: "University Groups",
      icon: FaUniversity,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      id: "group" as FilterType,
      label: "Group Chats",
      icon: FaUsers,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      id: "global" as FilterType,
      label: "Global Chat",
      icon: FaGlobe,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  const handleChatTypeClick = (typeId: FilterType) => {
    setActiveFilter(typeId);
    setShowMenu(false);
  };

  return (
    <div className="flex w-70 flex-col border-r border-gray-200">
      {/* Search */}
      <div className="flex h-15 items-center gap-3 border-b border-gray-200 px-4">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="cursor-pointer text-gray-600 hover:text-gray-900 focus:outline-none"
        >
          {showMenu ? (
            <FaArrowLeft className="h-5 w-5" />
          ) : (
            <FaBars className="h-5 w-5" />
          )}
        </button>
        <div className="relative flex-1">
          <FaSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Menu or Conversations */}
      {showMenu ? (
        // Chat Type Menu
        <div className="flex-1 overflow-y-auto p-3">
          <div className="space-y-3">
            {chatTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => handleChatTypeClick(type.id)}
                  className="flex w-full items-center gap-4 rounded-lg border border-gray-200 bg-white p-3 text-left transition-all hover:border-blue-300 hover:shadow-md"
                >
                  <div className={`rounded-lg ${type.bgColor} p-3`}>
                    <Icon className={`h-5 w-5 ${type.color}`} />
                  </div>
                  <h4 className="font-semibold text-gray-900">{type.label}</h4>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        // Conversations List
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => dispatch(setSelectedConversation(conv.id))}
              className={`flex cursor-pointer items-center gap-3 border-b border-gray-100 p-4 transition-colors hover:bg-gray-50 ${
                selectedConversation === conv.id ? "bg-blue-50" : ""
              }`}
            >
              <div className="relative">
                <img
                  src={conv.avatar}
                  alt={conv.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                {conv.online && (
                  <div className="absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-white bg-green-500"></div>
                )}
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">{conv.name}</h3>
                  <span className="text-xs text-gray-500">{conv.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="truncate text-sm text-gray-600">
                    {conv.lastMessage}
                  </p>
                  {conv.unread && (
                    <span className="ml-2 flex min-w-[20px] items-center justify-center rounded-full bg-blue-600 px-0.5 py-0.5 text-xs text-white">
                      {conv.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConversationList;
