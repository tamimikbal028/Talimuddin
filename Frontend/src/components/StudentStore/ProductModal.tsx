import React, { useState } from "react";
import {
  FaTimes,
  FaHeart,
  FaShare,
  FaStar,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaCheckCircle,
  FaPhone,
  FaEnvelope,
  FaTruck,
  FaHandPaper,
  FaShippingFast,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { type MarketplaceItem } from "./data/marketplaceData";

interface ProductModalProps {
  item: MarketplaceItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({
  item,
  isOpen,
  onClose,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!isOpen || !item) return null;

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

  const getDeliveryIcon = (method: string) => {
    switch (method) {
      case "pickup":
        return <FaHandPaper className="h-4 w-4" />;
      case "delivery":
        return <FaTruck className="h-4 w-4" />;
      case "shipping":
        return <FaShippingFast className="h-4 w-4" />;
      default:
        return <FaTruck className="h-4 w-4" />;
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % item.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + item.images.length) % item.images.length
    );
  };

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between border-b bg-white p-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Product Details
          </h2>
          <div className="flex items-center space-x-2">
            <button className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
              <FaHeart className="h-5 w-5" />
            </button>
            <button className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
              <FaShare className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <FaTimes className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Images */}
            <div>
              <div className="relative overflow-hidden rounded-lg">
                <img
                  src={item.images[currentImageIndex]}
                  alt={item.title}
                  className="h-80 w-full object-cover"
                />
                {item.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="bg-opacity-50 hover:bg-opacity-70 absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-black p-2 text-white"
                    >
                      <FaChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="bg-opacity-50 hover:bg-opacity-70 absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-black p-2 text-white"
                    >
                      <FaChevronRight className="h-4 w-4" />
                    </button>
                  </>
                )}
                {item.isFeatured && (
                  <span className="absolute top-2 left-2 rounded bg-yellow-500 px-2 py-1 text-xs font-bold text-white">
                    Featured
                  </span>
                )}
              </div>

              {/* Thumbnail Images */}
              {item.images.length > 1 && (
                <div className="mt-4 flex space-x-2 overflow-x-auto">
                  {item.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded border-2 ${
                        currentImageIndex === index
                          ? "border-blue-500"
                          : "border-gray-200"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${item.title} ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {item.title}
                </h1>
                <p className="mt-2 text-gray-600">{item.description}</p>
              </div>

              {/* Price */}
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold text-green-600">
                  ৳{item.price}
                </span>
                {item.originalPrice && (
                  <span className="text-lg text-gray-500 line-through">
                    ৳{item.originalPrice}
                  </span>
                )}
                {item.originalPrice && (
                  <span className="text-sm font-medium text-green-600">
                    {Math.round(
                      ((item.originalPrice - item.price) / item.originalPrice) *
                        100
                    )}
                    % off
                  </span>
                )}
              </div>

              {/* Condition & Tags */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">
                    Condition:
                  </span>
                  <span
                    className={`rounded px-2 py-1 text-xs font-medium ${getConditionColor(item.condition)}`}
                  >
                    {item.condition}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {item.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Seller Info */}
              <div className="rounded-lg border border-gray-200 p-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={item.seller.avatar}
                    alt={item.seller.name}
                    className="h-12 w-12 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h3 className="font-semibold text-gray-900">
                        {item.seller.name}
                      </h3>
                      {item.seller.isVerified && (
                        <FaCheckCircle className="ml-2 h-4 w-4 text-blue-500" />
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <FaStar className="mr-1 h-3 w-3 text-yellow-500" />
                        <span>
                          {item.seller.rating} ({item.seller.reviewCount}{" "}
                          reviews)
                        </span>
                      </div>
                      <span>Verified Seller</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <FaMapMarkerAlt className="mr-2 h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">
                    Location: {item.location}
                  </span>
                </div>
                <div className="flex items-center">
                  <FaCalendarAlt className="mr-2 h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">
                    Posted: {item.postedDate}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2 text-gray-600">Category:</span>
                  <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-800">
                    {item.category}
                  </span>
                </div>
              </div>

              {/* Delivery Options */}
              <div>
                <h4 className="mb-2 font-medium text-gray-900">
                  Delivery Options:
                </h4>
                <div className="space-y-1">
                  {item.deliveryOptions.map((option, index) => (
                    <div
                      key={index}
                      className="flex items-center text-sm text-gray-600"
                    >
                      {getDeliveryIcon(option)}
                      <span className="ml-2 capitalize">{option}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button className="flex flex-1 items-center justify-center space-x-2 rounded-md bg-blue-600 px-6 py-3 text-white hover:bg-blue-700">
                  <FaEnvelope className="h-4 w-4" />
                  <span>Message Seller</span>
                </button>
                <button className="flex flex-1 items-center justify-center space-x-2 rounded-md bg-green-600 px-6 py-3 text-white hover:bg-green-700">
                  <FaPhone className="h-4 w-4" />
                  <span>Call Now</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
