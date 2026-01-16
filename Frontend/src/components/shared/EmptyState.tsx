import React from "react";
import { type IconType } from "react-icons";

interface EmptyStateProps {
  icon: IconType;
  message: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, message }) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-12 text-center shadow-sm">
      <Icon className="mx-auto mb-4 h-16 w-16 text-gray-400" />
      <p className="text-gray-600">{message}</p>
    </div>
  );
};

export default EmptyState;
