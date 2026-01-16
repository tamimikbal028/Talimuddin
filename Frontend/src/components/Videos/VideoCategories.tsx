import React from "react";

interface VideoCategoriesProps {
  categories: string[];
  selectedCategory?: string;
  onCategorySelect?: (category: string) => void;
}

const VideoCategories: React.FC<VideoCategoriesProps> = ({
  categories,
  selectedCategory = "All",
  onCategorySelect,
}) => {
  return (
    <div className="mb-6 flex items-center space-x-2 overflow-x-auto pb-2">
      {categories.map((category) => {
        const isActive = selectedCategory === category;

        return (
          <button
            key={category}
            onClick={() => onCategorySelect?.(category)}
            className={`rounded-full px-3 py-2 whitespace-nowrap transition-all ${
              isActive
                ? "bg-blue-500 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <span className="text-sm font-medium">{category}</span>
          </button>
        );
      })}
    </div>
  );
};

export default VideoCategories;
