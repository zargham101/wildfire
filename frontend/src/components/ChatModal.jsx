
import React, { useState } from "react";
import { HiX } from "react-icons/hi"; 

const ChatModal = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input) return;

    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    setInput("");

    const response = await fetch("http://localhost:5001/api/chat/send-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });

    const data = await response.json();
    setMessages((prev) => [
      ...prev,
      { sender: "bot", text: data.response },
    ]);
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-4 w-96">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Chat with Us</h2>
          <button onClick={onClose}>
            <HiX size={20} />
          </button>
        </div>
        <div className="mt-4 space-y-4 overflow-y-auto max-h-64">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-2 rounded-lg ${
                msg.sender === "user" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="mt-4 flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="border p-2 flex-grow rounded-l-md"
            placeholder="Type your message..."
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-r-md"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatModal;
