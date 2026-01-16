import React from "react";
import type { IconType } from "react-icons";

interface GroupEmptyStateProps {
  icon: IconType;
  title: string;
  message: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

const GroupEmptyState: React.FC<GroupEmptyStateProps> = ({
  icon: Icon,
  title,
  message,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 px-6 py-16 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-gray-300 bg-white shadow-sm ring-gray-50">
        <Icon className="h-10 w-10 text-gray-400" />
      </div>
      <h3 className="mb-3 text-xl font-bold text-gray-900">{title}</h3>
      <p className="mb-8 max-w-md text-base leading-relaxed text-gray-500">
        {message}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default GroupEmptyState;
