import React, { useState } from "react";
import {
  mockMarketplaceItems,
  mockMarketplaceCategories,
  type MarketplaceItem,
} from "../components/StudentStore/data/marketplaceData";
import ProductCard from "../components/StudentStore/ProductCard";
import FilterBar from "../components/StudentStore/FilterBar";
import ProductModal from "../components/StudentStore/ProductModal";
import SellModal from "../components/StudentStore/SellModal";

const StudentStore: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("recent");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(
    null
  );
  const [showSellModal, setShowSellModal] = useState(false);
  // Removed viewMode and setViewMode

  // Filter items
  const filteredItems = mockMarketplaceItems.filter((item) => {
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesPrice =
      item.price >= priceRange[0] && item.price <= priceRange[1];
    return matchesCategory && matchesSearch && matchesPrice && item.isAvailable;
  });

  // Sort items
  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.seller.rating - a.seller.rating;
      case "popular":
        return b.seller.rating - a.seller.rating;
      default:
        return (
          new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
        );
    }
  });

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Student Store</h1>
        <p className="mt-2 text-gray-600">
          Buy and sell textbooks, notes, electronics, and more
        </p>
      </div>

      {/* Filter Bar */}
      <FilterBar
        categories={mockMarketplaceCategories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortBy={sortBy}
        setSortBy={setSortBy}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        // Removed viewMode, setViewMode, and onSellClick
      />

      {/* Results Count */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {sortedItems.length} of {mockMarketplaceItems.length} items
        </p>
        {selectedCategory !== "all" && (
          <button
            onClick={() => setSelectedCategory("all")}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Products Grid (always 3 columns) */}
      {sortedItems.length > 0 ? (
        <div className="grid grid-cols-2 gap-3">
          {sortedItems.map((item) => (
            <ProductCard
              key={item.id}
              item={item}
              onItemClick={setSelectedItem}
            />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <div className="mx-auto max-w-md">
            <h3 className="text-lg font-medium text-gray-900">
              No items found
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Try adjusting your search or filters to find what you're looking
              for.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
                setPriceRange([0, 100000]);
              }}
              className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
            >
              Clear all filters
            </button>
          </div>
        </div>
      )}

      {/* Product Details Modal */}
      <ProductModal
        item={selectedItem}
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
      />

      {/* Sell Modal */}
      <SellModal
        isOpen={showSellModal}
        onClose={() => setShowSellModal(false)}
        categories={mockMarketplaceCategories}
      />
    </div>
  );
};

export default StudentStore;
