import React from "react";
import { FaArrowUp, FaPlus } from "react-icons/fa";

interface AIMessageInputProps {
  message: string;
  setMessage: (message: string) => void;
  onSendMessage: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

const AIMessageInput: React.FC<AIMessageInputProps> = ({
  message,
  setMessage,
  onSendMessage,
  onKeyPress,
}) => {
  return (
    <div className="flex items-center gap-2.5 border-t border-gray-200 bg-white p-2.5">
      {/* Attachment Button */}
      <button className="flex h-full w-12.5 items-center justify-center rounded-2xl bg-blue-50 text-gray-600 transition-colors hover:bg-gray-100">
        <FaPlus className="h-5 w-5" />
      </button>

      {/* Message Input Area */}
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={onKeyPress}
        placeholder="Ask me anything about your studies..."
        rows={1}
        className="w-full resize-none rounded-xl border border-gray-300 px-3 py-2.5 focus:outline-none"
      />

      {/* Send Button */}
      <button
        onClick={onSendMessage}
        disabled={!message.trim()}
        className={`flex h-full w-12.5 items-center justify-center rounded-2xl bg-blue-500 text-white transition-all ${
          message.trim() ? "hover:shadow-lg" : "bg-gray-200 text-gray-400"
        }`}
      >
        <FaArrowUp className="h-5 w-5" />
      </button>
    </div>
  );
};

export default AIMessageInput;
