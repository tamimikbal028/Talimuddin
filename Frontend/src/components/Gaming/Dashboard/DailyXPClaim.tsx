import React, { useState, useEffect } from "react";
import { FaGift, FaClock, FaTrophy, FaCoins } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

interface DailyXPClaimProps {
  userXP?: number;
  lastClaimDate?: string | null;
  onClaim?: () => void;
}

const DailyXPClaim: React.FC<DailyXPClaimProps> = ({
  userXP = 0,
  lastClaimDate = null,
  onClaim,
}) => {
  const navigate = useNavigate();

  const [canClaim, setCanClaim] = useState(false);
  const [timeUntilMidnight, setTimeUntilMidnight] = useState("");

  // Check if user can claim today
  useEffect(() => {
    const checkClaimAvailability = () => {
      const today = dayjs().format("YYYY-MM-DD");
      const lastClaim = lastClaimDate
        ? dayjs(lastClaimDate).format("YYYY-MM-DD")
        : null;

      // Can claim if never claimed OR last claim was not today
      setCanClaim(!lastClaim || lastClaim !== today);
    };

    checkClaimAvailability();
    // Check every minute in case they're waiting for midnight
    const interval = setInterval(checkClaimAvailability, 60000);
    return () => clearInterval(interval);
  }, [lastClaimDate]);

  // Calculate time until midnight
  useEffect(() => {
    const updateCountdown = () => {
      const now = dayjs();
      const midnight = dayjs().endOf("day");

      const totalSeconds = midnight.diff(now, "second");
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setTimeUntilMidnight(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleClaim = () => {
    // TODO: Replace with API call
    onClaim?.();
  };

  const rewards = [
    {
      icon: FaGift,
      label: "Daily Reward",
      value: "10 XP",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      icon: FaCoins,
      label: "Your XP",
      value: `${userXP} XP`,
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
    },
  ];

  return (
    <div className="relative space-y-3 overflow-hidden rounded-lg border border-gray-200 bg-white p-3 shadow">
      {/* Header with Stats */}
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-1">
          <h3 className="mb-1 text-2xl font-bold text-blue-600">
            Daily XP Claim
          </h3>

          {canClaim && (
            <p className="text-sm font-medium text-orange-700">
              Claim expires at midnight ({timeUntilMidnight} remaining)
            </p>
          )}
        </div>
        <div className="flex gap-3">
          {rewards.map((item, index) => (
            <div
              key={index}
              className={`rounded-lg border border-gray-200 ${item.bgColor} px-4 py-1.5 text-center`}
            >
              <item.icon className={`mx-auto mb-1 text-xl ${item.iconColor}`} />
              <p className="text-xs text-gray-500">{item.label}</p>
              <p className="font-bold text-gray-800">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Claim Button Section */}
      <div className="space-y-3">
        {!canClaim && (
          <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-center">
            <p className="text-sm font-medium text-green-700">
              ✅ Already claimed today!
            </p>
            <div className="mt-2 flex items-center justify-center gap-2 text-xs text-gray-600">
              <FaClock />
              <span>
                Next claim available in:{" "}
                <span className="font-bold text-blue-600">
                  {timeUntilMidnight}
                </span>
              </span>
            </div>
          </div>
        )}
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/gaming/tournament")}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-blue-300 bg-white py-3 font-medium text-blue-600 transition-all hover:border-blue-400 hover:bg-blue-50 active:scale-95"
          >
            <FaTrophy />
            View Tournament
          </button>
          <button
            onClick={handleClaim}
            disabled={!canClaim}
            className={`w-full rounded-lg py-3 font-semibold text-white shadow transition-all ${
              canClaim
                ? "bg-blue-600 hover:bg-blue-700 active:scale-95"
                : "cursor-not-allowed bg-gray-400"
            }`}
          >
            {canClaim ? (
              <span className="flex items-center justify-center gap-2">
                <FaGift />
                Claim 10 XP Now
              </span>
            ) : (
              "Already Claimed Today"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DailyXPClaim;
