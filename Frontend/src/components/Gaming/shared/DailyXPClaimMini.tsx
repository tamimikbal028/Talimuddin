import React, { useState, useEffect } from "react";
import { FaGift, FaTrophy } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface DailyXPClaimMiniProps {
  userXP?: number;
  lastClaimDate?: string | null;
  onClaim?: () => void;
}

const DailyXPClaimMini: React.FC<DailyXPClaimMiniProps> = ({
  userXP = 0,
  lastClaimDate = null,
  onClaim,
}) => {
  const navigate = useNavigate();

  const [canClaim, setCanClaim] = useState(false);

  // Check if user can claim today
  useEffect(() => {
    const checkClaimAvailability = () => {
      const today = new Date().toDateString();
      const lastClaim = lastClaimDate
        ? new Date(lastClaimDate).toDateString()
        : null;

      // Can claim if never claimed OR last claim was not today
      setCanClaim(!lastClaim || lastClaim !== today);
    };

    checkClaimAvailability();
    // Check every minute
    const interval = setInterval(checkClaimAvailability, 60000);
    return () => clearInterval(interval);
  }, [lastClaimDate]);

  const handleClaim = () => {
    // TODO: Replace with API call
    onClaim?.();
  };

  // Don't show if already claimed
  if (!canClaim) {
    return null;
  }

  return (
    <div className="relative overflow-hidden rounded-lg border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-4">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center gap-2">
          <FaGift className="text-lg text-blue-600" />
          <h3 className="font-semibold text-gray-800">Daily XP Reward</h3>
        </div>

        {/* XP Info */}
        <div className="flex items-center justify-between rounded-lg bg-white p-3">
          <div>
            <p className="text-xs text-gray-500">Available Reward</p>
            <p className="text-lg font-bold text-blue-600">+10 XP</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Your XP</p>
            <p className="text-lg font-bold text-gray-800">{userXP}</p>
          </div>
        </div>

        {/* Claim Button */}
        <button
          onClick={handleClaim}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 font-semibold text-white shadow transition-all hover:bg-blue-700 active:scale-95"
        >
          <FaGift />
          Claim Now
        </button>

        {/* Go to Tournament Button */}
        <button
          onClick={() => navigate("/gaming/tournament")}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-blue-300 bg-white py-2 font-medium text-blue-600 transition-all hover:border-blue-400 hover:bg-blue-50 active:scale-95"
        >
          <FaTrophy />
          View Tournament
        </button>
      </div>
    </div>
  );
};

export default DailyXPClaimMini;
