import React from "react";
import {
  FaHistory,
  FaBookmark,
  FaCog,
  FaQuestionCircle,
  FaRobot,
  FaLightbulb,
} from "react-icons/fa";

interface AISidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const AISidebar: React.FC<AISidebarProps> = ({ isOpen }) => {
  const menuItems = [
    {
      icon: FaHistory,
      label: "Chat History",
      description: "View past conversations",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: FaBookmark,
      label: "Saved Responses",
      description: "Your bookmarked answers",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: FaLightbulb,
      label: "Quick Tips",
      description: "Study tips and tricks",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      icon: FaRobot,
      label: "AI Capabilities",
      description: "What I can help with",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: FaQuestionCircle,
      label: "Help & Support",
      description: "Get assistance",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      icon: FaCog,
      label: "Settings",
      description: "Customize AI preferences",
      color: "text-gray-600",
      bgColor: "bg-gray-50",
    },
  ];

  return (
    <div
      className={`flex h-full flex-col border-r border-gray-200 bg-white transition-all duration-300 ${
        isOpen ? "w-80" : "w-0"
      } overflow-hidden`}
    >
      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                className="flex w-full items-start gap-3 rounded-lg border border-gray-200 bg-white p-3 text-left transition-all hover:border-blue-300 hover:shadow-md"
              >
                <div className={`shrink-0 rounded-lg ${item.bgColor} p-2.5`}>
                  <Icon className={`h-5 w-5 ${item.color}`} />
                </div>
                <div className="flex-1 overflow-hidden">
                  <h4 className="font-semibold text-gray-900">{item.label}</h4>
                  <p className="text-xs text-gray-600">{item.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AISidebar;
