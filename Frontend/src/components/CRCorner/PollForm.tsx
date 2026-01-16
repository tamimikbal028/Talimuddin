import React from "react";
import { FaPoll, FaTimes } from "react-icons/fa";

interface PollFormProps {
  isEditing: boolean;
  question: string;
  options: string[];
  onQuestionChange: (value: string) => void;
  onOptionChange: (index: number, value: string) => void;
  onAddOption: () => void;
  onRemoveOption: (index: number) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export const PollForm: React.FC<PollFormProps> = ({
  isEditing,
  question,
  options,
  onQuestionChange,
  onOptionChange,
  onAddOption,
  onRemoveOption,
  onSubmit,
  onCancel,
}) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FaPoll className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            {isEditing ? "Edit Poll" : "New Poll"}
          </h3>
        </div>
        <button
          onClick={onCancel}
          className="rounded p-1 text-gray-500 hover:bg-gray-100"
        >
          <FaTimes className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Poll question"
          value={question}
          onChange={(e) => onQuestionChange(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-4 py-3 text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
        />

        <div className="space-y-2">
          {options.map((opt, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                value={opt}
                onChange={(e) => onOptionChange(i, e.target.value)}
                placeholder={`Option ${i + 1}`}
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
              <button
                onClick={() => onRemoveOption(i)}
                disabled={options.length <= 2}
                className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:border-red-300 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-red-200 disabled:hover:bg-red-50"
              >
                Remove
              </button>
            </div>
          ))}

          <div>
            <button
              onClick={onAddOption}
              className="rounded bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100"
            >
              Add option
            </button>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-md border border-gray-300 py-2.5 text-base font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={
              !question.trim() ||
              options.map((o) => o.trim()).filter(Boolean).length < 2
            }
            className="flex-1 rounded-md bg-blue-600 py-2.5 text-base font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {isEditing ? "Update Poll" : "Create Poll"}
          </button>
        </div>
      </div>
    </div>
  );
};
