import React from "react";
import { useNavigate } from "react-router-dom";
import { FaCalculator, FaTh, FaTrophy } from "react-icons/fa";

const Play: React.FC = () => {
  const navigate = useNavigate();

  const games = [
    {
      id: "math",
      icon: <FaCalculator />,
      name: "Math Competition",
      description:
        "Challenge others in fast-paced math problems and climb the leaderboard.",
      color: "bg-blue-500",
      hoverColor: "hover:bg-blue-600",
      path: "/gaming/play/math-competition",
    },
    {
      id: "sudoku",
      icon: <FaTh />,
      name: "Sudoku Solver",
      description:
        "Test your logical thinking with classic Sudoku puzzles of varying difficulty.",
      color: "bg-green-500",
      hoverColor: "hover:bg-green-600",
      path: "/gaming/play/sudoku",
    },
    {
      id: "academic_arena",
      icon: <FaTrophy />,
      name: "Academic Arena",
      description:
        "University students create questions, college students solve them. Dual-role gameplay.",
      color: "bg-purple-500",
      hoverColor: "hover:bg-purple-600",
      path: "/gaming/play/academic-arena",
    },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="text-center">
        <h2 className="mb-1 text-4xl font-bold text-gray-900">
          Choose Your Game
        </h2>
        <p className="text-lg text-gray-600">
          Select your preferred game mode and start competing!
        </p>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {games.map((game) => (
          <div
            key={game.id}
            onClick={() => navigate(game.path)}
            className="flex cursor-pointer flex-col rounded-lg border border-gray-300 bg-white p-5 transition-all hover:border-gray-400 hover:shadow-md"
          >
            {/* Game Icon */}
            <div
              className={`mb-4 flex h-14 w-14 items-center justify-center rounded-lg ${game.color} text-2xl text-white shadow-sm`}
            >
              {game.icon}
            </div>

            {/* Game Info - Flexible to take available space */}
            <div className="mb-4 flex-1">
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                {game.name}
              </h3>
              <p className="text-sm leading-relaxed text-gray-600">
                {game.description}
              </p>
            </div>

            {/* Play Button - Always at bottom */}
            <button
              className={`w-full rounded-lg ${game.color} px-4 py-2 text-sm font-medium text-white transition-colors ${game.hoverColor}`}
            >
              Play Now
            </button>
          </div>
        ))}
      </div>

      {/* Stats Section */}
      <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-gray-300 bg-white p-5 text-center">
          <div className="text-2xl font-bold text-blue-600">1,234</div>
          <div className="text-sm text-gray-600">Total Players</div>
        </div>
        <div className="rounded-lg border border-gray-300 bg-white p-5 text-center">
          <div className="text-2xl font-bold text-green-600">5,678</div>
          <div className="text-sm text-gray-600">Games Played</div>
        </div>
        <div className="rounded-lg border border-gray-300 bg-white p-5 text-center">
          <div className="text-2xl font-bold text-purple-600">89</div>
          <div className="text-sm text-gray-600">Online Now</div>
        </div>
      </div>
    </div>
  );
};

export default Play;
