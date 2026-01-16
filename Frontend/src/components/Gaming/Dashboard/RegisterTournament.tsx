import React from "react";
import { FaTrophy, FaCoins } from "react-icons/fa";

interface RegisterTournamentProps {
  entryFee: number;
  userXP: number;
  hasUniversity?: boolean;
  onRegister?: () => void;
}

const RegisterTournament: React.FC<RegisterTournamentProps> = ({
  entryFee,
  userXP,
  hasUniversity = true,
  onRegister,
}) => {
  const canRegister = userXP >= entryFee;

  const handleRegister = () => {
    if (canRegister && hasUniversity) {
      // TODO: Replace with API call
      onRegister?.();
    }
  };

  return (
    <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-5 shadow">
      {/* Header with Stats */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="mb-1 text-2xl font-bold text-blue-600">
            Register for Tournament
          </h3>
          <p className="text-sm text-gray-600">
            Compete against the best players and win amazing prizes!
          </p>
        </div>
        <div className="flex gap-3">
          <div className="rounded-lg border border-gray-200 bg-yellow-50 px-4 py-2 text-center">
            <FaCoins className="mx-auto mb-1 text-xl text-yellow-600" />
            <p className="text-xs text-gray-500">Entry Fee</p>
            <p className="font-bold text-gray-800">{entryFee} XP</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-orange-50 px-4 py-2 text-center">
            <FaTrophy className="mx-auto mb-1 text-xl text-orange-600" />
            <p className="text-xs text-gray-500">Your XP</p>
            <p className="font-bold text-gray-800">{userXP} XP</p>
          </div>
        </div>
      </div>

      {/* Registration Button Section */}
      <div className="space-y-3">
        {!hasUniversity && (
          <div className="rounded-lg border border-orange-200 bg-orange-50 p-3 text-center">
            <p className="text-sm font-medium text-orange-700">
              ⚠️ University information required to register
            </p>
            <p className="mt-1 text-xs text-orange-600">
              Update your profile with your university details
            </p>
          </div>
        )}

        {!canRegister && hasUniversity && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-center">
            <p className="text-sm font-medium text-red-700">
              ❌ Insufficient XP! You need {entryFee - userXP} more XP to
              register.
            </p>
            <p className="mt-1 text-xs text-red-600">
              Claim daily XP or play games to earn more!
            </p>
          </div>
        )}

        <button
          onClick={handleRegister}
          disabled={!canRegister || !hasUniversity}
          className={`w-full rounded-lg py-3 font-semibold text-white shadow transition-all ${
            canRegister && hasUniversity
              ? "bg-blue-600 hover:bg-blue-700 active:scale-95"
              : "cursor-not-allowed bg-gray-400"
          }`}
        >
          {canRegister && hasUniversity ? (
            <span className="flex items-center justify-center gap-2">
              Register Now ({entryFee} XP)
            </span>
          ) : !hasUniversity ? (
            "University Required"
          ) : (
            "Insufficient XP"
          )}
        </button>

        {canRegister && (
          <p className="text-center text-xs text-gray-500">
            💡 Entry fee is non-refundable after registration
          </p>
        )}
      </div>
    </div>
  );
};

export default RegisterTournament;
