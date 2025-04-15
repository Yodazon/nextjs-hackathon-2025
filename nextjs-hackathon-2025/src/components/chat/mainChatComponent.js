"use client";

import React, { useState, useEffect } from "react";
import { RiVoiceprintFill, RiRobot2Line } from "react-icons/ri";
import Dictaphone from "./dictaphone";
import AiChat from "./aiConversation";
import BotSelector from "./botSelector";
import AiVoice from "./aiAudio";
import { useSession } from "next-auth/react";
import { useRAGChat } from "@/lib/useRAGChat";
import { getConversationHistory, getRelevantContext } from "@/lib/embeddings";
import { generateChatId } from "@/lib/generateChatID";

const BaseChatScreen = ({
  initialBot,
  allowBotSwitch = true,
  bots,
  systemContext = [],
  systemVariable = [],

  className = "h-[calc(100vh-8rem)]",
}) => {
  const [currentChatId, setCurrentChatId] = useState(null);
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

  // Initialize chat ID when component mounts
  useEffect(() => {
    if (session?.user?.id && !currentChatId) {
      setCurrentChatId(generateChatId());
    }
  }, [session?.user?.id]);

  //set new chat ID when a new bot is chosen
  useEffect(() => {
    setCurrentChatId(generateChatId());
  }, [currentBot]);

  const handleTranscriptChange = async (newTranscript) => {
    if (!session?.user) {
      alert("Please sign in to continue");
      return;
    }

    //make a new chat ID if none exists
    if (!currentChatId) {
      setCurrentChatId(generateChatId());
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
        bots[currentBot].pipeName,
        systemVariable
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
            chatId: currentChatId,
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
            className="p-2 bg-primary-main text-white rounded-lg flex items-center gap-2 hover:bg-gray-200 transition-colors"
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
                  ? "bg-primary-main text-white rounded-br-none"
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
        <BotSelector
          showBotSelector={showBotSelector}
          setShowBotSelector={setShowBotSelector}
          currentBot={currentBot}
          setCurrentBot={setCurrentBot}
          bots={bots}
        />
      )}
    </div>
  );
};

export default BaseChatScreen;
