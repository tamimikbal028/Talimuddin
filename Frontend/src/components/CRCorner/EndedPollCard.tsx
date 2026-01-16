import React from "react";
import type { Poll } from "./types";

interface EndedPollCardProps {
  poll: Poll;
  isCurrentUserCr: boolean;
  isExpanded: boolean;
  onToggleExpand: (pollId: number) => void;
  onReopenPoll: (pollId: number) => void;
}

export const EndedPollCard: React.FC<EndedPollCardProps> = ({
  poll,
  isCurrentUserCr,
  isExpanded,
  onToggleExpand,
  onReopenPoll,
}) => {
  const winningOption = poll.options.reduce((prev, current) =>
    prev.votes > current.votes ? prev : current
  );

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
      {!isExpanded ? (
        // Compact View
        <div onClick={() => onToggleExpand(poll.id)} className="cursor-pointer">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h4 className="truncate text-sm font-medium text-gray-900">
                {poll.question}
              </h4>
              <p className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                <span>Ended on {poll.endedAt}</span>
                <span className="text-base">•</span>
                <span>{poll.totalVotes} votes</span>
              </p>
              <p className="mt-1 text-xs font-medium text-blue-600">
                {winningOption.text} ({winningOption.votes} votes)
              </p>
            </div>
            <span className="flex-shrink-0 text-sm font-medium text-blue-600">
              Click to expand
            </span>
          </div>
        </div>
      ) : (
        // Expanded View
        <div>
          <div className="mb-3 flex items-start justify-between">
            <div className="flex-1">
              <h4 className="text-base font-medium text-gray-900">
                {poll.question}
              </h4>
              <p className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                <span>Ended on {poll.endedAt}</span>
                <span className="text-base">•</span>
                <span>{poll.totalVotes} total votes</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              {isCurrentUserCr && (
                <button
                  onClick={() => onReopenPoll(poll.id)}
                  className="flex-shrink-0 rounded-md border border-green-200 bg-green-50 px-3 py-1.5 text-sm font-medium text-green-600 transition-colors hover:border-green-300 hover:bg-green-100"
                >
                  Reopen Poll
                </button>
              )}
              <button
                onClick={() => onToggleExpand(poll.id)}
                className="flex-shrink-0 rounded-md border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-600 transition-colors hover:border-blue-300 hover:bg-blue-100"
              >
                Collapse
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {poll.options.map((option) => {
              const percentage = poll.totalVotes
                ? ((option.votes / poll.totalVotes) * 100).toFixed(1)
                : "0.0";
              const isWinner = option.id === winningOption.id;

              return (
                <div
                  key={option.id}
                  className={`rounded-md border p-3 ${
                    isWinner
                      ? "border-green-300 bg-green-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">
                      {option.text}
                      {isWinner && (
                        <span className="ml-2 text-xs font-semibold text-green-600">
                          Winner
                        </span>
                      )}
                    </span>
                    <span className="text-sm font-semibold text-gray-600">
                      {percentage}% ({option.votes} votes)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
