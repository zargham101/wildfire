import React from "react";
import { HiChat } from "react-icons/hi"; 

const ChatbotIcon = ({ onOpen }) => {
  return (
    <div
      onClick={onOpen}
      className="fixed bottom-6 right-6 bg-blue-500 p-4 rounded-full cursor-pointer shadow-lg text-white"
    >
      <HiChat size={24} />
    </div>
  );
};

export default ChatbotIcon;
