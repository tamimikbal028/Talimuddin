import React from "react";

const HowItWorks: React.FC = () => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      <h3 className="mb-4 text-center text-xl font-bold text-gray-900">
        How to Use Your Ticket
      </h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="flex flex-col items-center justify-center rounded-lg bg-gray-50 p-4">
          <div className="mb-2 text-2xl">1️⃣</div>
          <div className="font-semibold text-gray-800">Visit Restaurant</div>
          <div className="mt-1 text-center text-sm text-gray-500">
            Go to any partner restaurant
          </div>
        </div>
        <div className="flex flex-col items-center justify-center rounded-lg bg-gray-50 p-4">
          <div className="mb-2 text-2xl">2️⃣</div>
          <div className="font-semibold text-gray-800">Order Food</div>
          <div className="mt-1 text-center text-sm text-gray-500">
            Place your order and enjoy
          </div>
        </div>
        <div className="flex flex-col items-center justify-center rounded-lg bg-gray-50 p-4">
          <div className="mb-2 text-2xl">3️⃣</div>
          <div className="font-semibold text-gray-800">Use Ticket</div>
          <div className="mt-1 text-center text-sm text-gray-500">
            Click "Use Ticket" at payment time
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
