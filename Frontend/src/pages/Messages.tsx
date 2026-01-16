import React from "react";
import { ConversationList, ChatArea } from "../components/Messages";

const Messages: React.FC = () => {
  return (
    <div className="flex h-[calc(100vh-88px)] overflow-hidden rounded-lg bg-white shadow-sm">
      <ConversationList />
      <ChatArea />
    </div>
  );
};

export default Messages;
