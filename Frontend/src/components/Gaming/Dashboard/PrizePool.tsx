import React from "react";
import { FaTrophy, FaMedal, FaAward, FaMoneyBillWave } from "react-icons/fa";
import type { IconType } from "react-icons";

interface Prize {
  id: number;
  icon: IconType;
  iconColor: string;
  badge: string;
  badgeColor: string;
  title: string;
  titleColor: string;
  name: string;
  value: string;
  valueColor: string;
  borderColor: string;
  bgGradient: string;
  bgColor: string;
}

const prizes: Prize[] = [
  {
    id: 1,
    icon: FaTrophy,
    iconColor: "text-yellow-600",
    badge: "🥇 CHAMPION",
    badgeColor: "text-yellow-800",
    title: "1st Place",
    titleColor: "text-yellow-800",
    name: "চুইঝাল",
    value: "৳300",
    valueColor: "text-yellow-900",
    borderColor: "border-yellow-400",
    bgGradient: "from-yellow-50 to-yellow-100",
    bgColor: "bg-yellow-200",
  },
  {
    id: 2,
    icon: FaMedal,
    iconColor: "text-gray-600",
    badge: "🥈 RUNNER-UP",
    badgeColor: "text-gray-800",
    title: "2nd Place",
    titleColor: "text-gray-800",
    name: "Masallah Kabab",
    value: "৳300",
    valueColor: "text-gray-900",
    borderColor: "border-gray-400",
    bgGradient: "from-gray-50 to-gray-100",
    bgColor: "bg-gray-200",
  },
  {
    id: 3,
    icon: FaAward,
    iconColor: "text-orange-600",
    badge: "🥉 3RD PLACE",
    badgeColor: "text-orange-800",
    title: "3rd Place",
    titleColor: "text-orange-800",
    name: "Pizza Treat",
    value: "৳400",
    valueColor: "text-orange-900",
    borderColor: "border-orange-400",
    bgGradient: "from-orange-50 to-orange-100",
    bgColor: "bg-orange-200",
  },
  {
    id: 4,
    icon: FaMoneyBillWave,
    iconColor: "text-green-600",
    badge: "💰 FLEXIBLE",
    badgeColor: "text-green-800",
    title: "Cash Option",
    titleColor: "text-green-800",
    name: "bKash Payment",
    value: "Available",
    valueColor: "text-green-900",
    borderColor: "border-green-400",
    bgGradient: "from-green-50 to-green-100",
    bgColor: "bg-green-200",
  },
];

const PrizePool: React.FC = () => {
  return (
    <div className="rounded-lg border border-gray-300 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-center justify-center gap-2">
        <FaTrophy className="text-2xl text-yellow-500" />
        <h3 className="text-xl font-bold text-gray-900">Prize Pool</h3>
      </div>

      {/* Prizes Grid */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
        {prizes.map((prize) => {
          const Icon = prize.icon;
          return (
            <div
              key={prize.id}
              className={`group relative overflow-hidden rounded-lg border-2 ${prize.borderColor} bg-gradient-to-br ${prize.bgGradient} p-3 transition-all hover:shadow-lg`}
            >
              <div className="mb-2 flex items-center justify-center">
                <Icon className={`text-3xl ${prize.iconColor}`} />
              </div>
              <div className="rounded-lg bg-white/60 px-2 py-0.5 text-center">
                <p className={`text-xs font-semibold ${prize.badgeColor}`}>
                  {prize.badge}
                </p>
              </div>
              <h4
                className={`mt-2 text-center text-base font-bold ${prize.titleColor}`}
              >
                {prize.title}
              </h4>
              <div className="mt-1 text-center">
                <p className="text-sm font-semibold text-gray-700">
                  {prize.name}
                </p>
                <div className={`mt-2 rounded-lg ${prize.bgColor} py-1.5`}>
                  <p className={`text-base font-bold ${prize.valueColor}`}>
                    {prize.value}
                  </p>
                  {prize.id === 4 && (
                    <p className="text-xs text-green-700">-20% off</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Note */}
      <div className="mt-4 rounded-lg bg-blue-50 p-3">
        <p className="text-center text-xs text-blue-800">
          🎯 Winners can choose food treats or cash (20% deduction applies)
        </p>
      </div>
    </div>
  );
};

export default PrizePool;
