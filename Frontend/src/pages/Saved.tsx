import React, { useState } from "react";
import { FaBookmark, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { mockSavedItems } from "../components/Saved/data/savedData";
import SavedCategories from "../components/Saved/SavedCategories";
import SavedItemCard from "../components/Saved/SavedItemCard";

const Saved: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("all");
  const savedItems = mockSavedItems;

  const handleView = (id: string) => {
    // TODO: Implement view item logic
    console.log("Viewing saved item:", id);
  };

  const handleRemove = (id: string) => {
    // TODO: Implement remove item logic
    console.log("Removing saved item:", id);
  };

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    // TODO: Filter items by category
    console.log("Category changed:", categoryId);
  };

  return (
    <>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            title="Go back"
            className="rounded-lg border border-gray-300 p-2 text-gray-600 transition-colors hover:bg-gray-200"
          >
            <FaArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="mb-2 text-2xl font-bold text-gray-900">Saved Items</h1>
        </div>
      </div>

      {/* Categories Filter */}
      <SavedCategories
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
      />

      {/* Saved Items Grid */}
      <div className="rounded-lg border border-gray-400 bg-white p-5 shadow">
        {savedItems.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {savedItems.map((item) => (
              <SavedItemCard
                key={item.id}
                item={item}
                onView={handleView}
                onRemove={handleRemove}
              />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <FaBookmark className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              No saved items
            </h3>
            <p className="text-gray-600">
              Start saving posts, videos, and articles to view them here later!
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default Saved;
