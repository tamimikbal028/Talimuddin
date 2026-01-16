import React from "react";
import type { Restaurant } from "../data/achievementsData";

interface PartnerRestaurantsProps {
  restaurants: Restaurant[];
}

const PartnerRestaurants: React.FC<PartnerRestaurantsProps> = ({
  restaurants,
}) => {
  return (
    <div className="rounded-lg bg-white p-5 shadow">
      <h3 className="mb-3 text-xl font-bold text-gray-900">
        🍽️ Partner Restaurants
      </h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {restaurants.map((restaurant) => (
          <div
            key={restaurant.id}
            className="group rounded-lg border border-gray-200 bg-blue-50 p-3 transition-all hover:border-blue-400 hover:shadow-lg"
          >
            <div className="mb-3 flex h-15 w-15 items-center justify-center rounded-full bg-blue-100 text-4xl">
              {restaurant.logo}
            </div>
            <h4 className="text-lg font-bold text-gray-900">
              {restaurant.name}
            </h4>
            <p className="mt-2 text-sm text-gray-600">
              {restaurant.description}
            </p>
            <div className="mt-3 flex items-center gap-1 text-sm text-gray-500">
              <span>📍</span>
              <span>{restaurant.location}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PartnerRestaurants;
