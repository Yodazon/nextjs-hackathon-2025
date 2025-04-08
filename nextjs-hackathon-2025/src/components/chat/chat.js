//April 8, 2025

// The following code is used by the user for speech to text
// Uses WebSpeech API, not compatible with Mozilla
// Therefore more work is needed to be able to one
// This is handling the chat underneath with users and the chat with the screen
"use client";

import React, { useState } from "react";
import { RiVoiceprintFill } from "react-icons/ri";
import Dictaphone from "./dictaphone";
import AiChat from "./aiConversation";

const ChatScreen = () => {
  const [message, setMessage] = useState("");
  const [conversations, setConversations] = useState([]);

  const handleTranscriptChange = async (newTranscript) => {
    setConversations((prev) => [
      ...prev,
      { type: "user", content: newTranscript },
    ]);

    //Trigger AI response
    try {
      const aiResponse = await AiChat(newTranscript);
      if (aiResponse) {
        setConversations((prev) => [
          ...prev,
          { type: "ai", content: aiResponse },
        ]);
      }
    } catch (error) {
      console.error("Error getting AI repsonse", error);
    }
    setMessage(newTranscript);
  };

  return (
    <div className="flex flex-col space-y-4 p-4">
      <div
        id="conversation-box"
        className="h-[60vh] w-2/3 border-black border-2 rounded-lg p-4 overflow-y-auto mx-auto "
      >
        {conversations.map((msg, index) => (
          <div
            key={index}
            className={`mb-4 flex ${
              msg.type === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-lg ${
                msg.type === "user"
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-gray-200 text-black rounded-bl-none"
              }`}
            >
              <p>{msg.content}</p>
            </div>
          </div>
        ))}
      </div>
      <div id="chat-box" className="w-2/3 mx-auto ">
        <Dictaphone onTranscriptChange={handleTranscriptChange} />
      </div>
    </div>
  );
};
export default ChatScreen;
