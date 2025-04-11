//April 8, 2025

// The following code is used by the user for speech to text
// Uses WebSpeech API, not compatible with Mozilla
// Therefore more work is needed to be able to one
// This is handling the chat underneath with users and the chat with the screen
"use client";

import React, { useState, useEffect } from "react";
import { RiVoiceprintFill, RiRobot2Line } from "react-icons/ri";
import Dictaphone from "./dictaphone";
import AiChat from "./aiConversation";
import AiVoice from "./aiAudio";
import { useSession } from "next-auth/react";
import { useRAGChat } from "@/lib/useRAGChat";
import { getConversationHistory, getRelevantContext } from "@/lib/embeddings";

const ChatScreen = () => {
  const [message, setMessage] = useState("");
  const [conversations, setConversations] = useState([]);
  const [currentBot, setCurrentBot] = useState("conversational");
  const [showBotSelector, setShowBotSelector] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { data: session } = useSession();
  const { storeChatHistory, isStoring, error } = useRAGChat();

  const bots = {
    conversational: {
      name: "Chat Bot",
      pipeName: "base-conversational",
      icon: "💬",
      voice: "ThT5KcBeYPX3keUQqHPh",
      id: "conversational",
    },
    quiz: {
      name: "Quiz Master",
      pipeName: "tester-ai",
      icon: "❓",
      voice: "ThT5KcBeYPX3keUQqHPh",
      id: "quiz",
    },
  };

  // Load conversation history when user logs in
  useEffect(() => {
    async function loadHistory() {
      if (session?.user?.id) {
        console.log(session?.user?.id);
        try {
          setIsLoading(true);
          const history = await getConversationHistory(session.user.id);
          console.log("history below me");
          console.log(history);
          // Convert history to conversations format and set it
          const formattedHistory = history.map((msg) => ({
            type: msg.role === "user" ? "user" : "ai",
            content: msg.content,
          }));
          setConversations(formattedHistory);
        } catch (error) {
          console.log("no history eh");
          console.error("Error loading conversation history:", error);
        } finally {
          setIsLoading(false);
        }
      }
    }
    loadHistory();
  }, [session?.user?.id]);

  const handleTranscriptChange = async (newTranscript) => {
    if (!session?.user) {
      alert("please sign in to continue");
      return;
    }

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

    // Get relevant context from previous conversations
    const context = await getRelevantContext(session.user.id, newTranscript);

    //Trigger AI response with context
    try {
      const aiResponse = await AiChat(
        newTranscript,
        [
          ...context,
          ...updatedConversations.map((msg) => ({
            role: msg.type === "user" ? "user" : "assistant",
            content: msg.content,
          })),
        ],
        bots[currentBot].pipeName
      );

      if (aiResponse) {
        const newConversations = [
          ...updatedConversations,
          { type: "ai", content: aiResponse },
        ];
        setConversations(newConversations);

        // Store the conversation history in Upstash Vector
        await storeChatHistory(
          newConversations.map((msg) => ({
            role: msg.type === "user" ? "user" : "assistant",
            content: msg.content,
            botType: msg.type === "user" ? null : bots[currentBot].name,
            pipeName: msg.type === "user" ? null : bots[currentBot].pipeName,
          }))
        );
      }
    } catch (error) {
      console.error("Error getting AI response", error);
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
