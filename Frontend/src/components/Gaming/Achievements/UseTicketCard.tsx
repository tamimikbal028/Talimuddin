import React, { useState } from "react";

// TODO: Replace with API data
interface Restaurant {
  id: string;
  name: string;
  ownerPassword: string;
  logo?: string;
  location?: string;
}

interface UseTicketCardProps {
  ticketId: string;
  onCancel: () => void;
  restaurants?: Restaurant[];
  onApplyTicket?: (data: {
    ticketId: string;
    restaurantId: string;
    billAmount: number;
  }) => void;
}

const UseTicketCard: React.FC<UseTicketCardProps> = ({
  ticketId,
  onCancel,
  restaurants = [],
  onApplyTicket,
}) => {
  const [selectedRestaurant, setSelectedRestaurant] = useState("");
  const [ownerPassword, setOwnerPassword] = useState("");
  const [billAmount, setBillAmount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!selectedRestaurant) {
      setError("Please select a restaurant");
      return;
    }

    if (!ownerPassword) {
      setError("Please enter owner password");
      return;
    }

    if (!billAmount || parseFloat(billAmount) <= 0) {
      setError("Please enter a valid bill amount");
      return;
    }

    // Verify password
    const restaurant = restaurants.find((r) => r.id === selectedRestaurant);
    if (!restaurant) {
      setError("Restaurant not found");
      return;
    }

    if (restaurant.ownerPassword !== ownerPassword) {
      setError("Incorrect owner password");
      return;
    }

    // Use the ticket - TODO: Replace with API call
    onApplyTicket?.({
      ticketId,
      restaurantId: selectedRestaurant,
      billAmount: parseFloat(billAmount),
    });

    setSuccess(true);

    // Close after 2 seconds
    setTimeout(() => {
      onCancel();
    }, 2000);
  };

  if (success) {
    return (
      <div className="rounded-lg border-2 border-green-500 bg-green-50 p-6 text-center">
        <div className="mb-4 text-6xl">✅</div>
        <h2 className="mb-2 text-2xl font-bold text-green-600">
          Ticket Used Successfully!
        </h2>
        <p className="text-gray-600">
          Enjoy your meal at{" "}
          {restaurants.find((r) => r.id === selectedRestaurant)?.name}!
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border-2 border-blue-500 bg-white p-6 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          🎟️ Use Winning Ticket
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Restaurant Selection */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Select Restaurant
          </label>
          <select
            value={selectedRestaurant}
            onChange={(e) => setSelectedRestaurant(e.target.value)}
            className="w-full appearance-none rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
          >
            <option value="">Choose a restaurant...</option>
            {restaurants.map((restaurant) => (
              <option key={restaurant.id} value={restaurant.id}>
                {restaurant.logo} {restaurant.name} - {restaurant.location}
              </option>
            ))}
          </select>
        </div>

        {/* Owner Password */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Restaurant Password
          </label>
          <input
            type="password"
            value={ownerPassword}
            onChange={(e) => setOwnerPassword(e.target.value)}
            placeholder="Enter password provided by owner"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Bill Amount */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Bill Amount /-
          </label>
          <input
            type="number"
            value={billAmount}
            onChange={(e) => setBillAmount(e.target.value)}
            placeholder="Enter total bill amount"
            min="1"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Confirm & Use Ticket
          </button>
        </div>

        {/* Demo Info */}
        <div className="rounded-lg bg-yellow-50 p-3">
          <p className="text-xs text-gray-600">
            <strong>Demo Passwords:</strong> PIZZA2025, KABAB2025, COIVOJ2025
          </p>
        </div>
      </form>
    </div>
  );
};

export default UseTicketCard;
