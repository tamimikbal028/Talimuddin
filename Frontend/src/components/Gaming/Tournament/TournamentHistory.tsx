import React from "react";
import {
  FaTrophy,
  FaCalendar,
  FaMedal,
  FaAward,
  FaUsers,
  FaCalculator,
} from "react-icons/fa";

interface PastTournament {
  id: string;
  date: string;
  winner: {
    name: string;
    university: string;
    score: number;
  };
  runnerUp: {
    name: string;
    university: string;
    score: number;
  };
  participants: number;
  prize: string;
  totalMatches: number;
}

const TournamentHistory: React.FC = () => {
  // Mock data for past tournaments
  const pastTournaments: PastTournament[] = [
    {
      id: "tournament-000",
      date: "October 1-7, 2025",
      winner: {
        name: "Tamim Ahmed",
        university: "University of Dhaka",
        score: 2850,
      },
      runnerUp: {
        name: "Rafiq Hassan",
        university: "BUET",
        score: 2720,
      },
      participants: 96,
      prize: "Buffet Treat (৳500)",
      totalMatches: 95,
    },
    {
      id: "tournament-001",
      date: "September 24-30, 2025",
      winner: {
        name: "Nadia Islam",
        university: "BUET",
        score: 2910,
      },
      runnerUp: {
        name: "Karim Uddin",
        university: "University of Dhaka",
        score: 2680,
      },
      participants: 84,
      prize: "Pizza Treat (৳400)",
      totalMatches: 83,
    },
  ];

  return (
    <div className="rounded-lg border border-purple-200 bg-white p-6 shadow-md">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-lg bg-gradient-to-r from-yellow-400 to-orange-500 p-3">
          <FaTrophy className="text-2xl text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">
            Tournament History
          </h3>
          <p className="text-sm text-gray-600">
            Past champions and tournament records
          </p>
        </div>
      </div>

      {pastTournaments.length === 0 ? (
        <div className="flex min-h-[200px] items-center justify-center rounded-lg bg-gradient-to-br from-purple-50 to-blue-50 p-8 text-center">
          <div>
            <div className="mb-3 text-6xl">🧮</div>
            <p className="mb-2 text-xl font-bold text-gray-700">
              No Past Tournaments
            </p>
            <p className="text-gray-600">
              Be part of the first math tournament!
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Registration opens soon for the next tournament
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {pastTournaments.map((tournament, index) => (
            <div
              key={tournament.id}
              className="group overflow-hidden rounded-lg border-2 border-purple-200 bg-gradient-to-r from-purple-50 via-blue-50 to-pink-50 transition-all hover:border-purple-400 hover:shadow-lg"
            >
              {/* Tournament Header */}
              <div className="flex items-center justify-between border-b border-purple-200 bg-white/60 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-xl font-bold text-white">
                    #{index + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <FaCalendar className="text-blue-500" />
                      <p className="font-bold text-gray-800">
                        {tournament.date}
                      </p>
                    </div>
                    <div className="mt-1 flex items-center gap-3 text-xs text-gray-600">
                      <span className="flex items-center gap-1">
                        <FaUsers />
                        {tournament.participants} players
                      </span>
                      <span className="flex items-center gap-1">
                        <FaCalculator />
                        {tournament.totalMatches} matches
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="rounded-lg bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-800">
                    {tournament.prize}
                  </div>
                </div>
              </div>

              {/* Winner & Runner-up */}
              <div className="grid gap-4 p-4 md:grid-cols-2">
                {/* Winner */}
                <div className="rounded-lg border-2 border-yellow-400 bg-gradient-to-br from-yellow-50 to-yellow-100 p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <FaTrophy className="text-2xl text-yellow-600" />
                    <div>
                      <p className="text-xs font-semibold text-yellow-800">
                        🥇 CHAMPION
                      </p>
                      <p className="text-sm font-bold text-yellow-900">
                        1st Place
                      </p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-gray-900">
                      {tournament.winner.name}
                    </p>
                    <p className="text-xs text-gray-600">
                      {tournament.winner.university}
                    </p>
                    <div className="mt-2 flex items-center justify-between rounded-lg bg-yellow-200 px-3 py-1.5">
                      <span className="text-xs font-semibold text-yellow-800">
                        Final Score
                      </span>
                      <span className="text-sm font-bold text-yellow-900">
                        {tournament.winner.score}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Runner-up */}
                <div className="rounded-lg border-2 border-gray-400 bg-gradient-to-br from-gray-50 to-gray-100 p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <FaMedal className="text-2xl text-gray-600" />
                    <div>
                      <p className="text-xs font-semibold text-gray-800">
                        🥈 RUNNER-UP
                      </p>
                      <p className="text-sm font-bold text-gray-900">
                        2nd Place
                      </p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-gray-900">
                      {tournament.runnerUp.name}
                    </p>
                    <p className="text-xs text-gray-600">
                      {tournament.runnerUp.university}
                    </p>
                    <div className="mt-2 flex items-center justify-between rounded-lg bg-gray-200 px-3 py-1.5">
                      <span className="text-xs font-semibold text-gray-800">
                        Final Score
                      </span>
                      <span className="text-sm font-bold text-gray-900">
                        {tournament.runnerUp.score}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Statistics Summary */}
      {pastTournaments.length > 0 && (
        <div className="mt-6 rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 p-5">
          <div className="mb-3 flex items-center gap-2">
            <FaAward className="text-xl text-blue-600" />
            <p className="font-bold text-gray-900">All-Time Statistics</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-lg bg-white p-3 text-center">
              <p className="mb-1 text-2xl font-bold text-purple-600">
                {pastTournaments.length}
              </p>
              <p className="text-xs text-gray-600">Tournaments</p>
            </div>
            <div className="rounded-lg bg-white p-3 text-center">
              <p className="mb-1 text-2xl font-bold text-blue-600">
                {pastTournaments.reduce((sum, t) => sum + t.participants, 0)}
              </p>
              <p className="text-xs text-gray-600">Total Players</p>
            </div>
            <div className="rounded-lg bg-white p-3 text-center">
              <p className="mb-1 text-2xl font-bold text-green-600">
                {pastTournaments.reduce((sum, t) => sum + t.totalMatches, 0)}
              </p>
              <p className="text-xs text-gray-600">Total Matches</p>
            </div>
            <div className="rounded-lg bg-white p-3 text-center">
              <p className="mb-1 text-2xl font-bold text-orange-600">
                {Math.max(
                  ...pastTournaments.map((t) => t.winner.score)
                ).toLocaleString()}
              </p>
              <p className="text-xs text-gray-600">Highest Score</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TournamentHistory;
