import React from "react";
import { FaImage, FaVideo, FaLink } from "react-icons/fa";
import type { SavedItem } from "./data/savedData";

interface SavedItemCardProps {
  item: SavedItem;
  onView?: (id: string) => void;
  onRemove?: (id: string) => void;
}

const SavedItemCard: React.FC<SavedItemCardProps> = ({
  item,
  onView,
  onRemove,
}) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <FaVideo className="h-4 w-4 text-red-500" />;
      case "article":
        return <FaLink className="h-4 w-4 text-blue-500" />;
      case "post":
        return <FaImage className="h-4 w-4 text-green-500" />;
      default:
        return <FaImage className="h-4 w-4 text-green-500" />;
    }
  };

  const handleView = () => {
    onView?.(item.id);
  };

  const handleRemove = () => {
    onRemove?.(item.id);
  };

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 transition-shadow hover:shadow-md">
      {/* Thumbnail */}
      <div className="relative">
        <img
          src={item.thumbnail}
          alt={item.title}
          className="h-40 w-full object-cover"
        />
        {item.duration && (
          <div className="bg-opacity-75 absolute right-2 bottom-2 rounded bg-black px-2 py-1 text-xs text-white">
            {item.duration}
          </div>
        )}
        <div className="absolute top-2 left-2">{getTypeIcon(item.type)}</div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img
              src={item.authorAvatar}
              alt={item.author}
              className="h-6 w-6 rounded-full"
            />
            <span className="text-sm text-gray-600">{item.author}</span>
          </div>
          <span className="text-xs text-gray-400">{item.savedDate}</span>
        </div>

        <h3 className="mb-2 line-clamp-2 font-semibold text-gray-900">
          {item.title}
        </h3>

        <p className="mb-4 line-clamp-2 text-sm text-gray-600">
          {item.description}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleView}
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View
          </button>
          <button
            onClick={handleRemove}
            className="text-sm font-medium text-red-600 hover:text-red-700"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default SavedItemCard;
