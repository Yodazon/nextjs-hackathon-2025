//April 8, 2025

// The following code is used by the user for speech to text
// Uses WebSpeech API, not compatible with Mozilla
// Therefore more work is needed to be able to one
// This is handling the chat underneath with users and the chat with the screen
"use client";

import React, { useState } from "react";
import { RiVoiceprintFill, RiRobot2Line } from "react-icons/ri";
import Dictaphone from "./dictaphone";
import AiChat from "./aiConversation";
import AiVoice from "./aiAudio";

const ChatScreen = () => {
  const [message, setMessage] = useState("");
  const [conversations, setConversations] = useState([]);
  const [currentBot, setCurrentBot] = useState("conversational");
  const [showBotSelector, setShowBotSelector] = useState(false);

  const bots = {
    conversational: {
      name: "Chat Bot",
      pipeName: "base-conversational",
      icon: "💬",
      voice: "ThT5KcBeYPX3keUQqHPh",
    },
    quiz: {
      name: "Quiz Master",
      pipeName: "tester-ai",
      icon: "❓",
      voice: "ThT5KcBeYPX3keUQqHPh",
    },
  };

  const handleTranscriptChange = async (newTranscript) => {
    const updatedConversations = [
      ...conversations,
      { type: "user", content: newTranscript },
    ];
    setConversations(updatedConversations);

    //Check if quiz or not using the English Language
    const wantsQuiz =
      newTranscript.toLowerCase().includes("quiz") ||
      newTranscript.toLowerCase().includes("test");

    if (wantsQuiz && currentBot !== "quiz") {
      setCurrentBot("quiz");
    }

    //Create messages array with convo history
    const messageHistory = updatedConversations.map((msg) => ({
      role: msg.type === "user" ? "user" : "assistant",
      content: msg.content,
    }));

    //Trigger AI response
    try {
      const aiResponse = await AiChat(
        newTranscript,
        messageHistory,
        bots[currentBot].pipeName
      );
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

  const handleAudioSubmit = async (newVoice) => {
    try {
      AiVoice(newVoice);
    } catch (error) {
      console.log("error trying to get audio");
    }
  };

  const BotSelector = () => (
    <div
      className={`
      fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center
      ${showBotSelector ? "block" : "hidden"}
    `}
    >
      <div className="bg-white p-6 rounded-lg shadow-xl">
        <h2 className="text-xl font-bold mb-4">Select AI Bot</h2>
        <div className="flex flex-col gap-3">
          {Object.entries(bots).map(([botId, bot]) => (
            <button
              key={botId}
              className={`
                p-3 rounded-lg flex items-center gap-2
                ${
                  currentBot === botId
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100"
                }
              `}
              onClick={() => {
                setCurrentBot(botId);
                setShowBotSelector(false);
              }}
            >
              <span>{bot.icon}</span>
              {bot.name}
            </button>
          ))}
        </div>
        <button
          className="mt-4 p-2 bg-gray-200 rounded-lg w-full"
          onClick={() => setShowBotSelector(false)}
        >
          Close
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col space-y-4 p-4">
      <div className="flex justify-between items-center w-2/3 mx-auto">
        <h2 className="text-lg font-semibold">
          {bots[currentBot].icon} {bots[currentBot].name}
        </h2>
        <button
          className="p-2 bg-gray-100 rounded-lg flex items-center gap-2"
          onClick={() => setShowBotSelector(true)}
        >
          <RiRobot2Line /> Switch Bot
        </button>
      </div>
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
              {msg.type === "ai" ? (
                <button
                  className="border-2 border-black rounded-md"
                  onClick={() => handleAudioSubmit(msg.content)}
                >
                  Audio
                </button>
              ) : null}
            </div>
          </div>
        ))}
      </div>
      <div id="chat-box" className="w-2/3 mx-auto ">
        <Dictaphone onTranscriptChange={handleTranscriptChange} />
      </div>
      <BotSelector />
    </div>
  );
};
export default ChatScreen;
