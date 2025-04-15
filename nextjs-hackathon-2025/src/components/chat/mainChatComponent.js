"use client";

import React, { useState, useEffect } from "react";
import { RiVoiceprintFill, RiRobot2Line } from "react-icons/ri";
import Dictaphone from "./dictaphone";
import AiChat from "./aiConversation";
import AiVoice from "./aiAudio";
import { useSession } from "next-auth/react";
import { useRAGChat } from "@/lib/useRAGChat";
import { getConversationHistory, getRelevantContext } from "@/lib/embeddings";

const BaseChatScreen = ({
  initialBot,
  allowBotSwitch = true,
  bots,
  systemContext = [],
  className = "h-[calc(100vh-8rem)]",
}) => {
  const [conversations, setConversations] = useState([]);
  const [currentBot, setCurrentBot] = useState(initialBot);
  const [showBotSelector, setShowBotSelector] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { data: session } = useSession();
  const { storeChatHistory, isStoring, error } = useRAGChat();

  // Load conversation history
  useEffect(() => {
    async function loadHistory() {
      if (session?.user?.id) {
        try {
          setIsLoading(true);
          const history = await getConversationHistory(session.user.id);
          const formattedHistory = history.map((msg) => ({
            type: msg.role === "user" ? "user" : "ai",
            content: msg.content,
          }));
          setConversations(formattedHistory);
        } catch (error) {
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
      alert("Please sign in to continue");
      return;
    }

    const updatedConversations = [
      ...conversations,
      { type: "user", content: newTranscript },
    ];
    setConversations(updatedConversations);

    try {
      const context = await getRelevantContext(session.user.id, newTranscript);

      const aiResponse = await AiChat(
        newTranscript,
        [
          ...systemContext,
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
  };

  const handleAudioSubmit = async (content) => {
    try {
      await AiVoice(content);
    } catch (error) {
      console.log("Error trying to get audio");
    }
  };

  return (
    <div className={`flex flex-col ${className}`}>
      {/* Bot Selector Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold flex items-center">
          <span className="mr-2">{bots[currentBot].icon}</span>
          {bots[currentBot].name}
        </h2>
        {allowBotSwitch && (
          <button
            className="p-2 bg-gray-100 rounded-lg flex items-center gap-2 hover:bg-gray-200 transition-colors"
            onClick={() => setShowBotSelector(true)}
          >
            <RiRobot2Line /> Switch Bot
          </button>
        )}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto bg-white rounded-lg shadow-sm p-4 mb-4">
        {conversations.map((msg, index) => (
          <div
            key={index}
            className={`mb-4 flex ${
              msg.type === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                msg.type === "user"
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-gray-100 text-gray-800 rounded-bl-none"
              }`}
            >
              <p className="whitespace-pre-wrap break-words">{msg.content}</p>
              {msg.type === "ai" && (
                <button
                  className="mt-2 p-1 bg-white/20 rounded-md hover:bg-white/30 transition-colors"
                  onClick={() => handleAudioSubmit(msg.content)}
                >
                  <RiVoiceprintFill className="text-black rounded-md border-2 border-black text-3xl w-10 h-10" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <Dictaphone onTranscriptChange={handleTranscriptChange} />
      </div>

      {/* Bot Selector Modal */}
      {allowBotSwitch && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ${
            showBotSelector ? "block" : "hidden"
          }`}
        >
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Select AI Bot</h2>
            <div className="flex flex-col gap-3">
              {Object.entries(bots).map(([botId, bot]) => (
                <button
                  key={botId}
                  className={`p-3 rounded-lg flex items-center gap-2 transition-colors ${
                    currentBot === botId
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
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
              className="mt-4 p-2 bg-gray-200 rounded-lg w-full hover:bg-gray-300 transition-colors"
              onClick={() => setShowBotSelector(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BaseChatScreen;
