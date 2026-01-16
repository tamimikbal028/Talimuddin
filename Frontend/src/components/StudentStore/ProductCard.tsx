import React from "react";
import {
  FaHeart,
  FaEye,
  FaStar,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaCheckCircle,
} from "react-icons/fa";
import { type MarketplaceItem } from "./data/marketplaceData";

interface ProductCardProps {
  item: MarketplaceItem;
  // Only grid view supported
  onItemClick: (item: MarketplaceItem) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ item, onItemClick }) => {
  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "excellent":
        return "bg-green-100 text-green-800";
      case "good":
        return "bg-blue-100 text-blue-800";
      case "fair":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Only grid view supported

  // Grid view
  return (
    <div
      onClick={() => onItemClick(item)}
      className="group cursor-pointer rounded-lg border border-gray-200 bg-white transition-all hover:border-blue-300 hover:shadow-lg"
    >
      <div className="relative overflow-hidden rounded-t-lg">
        <img
          src={item.images[0]}
          alt={item.title}
          className="h-48 w-full object-cover transition-transform group-hover:scale-105"
        />
        {item.isFeatured && (
          <span className="absolute top-2 left-2 rounded bg-yellow-500 px-2 py-1 text-xs font-bold text-white">
            Featured
          </span>
        )}
        <div className="absolute top-2 right-2 flex space-x-1">
          <button className="rounded-full bg-white p-2 shadow-md hover:bg-gray-50">
            <FaHeart className="h-4 w-4 text-gray-600" />
          </button>
          <button className="rounded-full bg-white p-2 shadow-md hover:bg-gray-50">
            <FaEye className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-2">
          <h3 className="line-clamp-1 font-semibold text-gray-900">
            {item.title}
          </h3>
          <p className="line-clamp-2 text-sm text-gray-600">
            {item.description}
          </p>
        </div>

        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-green-600">৳{item.price}</p>
            {item.originalPrice && (
              <p className="text-sm text-gray-500 line-through">
                ৳{item.originalPrice}
              </p>
            )}
          </div>
          <span
            className={`rounded px-2 py-1 text-xs font-medium ${getConditionColor(item.condition)}`}
          >
            {item.condition}
          </span>
        </div>

        <div className="mb-3 flex flex-wrap gap-1">
          {item.tags.slice(0, 2).map((tag, index) => (
            <span
              key={index}
              className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800"
            >
              {tag}
            </span>
          ))}
          {item.tags.length > 2 && (
            <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
              +{item.tags.length - 2}
            </span>
          )}
        </div>

        <div className="mb-3 space-y-1 text-xs text-gray-600">
          <div className="flex items-center">
            <FaMapMarkerAlt className="mr-1 h-3 w-3" />
            <span>{item.location}</span>
          </div>
          <div className="flex items-center">
            <FaCalendarAlt className="mr-1 h-3 w-3" />
            <span>{item.postedDate}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img
              src={item.seller.avatar}
              alt={item.seller.name}
              className="mr-2 h-6 w-6 rounded-full"
            />
            <span className="text-sm text-gray-700">{item.seller.name}</span>
            {item.seller.isVerified && (
              <FaCheckCircle className="ml-1 h-3 w-3 text-blue-500" />
            )}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <FaStar className="mr-1 h-3 w-3 text-yellow-500" />
            <span>{item.seller.rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
