import React from "react";

const AIWelcomeContent: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="text-center">
        {/* Simple Welcome Message */}
        <h3 className="mb-2 text-2xl font-bold text-gray-800">
          Study Helper AI
        </h3>
        <p className="text-gray-500">How can I help you today?</p>
      </div>
    </div>
  );
};

export default AIWelcomeContent;
