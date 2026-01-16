import { FaSearch, FaClock, FaCheckCircle } from "react-icons/fa";

interface MatchmakingStatusProps {
  isSearching: boolean;
  matchFound: boolean;
  opponent: {
    name: string;
    avatar: string;
    rating: number;
  } | null;
  matchTime: string | null;
}

const MatchmakingStatus: React.FC<MatchmakingStatusProps> = ({
  isSearching,
  matchFound,
  opponent,
  matchTime,
}) => {
  if (!isSearching && !matchFound) return null;

  return (
    <div className="rounded-lg border border-blue-300 bg-gradient-to-br from-blue-50 to-purple-50 p-3 shadow-md">
      {isSearching && !matchFound ? (
        // Searching State
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-15 w-15 items-center justify-center">
            <FaSearch className="animate-pulse text-5xl text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">
            Finding Your Opponent...
          </h3>
          <p className="mt-2 text-gray-600">
            Searching for a worthy challenger for your math battle
          </p>

          {/* Searching Animation */}
          <div className="mt-5 flex items-center justify-center gap-2">
            <div className="h-3 w-3 animate-bounce rounded-full bg-blue-500"></div>
            <div
              className="h-3 w-3 animate-bounce rounded-full bg-purple-500"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="h-3 w-3 animate-bounce rounded-full bg-pink-500"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>
      ) : matchFound && opponent ? (
        // Match Found State
        <div className="text-center">
          <div>
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <FaCheckCircle className="text-5xl text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-green-700">
              Match Found! 🎉
            </h3>
            <p className="mt-2 text-gray-600">
              Your opponent has been matched. Get ready for battle!
            </p>
          </div>

          {/* Opponent Info */}
          <div className="mt-6 flex items-center justify-center gap-4 rounded-lg bg-white p-4 shadow-sm">
            <img
              src={opponent.avatar}
              alt={opponent.name}
              className="h-16 w-16 rounded-full border-2 border-purple-300"
            />
            <div className="text-left">
              <h4 className="font-bold text-gray-900">{opponent.name}</h4>
              <p className="text-sm text-gray-600">Rating: {opponent.rating}</p>
            </div>
          </div>

          {/* Match Schedule */}
          <div className="mt-4 rounded-lg border-2 border-blue-300 bg-blue-50 p-4">
            <div className="flex items-center justify-center gap-2 text-blue-800">
              <FaClock className="text-xl" />
              <div>
                <p className="text-sm font-medium">Match Scheduled At</p>
                <p className="text-2xl font-bold">{matchTime}</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-blue-700">
              📅 Match time is between{" "}
              <span className="font-bold">12:00 PM - 11:59 PM</span> today
            </p>
          </div>

          {/* Important Instructions */}
          <div className="mt-4 space-y-3">
            <div className="rounded-lg border-2 border-orange-300 bg-orange-50 p-4">
              <p className="flex items-center justify-center gap-2 font-bold text-orange-800">
                <span className="text-2xl">⚠️</span>
                <span>Important Instructions</span>
              </p>
              <ul className="mt-3 space-y-2 text-left text-sm text-orange-900">
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span>
                    <span className="font-bold">Be online</span> at the
                    scheduled time to start your match
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span>
                    Match will{" "}
                    <span className="font-bold">automatically start</span> when
                    both players are ready
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span>
                    If you miss the match, you'll be{" "}
                    <span className="font-bold">disqualified</span> from the
                    tournament
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span>
                    Set a reminder and stay online{" "}
                    <span className="font-bold">5 minutes before</span> match
                    time
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default MatchmakingStatus;
