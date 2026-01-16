import React from "react";
import { FaInfoCircle } from "react-icons/fa";

const TournamentRules: React.FC = () => {
  return (
    <div className="rounded-lg border border-gray-300 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <FaInfoCircle className="text-2xl text-amber-600" />
        <h3 className="text-xl font-bold text-gray-900">
          Tournament Rules & Guidelines
        </h3>
      </div>

      <div className="space-y-4">
        {/* Tournament Format */}
        <div className="rounded-lg bg-blue-50 p-4">
          <h4 className="mb-2 font-semibold text-blue-900">
            🗓️ Tournament Format
          </h4>
          <p className="text-sm text-blue-800">
            Single week tournament running from Saturday to Friday with daily
            matches
          </p>
        </div>

        {/* Match Timing */}
        <div className="rounded-lg bg-purple-50 p-4">
          <h4 className="mb-2 font-semibold text-purple-900">
            ⏰ Match Timing
          </h4>
          <p className="text-sm text-purple-800">
            All matches are scheduled between{" "}
            <span className="font-bold">12 PM to 12 AM</span> daily. Players
            must be online during their scheduled match time.
          </p>
        </div>

        {/* Round Progression */}
        <div className="rounded-lg bg-green-50 p-4">
          <h4 className="mb-2 font-semibold text-green-900">
            📍 Round Progression
          </h4>
          <ul className="space-y-1 text-sm text-green-800">
            <li>
              <span className="font-semibold">Day 1-3:</span> University matches
              → Top 96 players qualify
            </li>
            <li>
              <span className="font-semibold">Day 4-5:</span> Round of 96 → Top
              24 advance
            </li>
            <li>
              <span className="font-semibold">Day 6:</span> Round of 24 → Top 3
              from each university
            </li>
            <li>
              <span className="font-semibold">Day 7:</span> Grand Finals with
              all qualified players
            </li>
          </ul>
        </div>

        {/* Match Rules */}
        <div className="rounded-lg bg-orange-50 p-4">
          <h4 className="mb-2 font-semibold text-orange-900">🎮 Match Rules</h4>
          <ul className="space-y-1 text-sm text-orange-800">
            <li>• Must be online during your scheduled match time</li>
            <li>• 5 minutes response time or match will be auto-forfeited</li>
            <li>• Best of 1 game format per match</li>
            <li>• Winner determined by higher score</li>
            <li>• In case of tie, sudden death round will be played</li>
          </ul>
        </div>

        {/* Important Notes */}
        <div className="rounded-lg bg-red-50 p-4">
          <h4 className="mb-2 font-semibold text-red-900">
            ⚠️ Important Notes
          </h4>
          <ul className="space-y-1 text-sm text-red-800">
            <li>• Entry fee is non-refundable once tournament starts</li>
            <li>
              • University information must be verified before registration
            </li>
            <li>
              • Fair play is mandatory - violations will result in
              disqualification
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TournamentRules;
