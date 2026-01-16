import React from "react";
import { FaCalendarAlt } from "react-icons/fa";
import dayjs from "dayjs";
import { TOURNAMENT_CONSTANTS } from "../data/tournamentData";

const TournamentSchedule: React.FC = () => {
  const today = dayjs().format("dddd");

  const getActiveRound = () => {
    if (today === "Saturday" || today === "Sunday" || today === "Monday")
      return "round-a";
    if (today === "Tuesday" || today === "Wednesday") return "round-b";
    if (today === "Thursday") return "round-c";
    if (today === "Friday") return "final";
    return null;
  };

  const activeRound = getActiveRound();

  return (
    <div className="rounded-lg border border-gray-300 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <FaCalendarAlt className="text-2xl text-blue-600" />
        <h3 className="text-xl font-bold text-gray-900">Tournament Schedule</h3>
      </div>

      <div className="space-y-3">
        {TOURNAMENT_CONSTANTS.ROUNDS.map((round, index) => {
          const isActive = round.id === activeRound;

          return (
            <div
              key={round.id}
              className={`rounded-lg border-l-4 p-4 ${
                isActive
                  ? "border-green-500 bg-green-50"
                  : "border-gray-300 bg-gray-50"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white ${
                        isActive ? "bg-green-600" : "bg-blue-600"
                      }`}
                    >
                      {index + 1}
                    </span>
                    <h4
                      className={`font-semibold ${isActive ? "text-green-900" : "text-gray-900"}`}
                    >
                      {round.name}
                    </h4>
                  </div>
                  <p
                    className={`mt-2 text-sm ${isActive ? "text-green-700" : "text-gray-600"}`}
                  >
                    {round.description}
                  </p>
                </div>
                <div className="ml-4 text-right">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      isActive
                        ? "bg-green-200 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {round.days}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TournamentSchedule;
