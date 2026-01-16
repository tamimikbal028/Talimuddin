import React from "react";
import type { Poll } from "./types";

interface PollCardProps {
  poll: Poll;
  isCurrentUserCr: boolean;
  selectedOption: number | null;
  onVote: (pollId: number, optionId: number) => void;
  onCancelVote: (pollId: number) => void;
  onEditPoll: (pollId: number) => void;
  onEndPoll: (pollId: number) => void;
  onDeletePoll: (pollId: number) => void;
}

export const PollCard: React.FC<PollCardProps> = ({
  poll,
  isCurrentUserCr,
  selectedOption,
  onVote,
  onCancelVote,
  onEditPoll,
  onEndPoll,
  onDeletePoll,
}) => {
  return (
    <div className="mb-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-3">
        <h3 className="text-base font-medium text-gray-900">{poll.question}</h3>
      </div>

      <div className="space-y-3">
        {poll.options.map((option) => {
          const percentage = poll.totalVotes
            ? ((option.votes / poll.totalVotes) * 100).toFixed(1)
            : "0.0";
          const isSelected = selectedOption === option.id;

          return (
            <div
              key={option.id}
              className={`relative w-full cursor-pointer overflow-hidden rounded-md border p-4 transition-all ${
                isSelected
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50"
              }`}
              onClick={() => onVote(poll.id, option.id)}
            >
              <div className="relative flex items-center justify-between">
                <span className="text-base font-medium text-gray-900">
                  {option.text}
                </span>
                <span className="text-sm font-semibold text-blue-600">
                  {percentage}% ({option.votes} votes)
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Vote count and Action buttons */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 pt-4">
        <div className="text-sm font-medium text-gray-600">
          Total Votes: {poll.totalVotes}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {selectedOption != null && (
            <button
              onClick={() => onCancelVote(poll.id)}
              className="rounded-md border border-red-300 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
            >
              Cancel Vote
            </button>
          )}
          {isCurrentUserCr && (
            <>
              <button
                onClick={() => onEditPoll(poll.id)}
                className="rounded-md border border-blue-300 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100"
              >
                Edit Poll
              </button>
              <button
                onClick={() => onEndPoll(poll.id)}
                className="rounded-md border border-orange-300 bg-orange-50 px-3 py-1.5 text-sm font-medium text-orange-600 transition-colors hover:bg-orange-100"
              >
                End Poll
              </button>
            </>
          )}
          <button
            onClick={() => onDeletePoll(poll.id)}
            className="rounded-md border border-red-300 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
