import React from "react";
import {
  FaCalculator,
  FaBrain,
  FaChartLine,
  FaTrophy,
  FaClock,
} from "react-icons/fa";
import type { IconType } from "react-icons";
import { TOURNAMENT_CONSTANTS } from "../data/tournamentData";

interface Match {
  id: string;
  round: string;
  player1: { name: string; avatar: string };
  player2: { name: string; avatar: string };
  winner: string | null;
  player1Score: number;
  player2Score: number;
  status: "upcoming" | "live" | "completed";
}

interface TournamentBracketProps {
  matches: Match[];
  currentRound: string;
}

const TournamentBracket: React.FC<TournamentBracketProps> = ({
  matches,
  currentRound,
}) => {
  // Use the same round ids as defined in TOURNAMENT_CONSTANTS.ROUNDS
  const roundIcons: Record<string, IconType> = {
    "round-a": FaCalculator,
    "round-b": FaBrain,
    "round-c": FaChartLine,
    final: FaTrophy,
  };

  const getCurrentRoundInfo = () => {
    const round = TOURNAMENT_CONSTANTS.ROUNDS.find(
      (r) => r.id === currentRound
    );
    return round || TOURNAMENT_CONSTANTS.ROUNDS[0];
  };

  const currentRoundInfo = getCurrentRoundInfo();
  const RoundIcon = roundIcons[currentRound] || FaCalculator;

  return (
    <div className="rounded-lg border border-purple-200 bg-white p-6 shadow-md">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FaTrophy className="text-3xl text-yellow-500" />
          <div>
            <h3 className="text-2xl font-bold text-gray-900">
              Tournament Bracket
            </h3>
            <p className="text-sm text-gray-600">
              Live match progression and results
            </p>
          </div>
        </div>

        {/* Current Round Badge */}
        <div className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-100 to-blue-100 px-4 py-2">
          <RoundIcon className="text-xl text-purple-600" />
          <div>
            <p className="text-xs text-gray-600">Active Round</p>
            <p className="font-bold text-purple-900">{currentRoundInfo.name}</p>
          </div>
        </div>
      </div>

      {/* Main Bracket Visualization */}
      <div className="rounded-lg bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-8">
        {/* Coming Soon with Math Theme */}
        <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
          <div className="mb-4 flex gap-4 text-6xl">
            <span className="animate-bounce">🧮</span>
            <span className="animate-pulse">📐</span>
            <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>
              📏
            </span>
          </div>
          <h4 className="mb-3 text-3xl font-bold text-gray-800">
            Bracket Visualization Coming Soon
          </h4>
          <p className="mb-6 max-w-md text-gray-600">
            Interactive tournament bracket with live match updates will be
            displayed here. Track your progress and see who advances to the next
            round!
          </p>

          {/* Current Round Details */}
          <div className="w-full max-w-lg rounded-lg border-2 border-purple-300 bg-white p-6">
            <div className="mb-4 flex items-center justify-center gap-2">
              <RoundIcon className="text-3xl text-purple-600" />
              <h5 className="text-xl font-bold text-gray-900">
                {currentRoundInfo.name}
              </h5>
            </div>
            <div className="space-y-2 text-sm text-gray-700">
              <p className="flex items-center justify-center gap-2">
                <FaClock className="text-blue-500" />
                <span className="font-semibold">{currentRoundInfo.days}</span>
              </p>
              <p className="text-center text-gray-600">
                {currentRoundInfo.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tournament Structure Overview */}
      <div className="mt-6 rounded-lg border border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50 p-5">
        <div className="mb-4 flex items-center gap-2">
          <FaChartLine className="text-xl text-purple-600" />
          <p className="font-bold text-gray-900">Tournament Structure</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {TOURNAMENT_CONSTANTS.ROUNDS.map((round, index) => {
            const Icon = roundIcons[round.id] || FaCalculator;
            const isActive = round.id === currentRound;

            return (
              <div
                key={round.id}
                className={`relative rounded-lg border-2 p-4 text-center transition-all ${
                  isActive
                    ? "border-purple-500 bg-purple-100 shadow-md"
                    : "border-gray-300 bg-white"
                }`}
              >
                {isActive && (
                  <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-xs text-white">
                    ✓
                  </div>
                )}
                <div className="mb-2 flex justify-center">
                  <Icon
                    className={`text-2xl ${isActive ? "text-purple-600" : "text-gray-500"}`}
                  />
                </div>
                <p
                  className={`mb-1 text-xs font-bold ${isActive ? "text-purple-900" : "text-gray-700"}`}
                >
                  Round {index + 1}
                </p>
                <p
                  className={`text-xs ${isActive ? "text-purple-800" : "text-gray-600"}`}
                >
                  {round.name}
                </p>
                <p
                  className={`mt-2 text-xs ${isActive ? "text-purple-700" : "text-gray-500"}`}
                >
                  {round.days.split("(")[1]?.replace(")", "")}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Match Stats */}
      {matches.length > 0 && (
        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-center">
            <p className="mb-1 text-2xl font-bold text-blue-900">
              {matches.filter((m) => m.status === "completed").length}
            </p>
            <p className="text-xs text-blue-700">Completed Matches</p>
          </div>
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-center">
            <p className="mb-1 text-2xl font-bold text-green-900">
              {matches.filter((m) => m.status === "live").length}
            </p>
            <p className="text-xs text-green-700">Live Matches</p>
          </div>
          <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 text-center">
            <p className="mb-1 text-2xl font-bold text-orange-900">
              {matches.filter((m) => m.status === "upcoming").length}
            </p>
            <p className="text-xs text-orange-700">Upcoming Matches</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TournamentBracket;
