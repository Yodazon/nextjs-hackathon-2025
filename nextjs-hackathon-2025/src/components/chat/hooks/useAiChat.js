"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRAGChat } from "@/lib/useRAGChat";
import { getConversationHistory, getRelevantContext } from "@/lib/embeddings";
import { generateChatId } from "@/lib/generateChatID";
import AiChat from "../aiConversation";
import AiVoice from "../aiAudio";

export function useAiChat() {
  const [currentChatId, setCurrentChatId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { data: session } = useSession();
  const { storeChatHistory } = useRAGChat();

  // Initialize chat ID when component mounts
  useEffect(() => {
    if (session?.user?.id && !currentChatId) {
      setCurrentChatId(generateChatId());
    }
  }, [session?.user?.id, currentChatId]);

  // Load conversation history
  const loadHistory = async () => {
    if (session?.user?.id) {
      try {
        setIsLoading(true);
        const history = await getConversationHistory(session.user.id);
        const formattedHistory = history.map((msg) => ({
          type: msg.role === "user" ? "user" : "assistant",
          content: msg.content,
          chatId: msg.chatId,
        }));
        setConversations(formattedHistory);
      } catch (error) {
        console.error("Error loading conversation history:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Load history on session change
  useEffect(() => {
    loadHistory();
  }, [session?.user?.id]);

  const sendMessage = async (
    message,
    botConfig,
    systemContext = [],
    systemVariable = [],
    shouldPlayAudio
  ) => {
    if (!session?.user) {
      throw new Error("Please sign in to continue");
    }

    // Make a new chat ID if none exists
    if (!currentChatId) {
      const newChatId = generateChatId();
      setCurrentChatId(newChatId);
    }

    const updatedConversations = [
      ...conversations,
      { type: "user", content: message, chatId: currentChatId },
    ];
    setConversations(updatedConversations);

    try {
      // Get relevant context from the current chat session
      const context = await getRelevantContext(session.user.id, message);

      // Filter conversations to only include messages from the current chat session
      const currentSessionMessages = updatedConversations
        .filter(msg => msg.chatId === currentChatId)
        .map(msg => ({
          role: msg.type === "user" ? "user" : "assistant",
          content: msg.content,
        }));

      const aiResponse = await AiChat(
        message,
        [
          ...systemContext,
          ...context,
          ...currentSessionMessages,
        ],
        botConfig.pipeName,
        systemVariable
      );

      if (aiResponse) {
        if (shouldPlayAudio) playAudio(aiResponse);
        const newConversations = [
          ...updatedConversations,
          { type: "ai", content: aiResponse, chatId: currentChatId },
        ];
        setConversations(newConversations);

        await storeChatHistory(
          newConversations.map((msg) => ({
            role: msg.type === "user" ? "user" : "assistant",
            content: msg.content,
            botType: msg.type === "user" ? null : botConfig.name,
            pipeName: msg.type === "user" ? null : botConfig.pipeName,
            chatId: currentChatId,
          }))
        );

        return aiResponse;
      }
    } catch (error) {
      console.error("Error getting AI response", error);
      throw error;
    }
  };

  const playAudio = async (content) => {
    try {
      await AiVoice(content);
    } catch (error) {
      console.error("Error trying to get audio", error);
      throw error;
    }
  };

  const resetChat = () => {
    setConversations([]);
    setCurrentChatId(generateChatId());
  };

  return {
    conversations,
    isLoading,
    sendMessage,
    resetChat,
    currentChatId,
  };
}
