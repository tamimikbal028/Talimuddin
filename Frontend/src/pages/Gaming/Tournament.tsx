import React from "react";
import TournamentBracket from "../../components/Gaming/Tournament/TournamentBracket";
import TournamentHistory from "../../components/Gaming/Tournament/TournamentHistory";
import {
  FaTrophy,
  FaCalculator,
  FaUsers,
  FaClock,
  FaCalendarAlt,
} from "react-icons/fa";

const Tournament: React.FC = () => {
  // TODO: Replace with API data
  const currentTournament = {
    id: "1",
    name: "Math Championship",
    status: "open",
    startDate: new Date().toISOString(),
    registeredPlayers: [] as { id: string; name: string }[],
    currentRound: "round-1",
  };

  const formattedDate = new Date(
    currentTournament.startDate
  ).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const isRegistered = currentTournament.registeredPlayers.some(
    (player) => player.id === "current-user"
  );

  return (
    <div className="space-y-5">
      {/* Page Header with Math Theme */}
      <div className="relative overflow-hidden rounded-lg border border-purple-300 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-6">
        <div className="absolute top-0 right-0 text-[200px] text-purple-200/30">
          📐
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <FaCalculator className="text-4xl text-purple-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Math Tournament Arena
              </h1>
              <p className="mt-1 text-gray-600">
                Compete in thrilling mathematics challenges and claim victory
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-3 rounded-lg bg-white/60 p-3 backdrop-blur-sm">
              <FaTrophy className="text-2xl text-yellow-500" />
              <div>
                <p className="text-xs text-gray-600">Tournament Status</p>
                <p className="font-bold text-gray-900 capitalize">
                  {currentTournament.status}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg bg-white/60 p-3 backdrop-blur-sm">
              <FaUsers className="text-2xl text-blue-500" />
              <div>
                <p className="text-xs text-gray-600">Registered Players</p>
                <p className="font-bold text-gray-900">
                  {currentTournament.registeredPlayers.length}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg bg-white/60 p-3 backdrop-blur-sm">
              <FaClock className="text-2xl text-green-500" />
              <div>
                <p className="text-xs text-gray-600">Current Round</p>
                <p className="font-bold text-gray-900">
                  {currentTournament.currentRound
                    .replace("-", " ")
                    .toUpperCase()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg bg-white/60 p-3 backdrop-blur-sm">
              <FaCalendarAlt className="text-2xl text-purple-500" />
              <div>
                <p className="text-xs text-gray-600">Tournament Dates</p>
                <p className="font-bold text-gray-900">{formattedDate}</p>
              </div>
            </div>
          </div>

          {/* Registration Status */}
          {isRegistered && (
            <div className="mt-4 rounded-lg border-2 border-green-400 bg-green-50 p-3">
              <p className="text-center text-sm font-semibold text-green-800">
                ✅ You're registered! Get ready for mathematical battles 🧮
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Tournament Bracket */}
      <TournamentBracket
        matches={currentTournament.matches}
        currentRound={currentTournament.currentRound}
      />

      {/* Tournament History */}
      <TournamentHistory />
    </div>
  );
};

export default Tournament;
