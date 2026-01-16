import React, { useState } from "react";
import { FaTimes, FaTrash, FaCamera } from "react-icons/fa";

interface SellModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Array<{ id: string; name: string; icon: string }>;
}

const SellModal: React.FC<SellModalProps> = ({
  isOpen,
  onClose,
  categories,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    originalPrice: "",
    condition: "good",
    location: "",
    tags: "",
    deliveryOptions: [] as string[],
  });

  const [images, setImages] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleImageAdd = () => {
    // In a real app, this would open file picker
    const newImage = `https://placehold.co/300x300/e2e8f0/64748b?text=Image+${images.length + 1}`;
    setImages([...images, newImage]);
  };

  const handleImageRemove = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleDeliveryOptionChange = (option: string) => {
    const updatedOptions = formData.deliveryOptions.includes(option)
      ? formData.deliveryOptions.filter((o) => o !== option)
      : [...formData.deliveryOptions, option];

    setFormData({ ...formData, deliveryOptions: updatedOptions });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData, images);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white">
        <div className="sticky top-0 flex items-center justify-between border-b bg-white p-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Sell Your Item
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FaTimes className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Photos
            </label>
            <div className="mt-2">
              <div className="grid grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Upload ${index + 1}`}
                      className="h-24 w-full rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleImageRemove(index)}
                      className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                    >
                      <FaTrash className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {images.length < 6 && (
                  <button
                    type="button"
                    onClick={handleImageAdd}
                    className="flex h-24 w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-gray-400 hover:border-gray-400 hover:text-gray-500"
                  >
                    <div className="text-center">
                      <FaCamera className="mx-auto h-6 w-6" />
                      <span className="mt-1 text-xs">Add Photo</span>
                    </div>
                  </button>
                )}
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Add up to 6 photos. First photo will be the cover image.
              </p>
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="What are you selling?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              rows={4}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Describe your item's condition, features, etc."
            />
          </div>

          {/* Price & Condition */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Price (৳)
              </label>
              <input
                type="number"
                required
                min="0"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Original Price (৳)
              </label>
              <input
                type="number"
                min="0"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={formData.originalPrice}
                onChange={(e) =>
                  setFormData({ ...formData, originalPrice: e.target.value })
                }
                placeholder="Optional"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Condition
              </label>
              <select
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={formData.condition}
                onChange={(e) =>
                  setFormData({ ...formData, condition: e.target.value })
                }
              >
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
              </select>
            </div>
          </div>

          {/* Location & Tags */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="e.g., Dhanmondi, Dhaka"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tags
              </label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
                placeholder="Separate with commas"
              />
            </div>
          </div>

          {/* Delivery Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Delivery Options
            </label>
            <div className="mt-2 space-y-2">
              {["pickup", "delivery", "shipping"].map((option) => (
                <label key={option} className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600"
                    checked={formData.deliveryOptions.includes(option)}
                    onChange={() => handleDeliveryOptionChange(option)}
                  />
                  <span className="ml-2 text-sm text-gray-700 capitalize">
                    {option}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex flex-1 justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex flex-1 justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
            >
              List Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellModal;
