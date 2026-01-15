import React from "react";
import { mockSavedCategories } from "./data/savedData";

interface SavedCategoriesProps {
  activeCategory?: string;
  onCategoryChange?: (categoryId: string) => void;
}

const SavedCategories: React.FC<SavedCategoriesProps> = ({
  activeCategory = "all",
  onCategoryChange,
}) => {
  const handleCategoryClick = (categoryId: string) => {
    onCategoryChange?.(categoryId);
  };

  return (
    <div className="rounded-lg border border-gray-400 bg-white p-4 shadow">
      <div className="flex flex-wrap gap-2">
        {mockSavedCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={`flex items-center space-x-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              activeCategory === category.id
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <span>{category.label}</span>
            <span className="rounded-full bg-white px-2 py-1 text-xs text-gray-600">
              {category.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SavedCategories;
